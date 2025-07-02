import express from "express";
import controllers from "../controllers/noteControllers.js";

const { getAllNotes, createNote, getNote, editNote } = controllers;

const router = express.Router();

// Routes
router.route("/").get(getAllNotes).post(createNote);
router.route("/:id").get(getNote).put(editNote);

export default router;
