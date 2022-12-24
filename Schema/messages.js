const mongoose = require('mongoose')
// const time = String(momentTime.tz(Date.now(), 'Asia/Kolkata').format())

// console.log(formattedTime);  // Output: '11:42 AM'

const messagesSchema = new mongoose.Schema({
  text: String,
  sendBy: mongoose.Types.ObjectId,
  recievedBy: mongoose.Types.ObjectId,
  time: {
    type: String,
    default: () => {
      let date = new Date()
      let options = { hour: 'numeric', minute: 'numeric', hour12: true }
      let formattedTime = date.toLocaleTimeString('en-US', options)
      return String(formattedTime)
    },
  },
})

module.exports = mongoose.model('Message', messagesSchema)
