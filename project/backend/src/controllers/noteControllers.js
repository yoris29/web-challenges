import prisma from "../prisma-client.js";

const getAllNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (notes.length === 0) {
      return res
        .status(200)
        .json({ err: false, msg: "No blogs at the moment" });
    }

    return res.status(200).json(notes);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: true, msg: "Internal server error" });
  }
};

const getNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await prisma.note.findUnique({
      where: { id: parseInt(id) },
    });

    if (!note) {
      return res.status(404).json({ err: true, msg: "Note not found" });
    }

    return res.status(200).json(note);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: true, msg: "Internal server error" });
  }
};

const createNote = async (req, res) => {
  const { title, content, authorName, isPublic } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ err: true, msg: "You have to enter a title and content" });
  }

  try {
    const createdNote = await prisma.note.create({
      data: { title, content, authorName, isPublic },
    });

    return res.status(201).json(createdNote);
  } catch (err) {
    console.log(err);
    return res.status(500).json("Internal server error");
  }
};

const editNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, authorName, isPublic } = req.body;

  const isTitleValid = typeof title === "string" && title.trim() !== "";
  const isContentValid = typeof content === "string" && content.trim() !== "";
  const isAuthorNameValid =
    typeof authorName === "string" && authorName.trim() !== "";
  const isPublicValid = typeof isPublic === "boolean";

  if (!isTitleValid && !isContentValid && !isAuthorValid && !isPublicValid) {
    return res.status(400).json({
      error: true,
      msg: "You must provide at least one valid field (title, content, author or isPublic)",
    });
  }

  try {
    const updatedFields = {};
    isTitleValid ? (updatedFields.title = title) : "";
    isContentValid ? (updatedFields.content = content) : "";
    isAuthorNameValid ? (updatedFields.authorName = authorName) : "";
    isPublicValid ? (updatedFields.isPublic = isPublic) : "";

    const note = await prisma.note.update({
      where: { id: parseInt(id) },
      data: updatedFields,
    });

    if (!note) {
      return res.status(404).json("Note not found");
    }

    return res.status(200).json({ msg: "Note updated successfully", note });
  } catch (err) {
    console.log(err);
    return res.status(500).json("Internal server error");
  }
};

export default { getAllNotes, createNote, getNote, editNote };
