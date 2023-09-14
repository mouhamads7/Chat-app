const express = require("express");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const {
  authorizeUser,
  addUser,
  initializeUser,
  onDisconnect,
  sendMessage,
} = require("./controllers/socketController");
const { corsConfig } = require("./controllers/serverController");

const io = new Server(server, {
  cors: corsConfig,
});

const sequelize = require("./util/database");

app.use(helmet());
app.use(express.json());

app.use(cors(corsConfig));

io.use(authorizeUser);
io.on("connect", (socket) => {
  initializeUser(socket);
  socket.on("add_user", (username, callback) =>
    addUser(socket, username, callback)
  );
  socket.on("disconnecting", () => onDisconnect(socket));
  socket.on("send_message", (message) => sendMessage(socket, message));
});

const authRouter = require("./routes/authRouter");

app.use("/auth", authRouter);
app.set("trust proxy", 1);
(async () => {
  try {
    await sequelize.sync({ force: false });
    server.listen(process.env.EXTERNAL_PORT || 3001);
  } catch (error) {
    console.error(error);
  }
})();
