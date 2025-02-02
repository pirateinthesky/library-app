import { Router, Request, Response } from "express";

interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
}

export class BookRouter {
  public router: Router;
  private books: Book[]; 

  constructor() {
    this.router = Router();
    this.books = [];
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.getAllBooks);
    this.router.get("/:id", this.getBookById);
    this.router.post("/", this.createBook);
    this.router.put("/:id", this.updateBook);
    this.router.delete("/:id", this.deleteBook);
  }

  private getAllBooks = (req: Request, res: Response) => {
    res.json(this.books);
  };

  private getBookById = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const book = this.books.find((b) => b.id === id);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
    } else {
      res.json(book);
    }
  };

private createBook = (req: Request, res: Response) => {
  const { title, author, description } = req.body;
  const newBook: Book = { id: this.books.length + 1, title, author, description };
  this.books.push(newBook);
  res.status(201).json(newBook);
};

  private updateBook = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { title, author } = req.body;
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Book not found" });
    } else {
      const updatedBook: Book = { id, title, author };
      this.books[index] = updatedBook;
      res.json(updatedBook);
    }
  };

  private deleteBook = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Book not found" });
    } else {
      this.books.splice(index, 1);
      res.json({ message: "Book deleted successfully" });
    }
  };
}