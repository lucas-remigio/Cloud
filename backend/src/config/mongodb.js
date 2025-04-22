import { MongoClient } from "mongodb";

const db = process.env.DATABASE_URI || "localhost";
const atlasUri = process.env.ATLAS_URI;

// initialize the mongodb client
const connection = atlasUri || `mongodb://${db}:27017`;
console.debug("MongoDB connection string:", connection);

const client = new MongoClient(connection);

await client.connect();
const database = client.db("remigio-motivator");

export default database;
