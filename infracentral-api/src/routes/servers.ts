import { Router } from 'express';
import { sql } from '../db.js';

const router = Router();

// Retrieve all servers and their applications
router.get('/', async (req, res) => {
    try {
        // We fetch servers and applications concurrently
        const [servers, applications] = await Promise.all([
            sql`SELECT * FROM servers ORDER BY name ASC`,
            sql`SELECT * FROM applications`
        ]);

        const result = servers.map(server => ({
            id: server.id,
            name: server.name,
            provider: server.provider,
            ipReal: server.ipReal,
            ipExternal: server.ipExternal,
            ipInternal: server.ipInternal,
            username: server.username,
            password: server.password,
            status: server.status,
            region: server.region,
            cost: Number(server.cost),
            uptime: server.uptime || '100%',
            // Map JSON to the frontend hardware structure seamlessly
            hardware: {
                cpu: server.cpu,
                ram: server.ram,
                storage: server.storage
            },
            applications: applications.filter(app => app.serverId === server.id).map(app => ({
                id: app.id,
                name: app.name,
                company: app.company,
                description: app.description
            }))
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching servers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new server and its applications
router.post('/', async (req, res) => {
    try {
        const { name, provider, ipReal, ipExternal, ipInternal, username, password, status, region, cost, uptime, hardware, applications } = req.body;

        const [newServer] = await sql`
      INSERT INTO servers (
        name, provider, "ipReal", "ipExternal", "ipInternal", 
        username, password, status, region, cost, uptime, cpu, ram, storage
      ) VALUES (
        ${name}, ${provider}, ${ipReal || null}, ${ipExternal}, ${ipInternal}, 
        ${username}, ${password}, ${status}, ${region}, ${cost}, ${uptime}, 
        ${hardware?.cpu || null}, ${hardware?.ram || null}, ${hardware?.storage || null}
      )
      RETURNING *;
    `;

        if (!newServer) {
            throw new Error('Failed to create server.');
        }

        // Batch insert applications if any
        const insertedApps = [];
        if (applications && applications.length > 0) {
            for (const app of applications) {
                const [insertedApp] = await sql`
          INSERT INTO applications (
            "serverId", name, company, description
          ) VALUES (
            ${newServer.id}, ${app.name}, ${app.company}, ${app.description || null}
          )
          RETURNING *;
        `;
                insertedApps.push(insertedApp);
            }
        }

        const serverResponse = {
            id: newServer.id,
            name: newServer.name,
            provider: newServer.provider,
            ipReal: newServer.ipReal,
            ipExternal: newServer.ipExternal,
            ipInternal: newServer.ipInternal,
            username: newServer.username,
            password: newServer.password,
            status: newServer.status,
            region: newServer.region,
            cost: Number(newServer.cost),
            uptime: newServer.uptime || '100%',
            hardware: { cpu: newServer.cpu, ram: newServer.ram, storage: newServer.storage },
            applications: insertedApps
        };

        res.status(201).json(serverResponse);
    } catch (error) {
        console.error('Error creating server:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a server and replace its applications
router.put('/:id', async (req, res) => {
    try {
        const serverId = req.params.id;
        const { name, provider, ipReal, ipExternal, ipInternal, username, password, status, region, cost, uptime, hardware, applications } = req.body;

        // Use a transaction since we are deleting/recreating apps
        const result = await sql.begin(async (tx: any) => {
            const [updatedServer] = await tx`
        UPDATE servers SET
          name = ${name}, 
          provider = ${provider}, 
          "ipReal" = ${ipReal || null}, 
          "ipExternal" = ${ipExternal}, 
          "ipInternal" = ${ipInternal}, 
          username = ${username}, 
          password = ${password}, 
          status = ${status}, 
          region = ${region}, 
          cost = ${cost}, 
          uptime = ${uptime}, 
          cpu = ${hardware?.cpu || null}, 
          ram = ${hardware?.ram || null}, 
          storage = ${hardware?.storage || null},
          "updatedAt" = NOW()
        WHERE id = ${serverId}
        RETURNING *;
      `;

            if (!updatedServer) {
                throw new Error('Server not found');
            }

            // Rather than a complex diff, delete old applications and insert the new state exactly as provided by the UI
            await tx`DELETE FROM applications WHERE "serverId" = ${serverId}`;

            const insertedApps = [];
            if (applications && applications.length > 0) {
                for (const app of applications) {
                    const [insertedApp] = await tx`
            INSERT INTO applications (
              "serverId", name, company, description
            ) VALUES (
              ${updatedServer.id}, ${app.name}, ${app.company}, ${app.description || null}
            )
            RETURNING *;
          `;
                    insertedApps.push(insertedApp);
                }
            }

            return {
                id: updatedServer.id,
                name: updatedServer.name,
                provider: updatedServer.provider,
                ipReal: updatedServer.ipReal,
                ipExternal: updatedServer.ipExternal,
                ipInternal: updatedServer.ipInternal,
                username: updatedServer.username,
                password: updatedServer.password,
                status: updatedServer.status,
                region: updatedServer.region,
                cost: Number(updatedServer.cost),
                uptime: updatedServer.uptime || '100%',
                hardware: { cpu: updatedServer.cpu, ram: updatedServer.ram, storage: updatedServer.storage },
                applications: insertedApps
            };
        });

        res.json(result);
    } catch (error) {
        if (error instanceof Error && error.message === 'Server not found') {
            res.status(404).json({ error: 'Server not found' });
            return;
        }
        console.error('Error updating server:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a server
router.delete('/:id', async (req, res) => {
    try {
        const serverId = req.params.id;

        // Deleting the server will automatically cascade to applications based on the DB schema
        const [deletedServer] = await sql`
      DELETE FROM servers WHERE id = ${serverId} RETURNING id;
    `;

        if (!deletedServer) {
            return res.status(404).json({ error: 'Server not found' });
        }

        res.json({ message: 'Server deleted successfully' });
    } catch (error) {
        console.error('Error deleting server:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
