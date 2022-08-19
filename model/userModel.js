const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    min: 4,
    max: 10,
  },
  name: {
    type: String,
    required: true,
    min: 5,
    max: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "Active",
  },
  statusMessage: {
    type: String,
    default: "Available to chat",
  },
  location: {
    type: String,
    default: "At Home",
  },
  contacts: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Users",
    },
  ],
});

module.exports = mongoose.model("Users", userSchema);
