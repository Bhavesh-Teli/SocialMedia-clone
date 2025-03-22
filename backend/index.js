import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.route.js";
dotenv.config();

const app = express();

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World", success: true });
});

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

app.use('/api/v1/users',userRoutes);
app.use('/api/v1/post',postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
