const { default: mongoose } = require("mongoose");
const User = require("../model/userModel");
const Conversation = require("../model/conversationModel");

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { image } = req.body;
    const user = await User.findById(userId);
    user.isAvatarImageSet = true;
    user.avatarImage = image;

    const result = await user.save();

    return res.json({
      isSet: user.isAvatarImageSet,
      image: user.avatarImage,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllContacts = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate(
      "contacts",
      "_id name userName avatarImage"
    );
    if (user) {
      return res.json({
        contacts: user.contacts,
        status: true,
      });
    } else {
      return res.json({
        message: "Could not retrieve contacts",
        status: false,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.getUsersByUserName = async (req, res, next) => {
  try {
    const users = await User.find({
      userName: { $regex: req.params.userName },
    }).select(["_id", "name", "userName", "avatarImage"]);
    return res.json({ users });
  } catch (err) {
    next(err);
  }
};

module.exports.addContact = async (req, res, next) => {
  try {
    const { contactId } = req.body;
    const userId = req.userId;

    if (userId === contactId) {
      return res.json({
        message: "Cannot add yourself as a contact",
        status: false,
      });
    }

    const contact = await User.findById(contactId);
    const user = await User.findById(userId);

    let isContact = false;
    user.contacts.forEach((con) => {
      if (con.toString() === contact._id.toString()) {
        isContact = true;
      }
    });
    if (isContact) {
      return res.json({
        message: contact.name + " is already a contact",
        status: false,
      });
    }

    const conversationExists = await Conversation.find({
      $and: [{ users: user._id }, { users: contact._id }],
    });

    let result,
      convo = null;

    if (conversationExists.length > 0) {
      user.contacts.push(contact["_id"]);
      result = await user.save();
    } else {
      const createdConversation = new Conversation({
        users: [user._id, contact._id],
      });
      try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        convo = await createdConversation.save({ session: sess });

        user.contacts.push(contact["_id"]);
        result = await user.save({ session: sess });

        await sess.commitTransaction();
      } catch (err) {
        return res.json({
          message:
            "Could not add " + contact.name + " as contact. Please try again.",
          status: false,
        });
      }
    }

    if (result) {
      return res.json({
        message: contact.name + " added as contact.",
        status: true,
        convo: convo,
      });
    } else {
      return res.json({
        message:
          "Could not add " + contact.name + " as contact. Please try again.",
        status: false,
      });
    }
  } catch (err) {
    next(err);
  }
};
