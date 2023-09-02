const express = require("express");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const session = require("express-session");
const Redis = require("ioredis");
const RedisStore = require("connect-redis").default;
require("dotenv").config();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const sequelize = require("./util/database");

const redisClient = new Redis({
  host: "redis",
  port: 6379,
});
app.use(helmet());
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENVIRONMENT === "production" ? "true" : "auto",
      httpOnly: true,
      sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
      expires: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

io.on("connect", (socket) => {});

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
