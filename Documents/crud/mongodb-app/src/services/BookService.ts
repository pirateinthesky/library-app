// src/services/BookService.ts
import Book, { IBook } from "../models/Book";

export class BookService {
  // Yeni kitap ekleme
  async createBook(bookData: Partial<IBook>): Promise<IBook> {
    const book = new Book(bookData);
    return await book.save();
  }

  // Tüm kitapları getirme (filtreleme ve sıralama destekli)
  // src/services/BookService.ts (getAllBooks metodu)
async getAllBooks(
  sortField?: string,
  order?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  addedAt?: string
): Promise<IBook[]> {
  let filter: any = {};

  // Tarih aralığı filtresi
  if (startDate || endDate) {
    filter.addedAt = {};
    if (startDate) {
      filter.addedAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.addedAt.$lte = new Date(endDate);
    }
  }
  if (addedAt) {
    // Eğer tam eşleşme istiyorsanız:
    filter.addedAt = new Date(addedAt);
  }
  if (status) {
    filter.status = status;
  }

  // Sıralama ayarları
  let sortOption: any = {};
  if (sortField) {
    const sortDir = order && order.toLowerCase() === "desc" ? -1 : 1;
    sortOption[sortField] = sortDir;
  } else {
    sortOption["addedAt"] = 1;
  }

  // Mongoose sorgusuna collation ekleyerek Türkçe sıralama yapılmasını sağlayabilirsiniz:
  return await Book.find(filter)
    .sort(sortOption)
    .collation({ locale: 'tr', strength: 2 })  // Türkçe diline özgü sıralama
    .exec();
}

  // Belirli bir kitabı getirme
  async getBookById(id: number): Promise<IBook | null> {
    return await Book.findOne({ id }).exec();
  }

  // Kitap güncelleme
  async updateBook(id: number, bookData: Partial<IBook>): Promise<IBook | null> {
    return await Book.findOneAndUpdate({ id }, bookData, { new: true }).exec();
  }

  // Kitap silme
  async deleteBook(id: number): Promise<boolean> {
    const result = await Book.deleteOne({ id }).exec();
    return result.deletedCount !== undefined && result.deletedCount > 0;
  }
}