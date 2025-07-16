import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Por favor, defina a variável de ambiente MONGODB_URI dentro do arquivo .env'
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const connectWithLogs = (client: MongoClient): Promise<MongoClient> => {
  console.log("INFO: Tentando conectar ao MongoDB...");
  
  return client.connect()
    .then(connectedClient => {
      console.log("SUCCESS: Conectado ao MongoDB com sucesso!");
      return connectedClient;
    })
    .catch(err => {
      console.error("ERROR: Falha ao conectar com o MongoDB.", err);
      throw err;
    });
};


if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, {});
    globalWithMongo._mongoClientPromise = connectWithLogs(client);
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI, {});
  clientPromise = connectWithLogs(client);
}

export default clientPromise;