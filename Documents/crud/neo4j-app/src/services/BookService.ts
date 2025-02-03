// src/services/BookService.ts
import { driver } from "../neo4j-driver";
import { Book } from "../models/Book";

export class BookService {
  // Yeni kitap oluşturma
  async createBook(book: Book): Promise<Book> {
    const session = driver.session();
    try {
      const result = await session.run(
        `CREATE (b:Book {id: $id, title: $title, author: $author, description: $description})
         RETURN b`,
        {
          id: book.id.toString(), // Neo4j'de id'yi string olarak saklamak tercih edilebilir
          title: book.title,
          author: book.author,
          description: book.description || null,
        }
      );
      const record = result.records[0];
      const node = record.get("b").properties;
      return {
        id: parseInt(node.id),
        title: node.title,
        author: node.author,
        description: node.description,
      };
    } finally {
      await session.close();
    }
  }

  // Tüm kitapları getirme (filtreleme/sıralama parametreleri destekli)
  async getAllBooks(sortField?: string, order?: string): Promise<Book[]> {
    const session = driver.session();
    try {
      // Varsayılan sorgu: tüm Book düğümlerini getir
      let query = "MATCH (b:Book) RETURN b";
      
      // Eğer sıralama alanı belirtilmişse, sorguya ORDER BY ekleyelim
      if (sortField) {
        // Sadece "id" veya "title" alanlarına izin veriyoruz
        const allowedFields = ["id", "title"];
        if (allowedFields.includes(sortField)) {
          // Sıralama yönünü belirleyelim: varsayılan "asc" (artan), aksi halde "desc"
          const orderClause = order && order.toLowerCase() === "desc" ? "DESC" : "ASC";
          query = `MATCH (b:Book) RETURN b ORDER BY b.${sortField} ${orderClause}`;
        }
      }
      
      const result = await session.run(query);
      return result.records.map(record => {
        const node = record.get("b").properties;
        return {
          id: parseInt(node.id),
          title: node.title,
          author: node.author,
          description: node.description,
        };
      });
    } finally {
      await session.close();
    }
  }

  // Belirli bir kitabı getirme
  async getBookById(id: number): Promise<Book | null> {
    const session = driver.session();
    try {
      const result = await session.run(
        `MATCH (b:Book {id: $id}) RETURN b`,
        { id: id.toString() }
      );
      if (result.records.length === 0) return null;
      const node = result.records[0].get("b").properties;
      return {
        id: parseInt(node.id),
        title: node.title,
        author: node.author,
        description: node.description,
      };
    } finally {
      await session.close();
    }
  }

  // Varolan kitabı güncelleme
  async updateBook(id: number, book: Partial<Book>): Promise<Book | null> {
    const session = driver.session();
    try {
      const result = await session.run(
        `MATCH (b:Book {id: $id})
         SET b.title = COALESCE($title, b.title),
             b.author = COALESCE($author, b.author),
             b.description = COALESCE($description, b.description)
         RETURN b`,
        {
          id: id.toString(),
          title: book.title,
          author: book.author,
          description: book.description,
        }
      );
      if (result.records.length === 0) return null;
      const node = result.records[0].get("b").properties;
      return {
        id: parseInt(node.id),
        title: node.title,
        author: node.author,
        description: node.description,
      };
    } finally {
      await session.close();
    }
  }

  // Kitap silme
  async deleteBook(id: number): Promise<boolean> {
    const session = driver.session();
    try {
      const result = await session.run(
        `MATCH (b:Book {id: $id}) DETACH DELETE b RETURN COUNT(b) AS deletedCount`,
        { id: id.toString() }
      );
      const deletedCount = result.records[0].get("deletedCount").toNumber();
      return deletedCount > 0;
    } finally {
      await session.close();
    }
  }
}
