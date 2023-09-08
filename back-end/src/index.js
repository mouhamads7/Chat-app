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
} = require("./controllers/socketController");
const {
  sessionMiddleware,
  wrap,
  corsConfig,
} = require("./controllers/serverController");

const io = new Server(server, {
  cors: corsConfig,
});

const sequelize = require("./util/database");

app.use(helmet());
app.use(express.json());
app.use(sessionMiddleware);

app.use(cors(corsConfig));

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
io.on("connect", (socket) => {
  initializeUser(socket);
  socket.on("add_user", (username, callback) =>
    addUser(socket, username, callback)
  );
  socket.on("disconnecting", () => onDisconnect(socket));
});

const authRouter = require("./routes/authRouter");

app.use("/auth", authRouter);

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("testttt");
    server.listen(process.env.EXTERNAL_PORT || 3001);
  } catch (error) {
    console.error(error);
  }
})();
