const express = require("express");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const session = require("express-session");
require("dotenv").config();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const sequelize = require("./util/database");

app.use(helmet());
app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET", "POST", "PUT", "DELETE");
//   next();
// });
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
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

const registerRoute = require("./routes/registerRouter");
const authRouter = require("./routes/authRouter");

// app.use("/register", registerRoute);
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
