import express from "express";
import controllers from "../controllers/noteControllers.js";

const { fn } = controllers;

const router = express.Router();

// Routes
router.route("/").get(fn);

export default router;
