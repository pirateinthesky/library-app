import express from "express";
import { BookRouter } from "./BookRouter";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// BookRouter sınıfından bir örnek oluşturuyoruz
const bookRoutes = new BookRouter();

// Oluşturduğumuz router'ı /api/books yolunda kullanıyoruz
app.use("/api/books", bookRoutes.router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});