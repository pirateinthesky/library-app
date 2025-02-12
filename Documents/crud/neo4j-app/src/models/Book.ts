export interface Book {
  id: number;      
  title: string;
  authorId?: number;
  description?: string;
  volume?: number;
  addedAt: string;
  status: string;
}
