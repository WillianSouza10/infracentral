
import { Domain, Server, User, UserRole, KpiData, Acquisition, AuditLog, UserSession } from './types';

export const USERS: User[] = [
  {
    id: '1',
    name: 'Lucca Alves',
    email: 'lucca@infracentral.com',
    role: UserRole.ADMIN,
    title: 'Admin (Acesso Total)',
    avatar: 'https://ui-avatars.com/api/?name=Lucca+Alves&background=3b82f6&color=fff',
    twoFactorEnabled: true,
    invitationStatus: 'Ativo'
  },
  {
    id: '2',
    name: 'Marcus Simei',
    email: 'marcus@infracentral.com',
    role: UserRole.MANAGER,
    title: 'Gerente (Aprovação)',
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Simei&background=10b981&color=fff',
    twoFactorEnabled: false,
    invitationStatus: 'Ativo'
  },
  {
    id: '3',
    name: 'William Souza',
    email: 'william@infracentral.com',
    role: UserRole.DIRECTOR,
    title: 'Diretor (KPIs)',
    avatar: 'https://ui-avatars.com/api/?name=William+Souza&background=f59e0b&color=fff',
    twoFactorEnabled: true,
    invitationStatus: 'Ativo'
  },
];

export const AUDIT_LOGS: AuditLog[] = [];

export const USER_SESSIONS: UserSession[] = [];

export const DOMAINS: Domain[] = [];

export const SERVERS: Server[] = [];

export const KPIS: KpiData[] = [];

export const ACQUISITIONS: Acquisition[] = [];

export const SERVICES: import('./types').ServiceContract[] = [];
