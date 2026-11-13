import { MongoClient, Db } from 'mongodb';

// TODO (Hackathon Day): Kết nối MongoDB Atlas và xây dựng collections trong thời gian thi
const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'soulvillage';

let client: MongoClient | null = null;

export async function getMongoDb(): Promise<Db | null> {
  if (!uri) return null;
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(dbName);
}
