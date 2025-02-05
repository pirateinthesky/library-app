// src/models/Book.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document {
  id: number;           // Eğer uygulama mantığınız gerektiriyorsa, bunu kendiniz oluşturabilirsiniz.
  title: string;
  author: string;       // MongoDB'de direkt yazar adını saklayabiliriz.
  description?: string;
  addedAt: Date;        // Yayınlanma veya eklenme tarihi
  status: string;       // "in_stock" veya "lent" gibi durum bilgisi
}

const BookSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  addedAt: { type: Date, required: true },
  status: { type: String, required: true }
});

// Modeli dışa aktarın:
export default mongoose.model<IBook>("Book", BookSchema);