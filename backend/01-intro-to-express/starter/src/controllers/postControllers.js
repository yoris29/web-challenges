import jwt from "jsonwebtoken";
import User from "../data/user.js";
import Blog from "../data/posts.js";
import dotenv from "dotenv";
dotenv.config();

// Create an acount
const createAccount = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName.trim() || !email.trim() || !password.trim()) {
    return res
      .status(400)
      .json({ error: true, msg: "Please enter all the credentials" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      msg: "A user is already linked with this email address",
    });
  }

  const user = new User({ fullName, email, password });
  await user.save();

  const token = jwt.sign({ fullName }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return res.json({
    error: false,
    user,
    token,
    msg: "Registration Successful",
  });
};

// Login and generate jwt for a specific user
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, msg: "Please enter valid credentials" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ error: true, msg: "No account linked with this email address" });
  }

  if (user.password == password) {
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    return res.json({ error: false, msg: "Login Successful", email, token });
  } else {
    return res.status(400).json({ error: false, msg: "Invalid password" });
  }
};

// Fetch all the blogs of a certain user
const getBlogs = async (req, res) => {
  const user = req.user;
  const { author } = req.query;

  try {
    if (author) {
      const blogs_author = await Blog.find({ author, userId: user._id });

      if (blogs_author.length === 0) {
        return res
          .status(404)
          .json({ err: true, msg: `No blogs with the author ${author}` });
      }
      return res.status(200).json({
        err: false,
        msg: `${author}'s blogs found!`,
        blogs_author,
      });
    }

    const blogs = await Blog.find({ userId: user._id });

    if (!blogs) {
      return res.json({
        err: false,
        msg: "No blogs for this user at the moment",
      });
    }

    return res.status(200).json({ err: false, blogs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: true, msg: "Internal server error" });
  }
};

// Fetches a single blogId from a certain userId
const getBlog = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  try {
    const blog = await Blog.findOne({ _id: id, userId: user._id });

    if (!blog) {
      return res.json({
        err: false,
        msg: "Blog not found",
      });
    }

    return res.status(200).json({ err: false, msg: "Blog found!", blog });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: true, msg: "Internal server error" });
  }
};

// Create a new blog
const createBlog = async (req, res) => {
  const { title, content, author } = req.body;

  let missedFields = [];

  !title || title.trim() === "" ? missedFields.push("title") : "";
  !content || content.trim() === "" ? missedFields.push("content") : "";
  !author || author.trim() === "" ? missedFields.push("author") : "";

  if (missedFields.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      msg: `Missing or empty required fields: ${missedFields}`,
    });
  }

  try {
    const blog = await Blog.create({
      title,
      content,
      author,
      userId: req.user._id,
    });
    return res.json({ error: false, msg: "blog added successfuly" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: true, msg: "Internal Server Error" });
  }
};

// Edit a specific blog of a specific user
const editBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;
  const user = req.user;

  const isTitleValid = typeof title === "string" && title.trim() !== "";
  const isContentValid = typeof content === "string" && content.trim() !== "";
  const isAuthorValid = typeof author === "string" && author.trim() !== "";

  if (!isTitleValid && !isContentValid && !isAuthorValid) {
    return res.status(400).json({
      error: true,
      msg: "You must provide at least one valid field (title, content, or author)",
    });
  }

  try {
    const updatedFields = {};
    if (isTitleValid) updatedFields.title = title;
    if (isContentValid) updatedFields.content = content;
    if (isAuthorValid) updatedFields.author = author;
    updatedFields.updatedAt = new Date().getTime();

    const blog = await Blog.findOneAndUpdate(
      { _id: id, userId: user._id }, // Filter document
      updatedFields, // Updated values
      { new: true, runValidators: true, overwrite: true } // Options
    );

    if (!blog) {
      return res.status(404).json({ error: true, msg: "blog not found" });
    }

    return res
      .status(200)
      .json({ err: false, msg: "blog updated successfully", blog });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: true, msg: "Internal server error" });
  }
};

// Delete a specific blogId from a specific userId
const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const blog = await Blog.findOneAndDelete({ userId: user._id, _id: id });

    if (!blog) {
      return res
        .status(404)
        .json({ err: true, msg: "Couldn't find the blog you're looking for" });
    }
    return res
      .status(200)
      .json({ err: false, msg: "blog deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: true, msg: "Internal server error" });
  }
};

export default {
  createAccount,
  login,
  createBlog,
  editBlog,
  getBlogs,
  getBlog,
  deleteBlog,
};
