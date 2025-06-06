import mongoose from 'mongoose';

const monthlySummarySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true // faster queries for user's summaries
    },
    resetDate: {
        type: Date,
        required: true
    },
    monthYear: {
        type: String, // e.g., "March 2025"
        required: true
    },
    monthNumber: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },    
    monthlyAllowance: {
        type: Number,
        required: true
    },
    totalMonthlyExpenditure: {
        type: Number,
        required: true
    },
    totalMonthlyCredit: {
        type: Number,
        required: true
    },
    monthlyTransactions: [{
        transactionId: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            trim: true
        },
        type: {
            type: String,
            enum: ['debit', 'credit'],
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        description: {
            type: String,
            trim: true
        }
    }],
    monthlyRecurringExpenses: [{
        recurringId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        interval: {
            type: String,
            enum: ['weekly', 'monthly'],
            required: true
        },
        transactionIds: [{
            type: String,
            default: []
        }],
        lastApplied: {
            type: Date,
            default: null,
        }
    }],
    monthlyExtraCredits: [{
        creditId: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        source: {
            type: String,
            trim: true
        },
        date: {
            type: Date,
            required: true
        },
        notes: {
            type: String,
            trim: true
        }
    }]
}, {
    timestamps: {
        createdAt: 'accountCreatedAt',
        updatedAt: true
    }
});

// Pre-save hook to auto-generate the `month` field based on current date
monthlySummarySchema.pre('validate', function (next) {
    if (!this.monthYear || !this.monthNumber || !this.year) {
        let now = this.resetDate || new Date();

        // If Feb 29 (leap year), treat it as March
        if (now.getDate() === 29 && now.getMonth() === 1) {
            now = new Date(now.getFullYear(), 2, 1); // March 1
        }

        this.monthYear = now.toLocaleString('en-US', { year: 'numeric', month: 'long' }); // e.g., "April 2025"
        this.monthNumber = now.getMonth() + 1;
        this.year = now.getFullYear();
    }

    next();
});

// Compound index for quick lookups by user + month
monthlySummarySchema.index({ userId: 1, monthNumber: 1, year: 1 }, { unique: true });

const MonthlySummary = mongoose.model('MonthlySummary', monthlySummarySchema, 'MonthlySummaries');

export default MonthlySummary;