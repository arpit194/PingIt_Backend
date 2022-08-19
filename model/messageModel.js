const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Conversations",
  },
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Users",
  },
});

module.exports = mongoose.model("Messages", messageSchema);
