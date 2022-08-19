const express = require("express");

const chatController = require("../controllers/chatController");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get("/getConvos", chatController.getAllConversations);
router.get("/getConvo/:convoId", chatController.getMessagesByConvoId);
router.get("/isContact/:userId", chatController.checkIsContact);
router.post("/sendMessage", chatController.sendMessage);

module.exports = router;
