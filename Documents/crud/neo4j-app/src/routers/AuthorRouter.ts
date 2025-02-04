// src/routers/AuthorRouter.ts
import { Router, Request, Response } from "express";
import { AuthorService } from "../services/AuthorService";

export class AuthorRouter {
  public router: Router;
  private authorService: AuthorService;

  constructor() {
    this.router = Router();
    this.authorService = new AuthorService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/books", this.getBooksByAuthor);
  }

  private getBooksByAuthor = async (req: Request, res: Response) => {
    try {
      const { authorName } = req.body;
      const data = await this.authorService.getBooksByAuthor(authorName);
      if (!data) {
        res.status(404).json({ error: "Author or books not found" });
      } else {
        res.json(data);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
