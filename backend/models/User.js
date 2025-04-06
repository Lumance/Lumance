const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password: {
    type: String,
    minlength: 6
  },
  isGoogleAuth: {
    type: Boolean,
    default: false
  },
  monthlyAllowance: {
    type: Number,
    default: 0
  },
  monthlyExpenditure: {
    type: Number,
    default: 0
  },
  totalExpenditure: {
    type: Number,
    default: 0
  },
  totalCredited: {
    type: Number,
    default: 0
  },
  chatHistory: [{
    type: String
  }]
}, { timestamps: true })

// Hash the password before saving if not using Google Authentication
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isGoogleAuth) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User