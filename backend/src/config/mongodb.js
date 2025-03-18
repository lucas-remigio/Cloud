import { MongoClient } from "mongodb";

const db = process.env.DATABASE_URI || "localhost";

// initialize the mongodb client
const client = new MongoClient(`mongodb://${db}:27017`);
await client.connect();
const database = client.db("remigio-motivator");

export default database;
