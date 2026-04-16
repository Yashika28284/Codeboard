const roomUsers = {};

const handleSocketEvents = (io) => {
    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on("join-room", ({ roomId, username }) => {
            socket.join(roomId);
            if (!roomUsers[roomId]) roomUsers[roomId] = [];
            const alreadyIn = roomUsers[roomId].find((u) => u.username === username);
            if (!alreadyIn) roomUsers[roomId].push({ socketId: socket.id, username });
            io.to(roomId).emit("room-users", roomUsers[roomId]);
            socket.to(roomId).emit("user-joined", { username });
        });

        socket.on("code-change", ({ roomId, code, language }) => {
            socket.to(roomId).emit("code-update", { code, language });
        });

        socket.on("send-message", ({ roomId, username, message }) => {
            const timestamp = new Date().toISOString();
            io.to(roomId).emit("receive-message", { username, message, timestamp });
        });

        socket.on("leave-room", ({ roomId, username }) => {
            handleLeave(socket, io, roomId, username);
        });

        socket.on("disconnect", () => {
            for (const roomId in roomUsers) {
                const user = roomUsers[roomId].find((u) => u.socketId === socket.id);
                if (user) handleLeave(socket, io, roomId, user.username);
            }
        });
    });
};

const handleLeave = (socket, io, roomId, username) => {
    socket.leave(roomId);
    if (roomUsers[roomId]) {
        roomUsers[roomId] = roomUsers[roomId].filter((u) => u.socketId !== socket.id);
        io.to(roomId).emit("room-users", roomUsers[roomId]);
        socket.to(roomId).emit("user-left", { username });
    }
};

module.exports = { handleSocketEvents };
