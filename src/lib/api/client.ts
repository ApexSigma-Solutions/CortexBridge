import axios, { AxiosInstance, AxiosError } from 'axios';

export interface ApiConfig {
  name: string;
  baseUrl: string;
  port: number;
}

export interface ApiHealth {
  name: string;
  healthy: boolean;
  lastChecked: Date;
  responseTime?: number;
  error?: string;
}

export const API_CONFIGS: ApiConfig[] = [
  {
    name: 'Omega',
    baseUrl: '/api/omega',
    port: 8765,
  },
  {
    name: 'InGest',
    baseUrl: '/api/ingest',
    port: 8766,
  },
  {
    name: 'Memos',
    baseUrl: '/api/memos',
    port: 8768,
  },
  {
    name: 'GraphParser',
    baseUrl: 'http://localhost:8000',
    port: 8000,
  },
];

import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToastStore } from '@/lib/store/useToastStore';

// ... (imports)

export class ApiClient {
  private config: ApiConfig;
  private client: AxiosInstance;

  constructor(config: ApiConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });

    // Request Interceptor: Attach Token
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Auto-Logout on 401
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
            // Prevent loop: Don't logout if the error comes from the login endpoint itself
            if (!error.config.url?.includes('/auth/token')) {
                 const { addToast } = useToastStore.getState();
                 // Only show toast if we were authenticated before (to avoid spamming on initial load)
                 if (useAuthStore.getState().isAuthenticated) {
                     addToast('Session expired. Please log in again.', 'error');
                 }
                 useAuthStore.getState().logout();
            }
        }
        return Promise.reject(error);
      }
    );
  }
// ...

  async checkHealth(): Promise<ApiHealth> {
    const startTime = performance.now();
    
    try {
      // Axios throws on 4xx/5xx by default
      await this.client.get('/health');
      
      const responseTime = performance.now() - startTime;

      return {
        name: this.config.name,
        healthy: true,
        lastChecked: new Date(),
        responseTime,
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      let errorMessage = 'Unknown error';

      if (error instanceof AxiosError) {
        errorMessage = error.message;
        if (error.response) {
            errorMessage = `${error.response.status} ${error.response.statusText}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        name: this.config.name,
        healthy: false,
        lastChecked: new Date(),
        responseTime,
        error: errorMessage,
      };
    }
  }

  async get<T>(endpoint: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data: unknown, config?: any): Promise<T> {
    const response = await this.client.post<T>(endpoint, data, config);
    return response.data;
  }
}

// Create API client instances
export const omegaClient = new ApiClient(API_CONFIGS[0]);
export const ingestClient = new ApiClient(API_CONFIGS[1]);
export const memosClient = new ApiClient(API_CONFIGS[2]);
export const graphParserClient = new ApiClient(API_CONFIGS[3]);

export interface CaptureResponse {
  success: boolean;
  file_path: string;
  nodes_created: number;
  message: string;
}


export interface VectorHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  total_records: number;
  pending_count: number;
  ready_count: number;
  failed_count: number;
  worker_running: boolean;
  error?: string;
}

export interface ServiceHealth {
  status: string;
  vault_accessible: boolean;
  neo4j_connected: boolean;
  postgres_connected: boolean;
  neo4j_error?: string;
  postgres_error?: string;
}

export interface CaptureApi {
    getRecent: () => Promise<CaptureResponse[]>;
    manualCapture: (data: unknown) => Promise<CaptureResponse>;
    getVectorHealth: () => Promise<VectorHealth>;
    getServiceHealth: () => Promise<ServiceHealth>;
    controlService: (serviceName: string, action: 'start' | 'stop' | 'restart') => Promise<{status: string, pid?: number}>;
}

export const captureApi: CaptureApi = {
    getRecent: () => omegaClient.get<CaptureResponse[]>('/capture/recent'),
    manualCapture: (data: unknown) => omegaClient.post<CaptureResponse>('/capture', data),
    getVectorHealth: () => omegaClient.get<VectorHealth>('/health/vectors'),
    getServiceHealth: () => omegaClient.get<ServiceHealth>('/health'),
    controlService: (serviceName: string, action: 'start' | 'stop' | 'restart') => 
        omegaClient.post<{status: string, pid?: number}>('/system/service', { service_name: serviceName, action })
};

export interface IngestResponse {
    ingestion_id: string;
    status: string;
    message: string;
    total_chunks?: number;
}

// Graph Parser Response (TNP-PAR-500)
export interface GraphNode {
  id: string;
  label: string;
  type: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

export interface ParseResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata?: {
    sentence_count: number;
    char_count: number;
  };
}

export interface QueueStatus {
    pending_count: number;
    processed_count: number;
    total_count: number;
    oldest_pending_age_seconds?: number;
}

export const ingestApi = {
    // Health & Queue
    getQueueStatus: () => ingestClient.get<QueueStatus>('/ingest/queue'),
    getServiceHealth: () => ingestClient.get<any>('/health'), // Basic health check

    // Ingestion Methods
    ingestText: (text: string) => ingestClient.post<IngestResponse>('/ingest/text', {
        text,
        source: 'manual_input',
        metadata: { source_type: 'manual' }
    }),

    ingestRepo: (path: string) => ingestClient.post<IngestResponse>('/ingest/python-repo', {
        source_path: path,
        repository_source: 'local',
        process_async: true
    }),

    ingestFile: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return ingestClient.post<IngestResponse>('/ingest/file', formData);
    },
    
    // Analysis
    analyzeProject: () => ingestClient.post<any>('/analysis/projects', {
        detail_level: 'comprehensive'
    }),

    // Graph Parser (TNP-PAR-500)
    parseGraph: (text: string) => graphParserClient.post<ParseResponse>('/graph/parse', { text }),
};

export interface MemosStats {
  total_memories: number;
  by_agent: Record<string, number>;
  by_tier: Record<string, number>;
  vector_dimension: number;
}

export const memosApi = {
    // Memos API (Mocked until FastMCP supports HTTP endpoints or proxy is established)
    getStats: () => Promise.resolve({
      total_memories: 0,
      by_agent: {},
      by_tier: { semantic: 0, procedural: 0 },
      vector_dimension: 1024
    }),
    search: (_query: string) => Promise.resolve({ results: [] }),
    getScratchpad: () => Promise.resolve({ content: "Scratchpad unavailable (MCP native mode)" }),
};