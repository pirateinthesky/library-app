// src/routers/BookRouter.ts
import { Router, Request, Response } from "express";
import { BookService } from "../services/BookService";
import { Book } from "../models/Book";

export class BookRouter {
  public router: Router;
  private bookService: BookService;

  constructor() {
    this.router = Router();
    this.bookService = new BookService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.createBook);
    this.router.get("/", this.getAllBooks);
    this.router.get("/:id", this.getBookById);
    this.router.put("/:id", this.updateBook);
    this.router.delete("/:id", this.deleteBook);
  }

  private createBook = async (req: Request, res: Response) => {
    try {
      // Basit id üretimi: mevcut kitap sayısına göre id belirliyoruz.
      // Gerçek uygulamada, id üretimi için daha sağlam bir yöntem kullanılabilir.
      const books = await this.bookService.getAllBooks();
      const newBook: Book = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
      };
      const created = await this.bookService.createBook(newBook);
      res.status(201).json(created);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  };

  private getAllBooks = async (req: Request, res: Response) => {
    try {
      const books = await this.bookService.getAllBooks();
      res.json(books);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  };

  private getBookById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const book = await this.bookService.getBookById(id);
      if (!book) {
        res.status(404).json({ error: "Book not found" });
      } else {
        res.json(book);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  };

  private updateBook = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await this.bookService.updateBook(id, req.body);
      if (!updated) {
        res.status(404).json({ error: "Book not found" });
      } else {
        res.json(updated);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  };

  private deleteBook = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.bookService.deleteBook(id);
      if (!deleted) {
        res.status(404).json({ error: "Book not found" });
      } else {
        res.json({ message: "Book deleted successfully" });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  };
}
