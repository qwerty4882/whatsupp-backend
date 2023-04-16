const { text } = require('body-parser')
const Message = require('../Schema/messages')
const User = require('../Schema/user')

const messageread = async (id) => {
  const makereadtrue = await Message.findByIdAndUpdate(
    {
      _id: id,
    },
    {
      read: true,
    }
  )
}

const messagepost = async (req, res) => {
  const { UserId } = req.user
  const message = await Message.create({ ...req.body, sendBy: UserId })
  res.status(201).json({ message })
  const user = await User.findOneAndUpdate(
    { _id: req.body.recievedBy },
    {
      $addToSet: {
        Chats: UserId,
      },
    }
  )
}
const messagedeleate = async (req, res) => {
  const message = await Message.deleteOne({ ...req.body })
  res.status(201).json({ message })
}
const messageget = async (req, res) => {
  const { UserId } = req.user
  const { recievedBy } = req.body
  const sendBy = UserId
  // console.log(UserId)
  const messagees = await Message.find({
    $or: [
      { sendBy: sendBy, recievedBy: recievedBy },
      { recievedBy: sendBy, sendBy: recievedBy },
    ],
  }).sort({ _id: 1 })

  let requiredMessages = messagees.map(({ text, _id, sendBy }) => {
    let sendid = String(sendBy)
    if (sendid === UserId) {
      host = 'sendbyme'
    } else {
      host = 'recivedbyme'
    }
    return { text, _id, host }
  })
  res.status(201).json({ requiredMessages })
  for (let i = 0; i < messagees.length; i++) {
    let id = messagees[i]._id.toString()
    messageread(id)
  }
}

const messageRead = async (req, res) => {
  const { UserId } = req.user
  const message = await Message.findOneAndUpdate(
    { ...req.body, recievedBy: UserId },
    {
      read: true,
    },
    {
      upsert: true,
      sort: { _id: -1 },
    }
  )
  res.status(201).json({ message })
}

const addchats = async (req, res) => {
  const { UserId } = req.user
  const { newChat } = req.body
  const user = await User.findOneAndUpdate(
    { _id: UserId },
    {
      $addToSet: {
        Chats: newChat,
      },
    }
  )
  res.status(201).json({ user })
}
const removechats = async (req, res) => {
  const { UserId } = req.user
  const { newChat } = req.body
  const user = await User.findOneAndUpdate(
    { _id: UserId },
    {
      $pull: {
        Chats: String(newChat),
      },
    }
  )
  res.status(201).json({ user })
}

const givechats = async (req, res) => {
  const { UserId } = req.user
  const user = await User.findOne({ _id: UserId })
  const { Chats } = user
  let chats = []
  for (i = 0; i < Chats.length; i++) {
    const user = await User.findOne({ _id: Chats[i] })
    const { Name, image, _id } = user
    const message = await Message.findOne({
      $or: [
        { sendBy: Chats[i], recievedBy: UserId },
        { recievedBy: Chats[i], sendBy: UserId },
      ],
    }).sort({ _id: -1 })
    let unreadmessage = 0
    const messagees = await Message.find({
      $or: [
        { sendBy: Chats[i], recievedBy: UserId },
        { recievedBy: Chats[i], sendBy: UserId },
      ],
    }).sort({ _id: 1 })
    messagees.map((item) => {
      if (!item.read && item.sendBy == Chats[i]) {
        unreadmessage++
      }
    })
    if (message == null) {
      chats.push({ _id, Name, image, text: '', time: '' })
    } else {
      const { text, time } = message
      chats.push({ _id, Name, image, text, time, unreadmessage })
    }
  }

  res.status(201).json({ chats })
}

module.exports = {
  messagepost,
  messageget,
  addchats,
  removechats,
  givechats,
  messagedeleate,
  messageRead,
}
