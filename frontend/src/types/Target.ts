export type TargetType = 'WEB' | 'API' | 'NETWORK' | 'MOBILE';
export type TargetStatus = 'ACTIVE' | 'INACTIVE' | 'SCANNING';

export interface Target {
  id: string;
  userId: string;
  name: string;
  type: TargetType;
  host: string;
  port?: number;
  description?: string;
  status: TargetStatus;
  lastScanAt?: string;
  scansCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTargetDto {
  name: string;
  type: TargetType;
  host: string;
  port?: number;
  description?: string;
}
