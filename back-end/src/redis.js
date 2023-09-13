const Redis = require("ioredis");
const redisClient = new Redis({
  host: "redis",
  port: 6379,
});

module.exports = redisClient;
