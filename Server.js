import app from "./src/app.js";
import { createServer } from "node:http";
import dotenv from "dotenv";
import connectDB from "./src/db/inden.js";
const server = createServer(app);
dotenv.config();

connectDB();
const PORT = process.env.PORT || 4001;

server.listen(PORT, () => {
  console.log("Server is running on port 4001");
});
