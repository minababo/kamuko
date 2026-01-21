function initSockets(io) {
    io.on("connection", (socket) => {
      socket.on("join", ({ userId }) => {
        if (!userId) return;
        socket.join(`user:${userId}`);
      });
  
      socket.on("disconnect", () => {});
    });
  }
  
  function emitOrderStatus(io, userId, payload) {
    io.to(`user:${userId}`).emit("order.status.updated", payload);
  }
  
  module.exports = { initSockets, emitOrderStatus };  