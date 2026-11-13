import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'soulvillage';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR.
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

/**
 * Lấy đối tượng Database từ MongoDB Atlas Connection Pool
 * Tự động trả về null an toàn nếu chưa cấu hình MONGODB_URI để hệ thống fallback sang In-Memory/LocalStorage
 */
export async function getMongoDb(): Promise<Db | null> {
  if (!uri || !clientPromise) {
    return null;
  }

  try {
    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
  } catch (err) {
    console.warn('MongoDB connection failed, falling back to local storage:', err);
    return null;
  }
}
