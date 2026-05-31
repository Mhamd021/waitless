export interface JoinQueueResponse {
  id: string;
  name: string;
  position: number;
  token: string;
  queueName: string;
  trackingUrl: string;
}

export interface EntryStatusResponse {
  name: string;
  position: number;
  status: string;
  ahead: number;
  queueName: string;
  isQueueOpen: boolean;
  queueId: string;
  estimatedWaitMinutes: number;
  avgServiceTimeMinutes: number;
}

export interface ActiveEntry {
  id: string;
  name: string;
  position: number;
  status: string;
  token: string;
  email: string | null;
}