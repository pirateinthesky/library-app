// src/services/AuthorService.ts
import { driver } from "../neo4j-driver";

export class AuthorService {
  async getBooksByAuthor(authorName: string): Promise<any> {
    const session = driver.session();
    try {
      const result = await session.run(
        `MATCH (a:Author {name: $authorName})-[:WROTE]->(b:Book)
         WITH a, b ORDER BY b.volume ASC
         RETURN a.name AS author, collect({title: b.title, volume: b.volume, description: b.description}) AS books`,
        { authorName }
      );
      if (result.records.length === 0) return null;
      return result.records[0].toObject();
    } finally {
      await session.close();
    }
  }
}
