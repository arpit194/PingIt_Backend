const express = require("express");

const profileController = require("../controllers/profileController");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.post("/setAvatar", profileController.setAvatar);

router.get("/allContacts", profileController.getAllContacts);

router.get("/getUsers/:userName", profileController.getUsersByUserName);

router.post("/addContact", profileController.addContact);

module.exports = router;
