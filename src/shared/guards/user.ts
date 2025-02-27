interface Application {
  id: string;
  description: string;
  code: string;
}

interface Company {
  id: string;
  description: string;
  cell: string;
  cfpiva: string;
}

interface ApplicationTenantDB {
  id: string;
  application: Application;
  company: Company;
  database_connection: string;
}

export interface AccessApp {
  id: string;
  application_tenant_db: ApplicationTenantDB;
  applicationFunctionalData: JSON; // Puoi cambiare il tipo in base al contenuto reale se necessario
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  company?: {
    id: string;
    description: string;
    cell: string;
    cfpiva: string;
  };
  createdAt: Date;
  updatedAt: Date;
  picture: string | null;
  password: string;
  access_app: AccessApp[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  company?: {
    id: string;
    description: string;
    cell: string;
    cfpiva: string;
  };
  createdAt: Date;
  updatedAt: Date;
  picture: string | null;
  password: string;
  access_app: AccessApp;
}