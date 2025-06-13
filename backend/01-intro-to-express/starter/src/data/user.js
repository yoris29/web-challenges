import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    set: (str) => (str === "" ? undefined : str),
  },
  email: {
    type: String,
    required: true,
    set: (str) => (str === "" ? undefined : str),
  },
  password: {
    type: String,
    required: true,
    set: (str) => (str === "" ? undefined : str),
  },
  createdAt: { type: Date, default: new Date().getTime() },
});

export default mongoose.model("User", UserSchema);
