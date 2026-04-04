// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//   sender: String,
//   content: String,
//   timestamp: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Message', messageSchema);

//uparna code thi like je pahela banavelu hatu je only group ni jem vato thay evu hatu pan nichenu karo to jeni hare vato karvi hoy personal 
//only one fiel add karvani chhe reciever vali...


const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: { type: String, default: null }, // null means group chat
  content: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema); //jo aa export no hoy to aavi  error aavti hati  ke   TypeError: Message.find is not a function... tya em natu kidhu ke messge model export nathi pan em kidhu ke message.find is not a function means controller ne message model malyu j nathi to kem .find fun lagave em...

