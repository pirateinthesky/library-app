// src/services/BookService.ts
import { driver } from "../neo4j-driver";
import { Book } from "../models/Book";

export class BookService {
  // Yeni kitap oluşturma
  async createBook(book: Book): Promise<Book> {
    const session = driver.session();
    try {
      const result = await session.run(
        `CREATE (b:Book {
           id: $id, 
           title: $title, 
           authorId: $authorId, 
           description: $description,
           addedAt: $addedAt,
           status: $status
         })
         RETURN b`,
        {
          id: book.id.toString(),
          title: book.title,
          authorId: book.authorId ? book.authorId.toString() : null,
          description: book.description || null,
          addedAt: book.addedAt,
          status: book.status
        }
      );
      const record = result.records[0];
      const node = record.get("b").properties;
      return {
        id: parseInt(node.id),
        title: node.title,
        authorId: node.authorId ? parseInt(node.authorId) : undefined,
        description: node.description,
        addedAt: node.addedAt,
        status: node.status
      };
    } finally {
      await session.close();
    }
  }

  // Tüm kitapları getirme (filtreleme/sıralama/tarih aralığı ve durum destekli)
  // src/services/BookService.ts (getAllBooks metodu güncellenmiş hali)
async getAllBooks(
  sortField?: string,
  order?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  addedAt?: string  // Yeni eklenen parametre
): Promise<Book[]> {
  const session = driver.session();
  try {
    let query = "MATCH (b:Book)";
    let conditions: string[] = [];
    let params: any = {};

    // Tarih aralığı filtresi (varsa)
    if (startDate) {
      conditions.push("date(b.addedAt) >= date($startDate)");
      params.startDate = startDate;
    }
    if (endDate) {
      conditions.push("date(b.addedAt) <= date($endDate)");
      params.endDate = endDate;
    }
    // Tam eşleşme: eklenme tarihi filtresi (string olarak)
    if (addedAt) {
      conditions.push("b.addedAt = $addedAt");
      params.addedAt = addedAt;
    }
    // Durum filtresi (varsa)
    if (status) {
      conditions.push("b.status = $status");
      params.status = status;
    }
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    // Sıralama kısmı:
    if (sortField) {
      // İzin verilen alanlar: id, title, addedAt
      const allowedFields = ["id", "title", "addedAt"];
      if (allowedFields.includes(sortField.toLowerCase())) {
        const orderClause = order && order.toLowerCase() === "desc" ? "DESC" : "ASC";
        query += ` RETURN b ORDER BY b.${sortField} ${orderClause}`;
      } else {
        query += " RETURN b";
      }
    } else {
      query += " RETURN b ORDER BY b.addedAt ASC";
    }

    const result = await session.run(query, params);
    return result.records.map(record => {
      const node = record.get("b").properties;
      return {
        id: parseInt(node.id),
        title: node.title,
        authorId: node.authorId ? parseInt(node.authorId) : undefined,
        description: node.description,
        addedAt: node.addedAt,
        status: node.status
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
        authorId: node.authorId ? parseInt(node.authorId) : undefined,
        description: node.description,
        addedAt: node.addedAt,
        status: node.status
      };
    } finally {
      await session.close();
    }
  }

  // Kitap güncelleme
  async updateBook(id: number, book: Partial<Book>): Promise<Book | null> {
    const session = driver.session();
    try {
      const result = await session.run(
        `MATCH (b:Book {id: $id})
         SET b.title = COALESCE($title, b.title),
             b.authorId = COALESCE($authorId, b.authorId),
             b.description = COALESCE($description, b.description),
             b.addedAt = COALESCE($addedAt, b.addedAt),
             b.status = COALESCE($status, b.status)
         RETURN b`,
        {
          id: id.toString(),
          title: book.title,
          authorId: book.authorId ? book.authorId.toString() : null,
          description: book.description,
          addedAt: book.addedAt,
          status: book.status,
        }
      );
      if (result.records.length === 0) return null;
      const node = result.records[0].get("b").properties;
      return {
        id: parseInt(node.id),
        title: node.title,
        authorId: node.authorId ? parseInt(node.authorId) : undefined,
        description: node.description,
        addedAt: node.addedAt,
        status: node.status
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
  async getBorrowedRelationships(): Promise<any[]> {
  const session = driver.session();
  try {
    const query = `
      MATCH (b:Book)-[r:BORROWED]->(p:Person)
      RETURN b, r, p
    `;
    const result = await session.run(query);
    return result.records.map(record => ({
      book: {
        id: parseInt(record.get("b").properties.id),
        title: record.get("b").properties.title,
        authorId: record.get("b").properties.authorId ? parseInt(record.get("b").properties.authorId) : undefined,
        description: record.get("b").properties.description,
        addedAt: record.get("b").properties.addedAt,
        status: record.get("b").properties.status,
      },
      relationship: record.get("r").properties,
      person: record.get("p").properties
    }));
  } finally {
    await session.close();
  }
}
}