import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL as string;
const sql = postgres(connectionString);

async function runMigration() {
    console.log('🔄 Starting database migration...');

    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Execute the raw SQL schema
        await sql.unsafe(schemaSql);

        console.log('✅ Migration completed successfully! Tables created.');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        // End the connection gracefully
        await sql.end();
    }
}

runMigration();
