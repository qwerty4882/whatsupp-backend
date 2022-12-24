const User = require('../Schema/user')

const getuser = async (req, res) => {
  const { name } = req.query
  const { UserId } = req.user
  let result = await User.find({
    Name: { $regex: name, $options: 'i' },
    _id: { $ne: UserId },
  }).sort({ _id: -1 })
  newResult = result.map(({ _id, Name, image, email }) => ({
    _id,
    Name,
    image,
    email,
  }))
  res.status(200).json({ newResult })
}
module.exports = { getuser }
