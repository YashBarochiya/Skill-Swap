const express = require("express");
const db = require("./config/dbconnection");
const http = require("http")
const { Server } = require("socket.io");
const authRoutes = require("./routes/auth");
const skillRoutes = require("./routes/skill");
const profileRoutes = require("./routes/profiles");
const swapRoutes = require("./routes/swap")
const swapRequestRoutes = require("./routes/swaprequest")
const messageRoutes = require("./routes/message");
const searchRoutes = require("./routes/search")
const reviewRoutes = require("./routes/review")
const adminRoutes = require("./routes/admin")
const cors = require("cors")
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});
app.use(cors({
  // origin: "*",   // allow all (for development)
  origin: "http://localhost:5173", // safer way
  credentials: true
}));
require("./socket/chatsocket")(io);
app.use(express.json());



app.use("/api/auth", authRoutes); //all route work properly
app.use("/api/skills", skillRoutes);//all route work properly
app.use("/api/profile", profileRoutes);// all route work properly
app.use("/api/swap-requests", swapRequestRoutes);// all route work properly
app.use("/api/swaps", swapRoutes);// all route work properly
app.use("/api/messages", messageRoutes); // all route work properly
app.use("/api/search",searchRoutes); // all route work properly
app.use("/api/review",reviewRoutes); // all route work properly
app.use("/api/admin",adminRoutes); // all route work properly


app.get("/",(req,res)=>{
    res.send("hello");
})
server.listen(process.env.PORT, () => {
  console.log("🚀 Server running");
});