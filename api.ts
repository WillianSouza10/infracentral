import { Server, User } from './types';

const API_BASE_URL = 'http://localhost:3333/api';

export const api = {
    servers: {
        getAll: async (): Promise<Server[]> => {
            const response = await fetch(`${API_BASE_URL}/servers`);
            if (!response.ok) throw new Error('Failed to fetch servers');
            return response.json();
        },
        create: async (server: Server): Promise<Server> => {
            const response = await fetch(`${API_BASE_URL}/servers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(server)
            });
            if (!response.ok) throw new Error('Failed to create server');
            return response.json();
        },
        update: async (id: string, server: Server): Promise<Server> => {
            const response = await fetch(`${API_BASE_URL}/servers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(server)
            });
            if (!response.ok) throw new Error('Failed to update server');
            return response.json();
        },
        delete: async (id: string): Promise<void> => {
            const response = await fetch(`${API_BASE_URL}/servers/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete server');
        }
    }
};
