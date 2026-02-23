import postgres from 'postgres';
import 'dotenv/config';

// Initialize the global sql connection
const connectionString = process.env.DATABASE_URL as string;

// The sql object is automatically a connection pool suitable for the Express application.
export const sql = postgres(connectionString);
