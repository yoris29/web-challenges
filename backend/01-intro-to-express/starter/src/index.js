import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import logger from "./middlewares/logger.js";
import blogs from "./routes/posts.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(logger);
app.use("/", blogs);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};
start();
