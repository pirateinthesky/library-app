import { Repository } from "typeorm";
import { Book } from "../entity/Book";

export class BookService {
    private bookRepository: Repository<Book>;

    constructor(bookRepository: Repository<Book>) {
        this.bookRepository = bookRepository;
    }

    async getAllBooks(): Promise<Book[]> {
        return await this.bookRepository.find();
    }

    async getBookById(id: number): Promise<Book | null> {
        return await this.bookRepository.findOneBy({ id });
    }

    async createBook(bookData: Partial<Book>): Promise<Book> {
        const book = this.bookRepository.create(bookData);
        return await this.bookRepository.save(book);
    }

    async updateBook(id: number, bookData: Partial<Book>): Promise<Book | null> {
        const book = await this.getBookById(id);
        if (!book) return null;
        Object.assign(book, bookData);
        return await this.bookRepository.save(book);
    }

    async deleteBook(id: number): Promise<boolean> {
        const result = await this.bookRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
}
