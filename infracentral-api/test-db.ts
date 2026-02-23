import postgres from 'postgres'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL as string
const sql = postgres(connectionString)

async function testConnection() {
    try {
        const result = await sql`SELECT 1 as connected`
        console.log('✅ Connection successful!', result)
        process.exit(0)
    } catch (error) {
        console.error('❌ Connection failed:', error)
        process.exit(1)
    }
}

testConnection()
