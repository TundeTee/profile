import express from "express";
import { createUser, deleteUser, getUsers, updateUser, uploadUserImage } from "../controllers/user.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", upload.single("image"), createUser);
router.post("/upload", upload.single("image"), uploadUserImage);
router.put("/:id", upload.single("image"), updateUser);
router.delete("/:id", deleteUser);

export default router;