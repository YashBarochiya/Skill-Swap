
const Message = require("../models/Message");
// socket/chatSocket.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    // Join a swap room (chat per swap)
    socket.on("joinRoom", (swapId) => {
      socket.join(swapId);
      console.log(`User joined room ${swapId}`);
    });

    // Listen for new messages
    socket.on("sendMessage", ({ swapId, sender, receiver, content }) => {
      const msg = { swapId, sender, receiver, content, createdAt: new Date() };

      // Emit to everyone in the room
      io.to(swapId).emit("receiveMessage", msg);
    });

    socket.on("markAsRead", async ({ swapId, userId }) => {
        const result = await Message.updateMany(
    {
       swapId,                   // mongoose auto-casts string → ObjectId
    receiver: req.user.id,
    read: false,
    },
    { $set: { read: true } }
  );

  // notify both users
  io.to(swapId.toString()).emit("messagesRead", { swapId, userId });
});

  });
};
