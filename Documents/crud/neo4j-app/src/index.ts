// src/index.ts
import express from "express";
import { BookRouter } from "./routers/BookRouter";
import { AuthorRouter } from "./routers/AuthorRouter";

const app = express();
app.use(express.json());

// BookRouter örneğini oluşturup, /api/books yoluna ekleyin
const bookRouter = new BookRouter();
app.use("/api/books", bookRouter.router);

const authorRouter = new AuthorRouter();
app.use("/api/books", bookRouter.router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
