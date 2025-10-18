import express from "express";
import dotenv from "dotenv";
import path from "path";
import {connectDB} from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT  || 5000;

app.use(cors());
app.use(express.json());
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(UPLOAD_DIR));

app.use("/api/users", userRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get(/.*/,(req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server running on http://localhost:"+ PORT);
});


