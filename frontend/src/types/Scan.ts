export type ScanStatus = 'PENDING' | 'RUNNING' | 'FINISHED' | 'FAILED';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AttackType = 'SQL_INJECTION' | 'XSS' | 'SSRF' | 'RCE' | 'LFI' | 'CSRF' | 'OPEN_REDIRECT' | 'XXE' | 'IDOR' | 'PATH_TRAVERSAL';

export interface Attack {
  id: string;
  scanId: string;
  type: AttackType;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  endpoint?: string;
  payload?: string;
  evidence?: string;
  createdAt: string;
}

export interface Scan {
  id: string;
  targetId: string;
  userId: string;
  status: ScanStatus;
  startedAt?: string;
  finishedAt?: string;
  duration?: number;
  attacksCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  attacks?: Attack[];
  createdAt: string;
  updatedAt: string;
  target?: {
    id: string;
    name: string;
    host: string;
  };
}
