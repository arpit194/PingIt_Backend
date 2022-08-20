const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const chatRoutes = require("./routes/chatRoutes");
const socket = require("socket.io");

const app = express();

require("dotenv").config();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://arpit194.github.io"],
  })
);

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

const io = socket(server, {
  cors: {
    origin: ["http://localhost:3000", "https://arpit194.github.io"],
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.reciever);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  });
});
