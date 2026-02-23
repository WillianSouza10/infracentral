
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  DIRECTOR = 'DIRECTOR',
  ANALYST = 'ANALYST',
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  avatar: string;
  title: string;
  twoFactorEnabled?: boolean;
  invitationStatus?: 'Ativo' | 'Pendente';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  ip: string;
}

export interface UserSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface Domain {
  id: string;
  url: string;
  provider: string;
  login?: string;
  password?: string;
  status: 'Active' | 'Expiring' | 'Expired';
  cost: number;
  renewalDate: string;
  acquisitionDate?: string;
  serverIp?: string;
}

export interface Application {
  id: string;
  name: string;
  company: string;
  description?: string;
}

export interface Server {
  id: string;
  name: string;
  provider: string;
  ipReal?: string; // Keeping this for backward compatibility or remove if not needed, but let's keep it and add the new ones
  ipExternal: string;
  ipInternal: string;
  username?: string;
  password?: string;
  status: 'Online' | 'Offline' | 'Maintenance' | 'Deactivated';
  region: string;
  cost: number;
  uptime: string;
  applications?: Application[];
  hardware: {
    cpu: string;
    ram: string;
    storage: string;
  };
}

export interface KpiData {
  label: string;
  value: string;
  trend: number;
  icon: string;
}

export interface Acquisition {
  id: string;
  itemName: string;
  requester: string;
  approver: string;
  installments: number;
  costCenter: string;
  value: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  category: string;
}

export interface ServiceContract {
  id: string;
  providerName: string;
  contractFile: string;
  contractPdf?: string | null;
  acquisitionDate: string;
  expirationDate?: string;
  phoneNumber: string;
  cellNumber: string;
  email: string;
  supportEmail: string;
  category: string;
  costs: {
    recurring: number;
    setup: number;
    penalty: number;
  };
  durationMonths: number;
  autoRenew: boolean;
}
