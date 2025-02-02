import { Router } from "express";
import { BookController } from "../controller/BookController";
import { BookService } from "../service/BookService";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";

const router = Router();

const bookService = new BookService(AppDataSource.getRepository(Book));
const bookController = new BookController(bookService);

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.post("/", bookController.createBook);
router.put("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

export default router;
