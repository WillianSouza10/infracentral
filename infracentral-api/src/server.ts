import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { sql } from './db.js';
import serversRouter from './routes/servers.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (req: Request, res: Response) => {
    try {
        // Basic query to check the DB connection pool
        await sql`SELECT 1`;
        res.status(200).json({ status: 'OK', database: 'Connected' });
    } catch (error) {
        console.error('Database connection failed', error);
        res.status(503).json({ status: 'Error', database: 'Disconnected' });
    }
});

// Mount modular routers
app.use('/api/servers', serversRouter);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
