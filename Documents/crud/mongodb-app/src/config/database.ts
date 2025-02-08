import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB Bağlantısı Başarılı!");
}).catch(err => {
  console.error("❌ MongoDB Bağlantı Hatası:", err);
});

export default mongoose;