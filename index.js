const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { Socket } = require("socket.io");

const app = express();

require("dotenv").config();

app.use(cors());

app.use(express.json());

app.use("/api/auth", userRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/chat", chatRoutes);

app.use((req, res, next) => {
  return { message: "Not Found" };
});

mongoose
  .connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err.message));

const server = app.listen(process.env.PORT, () => {
  console.log("Server started on port " + process.env.PORT);
});
