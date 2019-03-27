import mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  password: {
    type: String,
    required: false,
    trim: true
  },
  facebookProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
  twitterProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
