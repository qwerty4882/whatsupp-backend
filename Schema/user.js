const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 25,
    unique: true,
  },
  email: {
    type: String,
    require: [true, 'please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'please provide valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    require: [true, 'please provide password'],
    minlength: 6,
  },
  Chats: {
    type: Array,
    default: [],
  },
  image: {
    type: String,
    default:
      'https://i.ibb.co/znD6GHt/dll-Mnl-Uo5x-PZi-b18x-KW9-transformed-1.jpg',
  },
})

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

UserSchema.methods.createJwt = function (name) {
  return jwt.sign(
    { userId: this._id, name: name || this.name },
    'TjWnZr4u7x!z%C*F-JaNdRgUkXp2s5v8',
    { expiresIn: '30d' }
  )
}

module.exports = mongoose.model('User', UserSchema)
