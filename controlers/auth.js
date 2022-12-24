const User = require('../Schema/user')
const jwt = require('jsonwebtoken')
const customAPIError = require('../errors/custom api errors')
const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJwt()
  res.status(201).json({ user: { name: user.Name, image: user.image }, token })
}
const login = async (req, res) => {
  // console.log(req.body)
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw new customAPIError('Invalid Credentials', 400)
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new customAPIError('wrong password', 400)

    return
  }
  const token = user.createJwt(user.Name)
  res.status(201).json({ user: { name: user.Name, image: user.image }, token })
}
module.exports = { register, login }
