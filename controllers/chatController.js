const { default: mongoose } = require("mongoose");
const User = require("../model/userModel");
const Conversation = require("../model/conversationModel");
const Message = require("../model/messageModel");

module.exports.getAllConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      users: req.userId,
    }).populate("users", "_id name userName avatarImage");
    return res.json({ conversations, status: true });
  } catch (err) {
    next(err);
  }
};

module.exports.getMessagesByConvoId = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.convoId,
    });
    if (messages.length > 0) {
      return res.json({ messages, status: true });
    } else {
      return res.json({ status: false, message: "No Messages Found" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.checkIsContact = async (req, res, next) => {
  try {
    const user = await User.find({
      _id: req.userId,
      contacts: req.params.userId,
    });
    if (user.length > 0) {
      return res.json({ status: true });
    } else {
      return res.json({ status: false });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.sendMessage = async (req, res, next) => {
  try {
    const { message, sender, conversationId } = req.body;
    const newMessage = await Message.create({
      message,
      sender,
      conversationId,
    });
    if (newMessage) {
      return res.json({ status: true, message: newMessage });
    } else {
      return res.json({ status: false, message: "Message not sent" });
    }
  } catch (err) {
    next(err);
  }
};
