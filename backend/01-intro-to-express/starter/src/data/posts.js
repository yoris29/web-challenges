import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: new Date().getTime() },
  updatedAt: { type: Date, default: new Date().getTime() },
});

export default mongoose.model("Blog", BlogSchema);
