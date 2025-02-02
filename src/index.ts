import express from "express";
import { AppDataSource } from "./data-source";
import bookRoutes from "./routes/bookRoutes";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Veritabanı bağlantısını başlatıyoruz
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");

        // /api/books endpoint'ini tanımlıyoruz
        app.use("/api/books", bookRoutes);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => console.log("Error during Data Source initialization", error));
