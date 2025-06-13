import auth from "../middlewares/jwtAuth.js";
import express from "express";
import controllers from "../controllers/postControllers.js";
const {
  createAccount,
  login,
  createBlog,
  editBlog,
  getBlogs,
  getBlog,
  deleteBlog,
} = controllers;

const router = express.Router();

// Auth routes
router.route("/login").post(login);
router.route("/createAccount").post(createAccount);

// Blog routes
router.get("/posts", auth, getBlogs);
router.get("/posts/:id", auth, getBlog);
router.post("/posts", auth, createBlog);
router.put("/posts/:id", auth, editBlog);
router.delete("/posts/:id", auth, deleteBlog);

export default router;
