const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// In-memory store for messages and OTPs
let messageStore = [];
let otpStore = {}; // { mobile: { otp: string, expires: timestamp } }

io.on("connection", (socket) => {
  console.log("⚡ user connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`socket ${socket.id} joined ${room}`);
    const roomMessages = messageStore.filter((m) => m.room === room);
    socket.emit("room_history", roomMessages);
  });

  socket.on("request_otp", (mobile) => {
    if (!mobile.match(/^\+\d{7,12}$/)) {
      socket.emit("error", { message: "Invalid mobile number format" });
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[mobile] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min expiry
    console.log(`OTP for ${mobile}: ${otp}`); // Log OTP to console
    socket.emit("otp_generated");
  });

  socket.on("verify_otp", ({ mobile, otp }) => {
    const stored = otpStore[mobile];
    if (stored && stored.otp === otp && Date.now() < stored.expires) {
      delete otpStore[mobile]; // Clear OTP after successful verification
      socket.emit("otp_verified", { success: true });
    } else {
      socket.emit("otp_verified", { success: false });
    }
  });

  socket.on("send_message", (msg) => {
    if (!msg || !msg.id) return;
    // Validate file size (e.g., max 5MB)
    if (msg.file && msg.fileData) {
      const fileSize = Buffer.byteLength(msg.fileData, "base64") / (1024 * 1024);
      if (fileSize > 5) {
        socket.emit("error", { message: "File size exceeds 5MB limit" });
        return;
      }
    }
    msg.status = "delivered";
    messageStore.push(msg);
    if (msg.room) io.to(msg.room).emit("receive_message", msg);
    else io.emit("receive_message", msg);
  });

  socket.on("typing", ({ user, room }) => {
    if (room) socket.to(room).emit("typing", user);
    else socket.broadcast.emit("typing", user);
  });

  socket.on("delete_message", (id) => {
    messageStore = messageStore.filter((m) => m.id !== id);
    io.emit("message_deleted", id);
  });

  socket.on("edit_message", ({ id, newText }) => {
    messageStore = messageStore.map((m) =>
      m.id === id ? { ...m, text: newText, edited: true } : m
    );
    io.emit("message_edited", { id, newText });
  });

  socket.on("react_message", ({ id, reaction }) => {
    messageStore = messageStore.map((m) =>
      m.id === id ? { ...m, reactions: [...(m.reactions || []), reaction] } : m
    );
    io.to(messageStore.find((m) => m.id === id).room).emit("message_reacted", { id, reaction });
  });

  socket.on("message_seen", (id) => {
    messageStore = messageStore.map((m) =>
      m.id === id ? { ...m, status: "seen" } : m
    );
    io.emit("message_seen", id);
  });

  socket.on("get_all_messages", () => {
    socket.emit("all_messages", messageStore);
  });

  socket.on("disconnect", () => {
    console.log("❌ user disconnected", socket.id);
  });
});

app.get("/", (req, res) => res.send("Chat server running"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));