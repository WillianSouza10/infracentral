-- Create Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'DIRECTOR', 'ANALYST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Tables
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role user_role DEFAULT 'ANALYST',
    avatar TEXT,
    title VARCHAR(255),
    "twoFactorEnabled" BOOLEAN DEFAULT false,
    "invitationStatus" VARCHAR(50) DEFAULT 'Pendente',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    "lastActive" VARCHAR(255) NOT NULL,
    current BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID REFERENCES users(id) ON DELETE SET NULL,
    "userStr" VARCHAR(255) NOT NULL,
    action TEXT NOT NULL,
    ip VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    login VARCHAR(255),
    password VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    cost DECIMAL(10, 2) DEFAULT 0,
    "renewalDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "acquisitionDate" TIMESTAMP WITH TIME ZONE,
    "serverIp" VARCHAR(50),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    "ipReal" VARCHAR(50),
    "ipExternal" VARCHAR(50),
    "ipInternal" VARCHAR(50),
    username VARCHAR(255),
    password VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Online',
    region VARCHAR(100) NOT NULL,
    cost DECIMAL(10, 2) DEFAULT 0,
    uptime VARCHAR(50) DEFAULT '100%',
    cpu VARCHAR(100),
    ram VARCHAR(100),
    storage VARCHAR(100),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "serverId" UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS kpi_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    trend DECIMAL(10, 2) NOT NULL,
    icon VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS acquisitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "itemName" VARCHAR(255) NOT NULL,
    requester VARCHAR(255) NOT NULL,
    approver VARCHAR(255) NOT NULL,
    installments INTEGER DEFAULT 1,
    "costCenter" VARCHAR(255) NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    category VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "providerName" VARCHAR(255) NOT NULL,
    "contractFile" VARCHAR(255) NOT NULL,
    "contractPdf" VARCHAR(255),
    "acquisitionDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "expirationDate" TIMESTAMP WITH TIME ZONE,
    "phoneNumber" VARCHAR(50) NOT NULL,
    "cellNumber" VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    "supportEmail" VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    "costRecurring" DECIMAL(10, 2) DEFAULT 0,
    "costSetup" DECIMAL(10, 2) DEFAULT 0,
    "costPenalty" DECIMAL(10, 2) DEFAULT 0,
    "durationMonths" INTEGER NOT NULL,
    "autoRenew" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
