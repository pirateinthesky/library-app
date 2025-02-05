// src/index.ts
import express from "express";
import { connectDB } from "./config/database";
import { BookRouter } from "./routers/BookRouter";

const app = express();
app.use(express.json());

// MongoDB bağlantısını başlatın
connectDB();

// BookRouter'ı ekleyin
const bookRouter = new BookRouter();
app.use("/api/books", bookRouter.router);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});