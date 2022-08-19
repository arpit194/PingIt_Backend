const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
    default: "chat",
  },
  users: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Users",
    },
  ],
});

module.exports = mongoose.model("Conversations", conversationSchema);
