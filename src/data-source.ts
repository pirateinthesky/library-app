import "reflect-metadata";
import { DataSource } from "typeorm";
import { Book } from "./entity/Book";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",      
    port: 3306,
    username: "root",
    password: "root",           
    database: "library_db",
    synchronize: true,
    logging: false,
    entities: [Book],
    migrations: [],
    subscribers: [],
});

