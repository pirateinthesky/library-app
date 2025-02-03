import neo4j from "neo4j-driver";

const uri = "bolt://localhost:7687";
const user = "neo4j";
const password = "your_password"; // Neo4j şifrenizi girin

export const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

process.on("exit", () => {
  driver.close();
});
