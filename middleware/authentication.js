const User = require('../Schema/user')
const jwt = require('jsonwebtoken')
const customAPIError = require('../errors/custom api errors')
const auth = async (req, res, next) => {
  //check headers
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new customAPIError('Authentication invalid', 401)
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, 'TjWnZr4u7x!z%C*F-JaNdRgUkXp2s5v8')
    // attach the user to the job routes
    req.user = { UserId: payload.userId, name: payload.name }
    next()
  } catch (error) {
    throw new customAPIError('Authentication invalid', 401)
  }
}

module.exports = auth
