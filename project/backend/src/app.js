import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notesRouter from "./routes/notes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/notes", notesRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
