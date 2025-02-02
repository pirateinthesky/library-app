import { Request, Response } from "express";
import { BookService } from "../service/BookService";

export class BookController {
    private bookService: BookService;

    constructor(bookService: BookService) {
        this.bookService = bookService;
    }

    getAllBooks = async (req: Request, res: Response) => {
        try {
            const books = await this.bookService.getAllBooks();
            res.json(books);
        } catch (err) {
            res.status(500).json({ error: "An error occurred" });
        }
    };

    getBookById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const book = await this.bookService.getBookById(id);
            if (!book) return res.status(404).json({ error: "Book not found" });
            res.json(book);
        } catch (err) {
            res.status(500).json({ error: "An error occurred" });
        }
    };

    createBook = async (req: Request, res: Response) => {
        try {
            const book = await this.bookService.createBook(req.body);
            res.status(201).json(book);
        } catch (err) {
            res.status(500).json({ error: "An error occurred" });
        }
    };

    updateBook = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const book = await this.bookService.updateBook(id, req.body);
            if (!book) return res.status(404).json({ error: "Book not found" });
            res.json(book);
        } catch (err) {
            res.status(500).json({ error: "An error occurred" });
        }
    };

    deleteBook = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const success = await this.bookService.deleteBook(id);
            if (!success) return res.status(404).json({ error: "Book not found" });
            res.json({ message: "Book deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: "An error occurred" });
        }
    };
}
