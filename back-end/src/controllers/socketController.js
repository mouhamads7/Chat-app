const redisClient = require("../redis");

module.exports.authorizeUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user)
    next(new Error("Not authorized"));
  else {
    next();
  }
};

module.exports.initializeUser = async (socket) => {
  socket.user = { ...socket.request.session.user };
  socket.join(socket.user.userid);
  redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userid,
    "connected",
    "true"
  );
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  const parsedFriendList = await parseFriendList(friendList);
  const friendRooms = parsedFriendList.map((friend) => friend.userid);
  if (friendRooms.length > 0)
    socket
      .to(friendRooms)
      .emit("connected", "true", socket.user.username, parsedFriendList);
  socket.emit("friends", parsedFriendList);

  const messageQuery = await redisClient.lrange(
    `chat:${socket.user.userid}`,
    0,
    -1
  );
  const messages = messageQuery.map((message) => {
    const messageArray = message.split(".");
    return {
      to: messageArray[0],
      from: messageArray[1],
      content: messageArray[2],
    };
  });
  if (messages && messages.length > 0) socket.emit("messages", messages);
};

module.exports.addUser = async (socket, username, callback) => {
  if (username === socket.user.username) {
    callback({ done: false, error: "Cannot add yourself as a friend" });
    return;
  }
  const friend = await redisClient.hgetall(`userid:${username}`);
  if (!friend.userid) {
    callback({ done: false, error: "User does not exist" });
    return;
  }
  const currentFriendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  if (currentFriendList && currentFriendList.indexOf(username) !== -1) {
    callback({ done: false, error: "Friend already added" });
    return;
  }
  await redisClient.lpush(
    `friends:${socket.user.username}`,
    [username, friend.userid].join(".")
  );
  const addedFriend = {
    username: username,
    userid: friend.userid,
    connected: friend.connected,
  };
  callback({ done: true, addedFriend });
};

module.exports.onDisconnect = async (socket) => {
  await redisClient.hset(
    `userid:${socket.user.username}`,
    "connected",
    "false"
  );
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  const parsedFriendList = await parseFriendList(friendList);
  const friendRooms = await parseFriendList(friendList).then((friends) =>
    friends.map((friend) => friend.userid)
  );
  socket
    .to(friendRooms)
    .emit("connected", "false", socket.user.username, parsedFriendList);
};

const parseFriendList = async (friendList) => {
  const newFriendList = [];
  for (let friend of friendList) {
    const parsedFriend = friend.split(".");
    const connected = await redisClient.hget(
      `userid:${parsedFriend[0]}`,
      "connected"
    );
    newFriendList.push({
      username: parsedFriend[0],
      userid: parsedFriend[1],
      connected: connected,
    });
  }
  return newFriendList;
};

module.exports.sendMessage = async (socket, message) => {
  message.from = socket.user.userid;
  const messageString = [message.to, message.from, message.content].join(".");
  await redisClient.lpush(`chat:${message.to}`, messageString);
  await redisClient.lpush(`chat:${message.from}`, messageString);
  socket.to(message.to).emit("receive_message", message);
};
