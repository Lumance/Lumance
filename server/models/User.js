import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import MonthlySummary from './MonthlySummary.js';
import { computeNextActualResetDate, getNextDueDate } from '../utils/utils.js'

const { Schema, model } = mongoose;

// Transaction subdocument schema
const transactionSchema = new Schema({
  transactionId: {
    type: String,
    unique: true,
    index: true,
    required: true,
    default: () => uuidv4()
  },
  amount: { type: Number, required: true },
  category: { type: String, required: true, trim: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  description: { type: String, trim: true }, // AI-generated description suggestion
  date: { type: Date, default: Date.now },
  isRecurring: { type: Boolean, default: false },
  linkedRecurringId: { type: String, default: null }
}, { _id: false, timestamps: true });

// Recurring expense subdocument schema
const recurringExpenseSchema = new Schema({ // make functions to check for recurring expense irrespective of monthly reset
  recurringId: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  interval: { type: String, enum: ['weekly', 'monthly'], required: true },
  nextDue: { type: Date, required: true },
  transactionIds: { type: [String], default: [] }, // array of transaction IDs linked to this recurring expense
  lastApplied: { type: Date, default: null },
  preferredResetDate: { type: Number, min: 1, max: 31 }
}, { timestamps: true, _id: false });

// Main user schema
const userSchema = new Schema({
  userId: { type: String, unique: true, index: true, default: () => uuidv4() },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password: { type: String, default: null },
  isGoogleAuth: { type: Boolean, default: false },
  isOnboarded: { type: Boolean, default: false },
  avatarUrl: { type: String, default: '' }, // create a default user avatar in files or google avatar if available

  preferences: {
    theme: { type: String, default: 'dark' },
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' }
  },

  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  monthlyAllowance: { type: Number, default: 0 },
  monthlyExtraCredit: {
    total: { type: Number, default: 0 },
    credits: [{
      creditId: { type: String, required: true }, // custom ID
      amount: { type: Number, required: true },
      source: { type: String, trim: true },
      date: { type: Date, default: Date.now },
      notes: { type: String, trim: true } // AI-generated from source
    }]
  },

  totalExpenditure: { type: Number, default: 0 },
  totalCredited: { type: Number, default: 0 },
  savingsGoal: { type: Number, default: 0 },

  aiChatHistory: [{
    sender: { type: String, enum: ['user', 'bot'], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  transactions: [transactionSchema],
  recurringExpenses: [recurringExpenseSchema],

  notifications: {
    spendAlerts: { type: Boolean, default: true },
    goalReminders: { type: Boolean, default: true }
  },

  auditLogs: [{
    action: {
      type: String,
      required: true,
      enum: ['created', 'updated', 'deleted', 'login', 'logout', 'passwordChanged', 'goalSet', 'preferenceChanged'],
      trim: true
    },
    performedBy: { type: String, default: 'self', trim: true }, // 'self' or system/admin/etc.
    ipAddress: { type: String, trim: true }, // optional IP tracking
    timestamp: { type: Date, default: Date.now },
    details: { type: String, trim: true }
  }],

  preferredResetDate: {
    type: Number,
    min: 1,
    max: 31,
    default: 1, // default to 1st of every month
  },
  actualResetDate: {
    type: Date, // Last time reset actually happened (adjusted for leap/short months)
    default: Date.now,
  },
}, {
  timestamps: {
    createdAt: 'accountCreatedAt',
    updatedAt: true
  }
});

// Generate a unique userId if not provided
userSchema.pre('save', function (next) {
  if (!this.userId) this.userId = uuidv4();
  next();
});

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isGoogleAuth) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (inputPassword) {
  if (!this.password) {
    throw new Error('No password set for this user or is a Google Auth User.');
  }

  return await bcrypt.compare(inputPassword, this.password);
};

// Monthly reset method with leap year logic
userSchema.methods.resetMonthlyData = async function () {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed (0 = Jan)
  const currentYear = now.getFullYear();

  // Target: previous month
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // First and last day of previous month
  const startOfPrevMonth = new Date(prevYear, prevMonth, 1);
  const endOfPrevMonth = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59);

  // Filter transactions for the previous month only
  const previousMonthTransactions = (this.transactions || []).filter(txn => {
    const txnDate = new Date(txn.date);
    return txnDate >= startOfPrevMonth && txnDate <= endOfPrevMonth;
  });

  // Filter recurring expenses for the previous month
  const previousMonthRecurringExpenses = (this.recurringExpenses || []).filter(exp => {
    const expDate = new Date(exp.lastApplied || exp.createdAt);
    return expDate >= startOfPrevMonth && expDate <= endOfPrevMonth;
  });
  // Calculate totals for that month
  const totalMonthlyExpenditure = previousMonthTransactions
    .filter(txn => txn.type === 'debit')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const totalMonthlyCredit = previousMonthTransactions
    .filter(txn => txn.type === 'credit')
    .reduce((sum, txn) => sum + txn.amount, 0);

  // Create Monthly Summary
  try {
    await MonthlySummary.create({
      userId: this.userId,
      resetDate: this.actualResetDate,
      monthlyAllowance: this.monthlyAllowance,
      totalMonthlyExpenditure,
      totalMonthlyCredit,
      monthlyTransactions: previousMonthTransactions.map(txn => ({
        transactionId: txn.transactionId,
        amount: txn.amount,
        category: txn.category,
        type: txn.type,
        date: txn.date,
        description: txn.description
      })),
      monthlyRecurringExpenses: previousMonthRecurringExpenses.map(exp => ({
        recurringId: exp.recurringId,
        name: exp.name,
        amount: exp.amount,
        interval: exp.interval,
        transactionIds: exp.transactionIds,
      })),
      monthlyExtraCredits: this.monthlyExtraCredit.credits || []
    });
  } catch (error) {
    console.error('Error creating Monthly Summary:', error);
    throw error;
  }

  // Reset current month values
  this.monthlyAllowance = 0;
  this.monthlyExtraCredit = {
    total: 0,
    credits: []
  };
  this.actualResetDate = computeNextActualResetDate(this.preferredResetDate);

  await this.save();
};

// ✅ Apply Weekly/Monthly Recurring Expenses
userSchema.methods.checkAndApplyRecurringExpenses = async function () {
  const today = new Date();

  for (let expense of this.recurringExpenses) {
    if (expense.nextDue <= today) {
      const newTxnId = uuidv4();

      this.transactions.push({
        transactionId: newTxnId,
        amount: expense.amount,
        category: expense.name,
        type: "debit",
        description: `Auto-debit for ${expense.name}`,
        date: expense.nextDue,
        isRecurring: true,
        linkedRecurringId: expense.recurringId,
      });

      this.totalExpenditure += expense.amount;
      expense.lastApplied = new Date(expense.nextDue);

      // Calculate next due
      if (expense.interval === "weekly") {
        expense.nextDue = new Date(expense.nextDue.setDate(expense.nextDue.getDate() + 7));
      } else if (expense.interval === "monthly") {
        const preferredDay = expense.preferredResetDate || expense.nextDue.getDate();
        expense.nextDue = getNextDueDate(preferredDay, expense.nextDue);
      }

      expense.transactionIds.push(newTxnId);
    }
  }

  await this.save();
};

const User = model('User', userSchema, 'Users');
export default User;