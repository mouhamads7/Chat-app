const redisClient = require("../redis");

module.exports.reqLimiter = (reqLimit, timeout) => async (req, res, next) => {
  //remove the slice after testing
  const ip = req.headers["x-forwarded-for"] || req.connection.remteAddress;
  const [response] = await redisClient
    .multi()
    .incr(ip)
    .expire(ip, timeout)
    .exec();
  if (response[1] > reqLimit)
    res.json({ loggedIn: false, message: "Try again in a minute." });
  else next();
};
