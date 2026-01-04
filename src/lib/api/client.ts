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
    baseUrl: import.meta.env.VITE_API_OMEGA_URL || 'http://localhost:8765',
    port: 8765,
  },
  {
    name: 'InGest',
    baseUrl: import.meta.env.VITE_API_INGEST_URL || 'http://localhost:8766',
    port: 8766,
  },
  {
    name: 'Memos',
    baseUrl: import.meta.env.VITE_API_MEMOS_URL || 'http://localhost:8768',
    port: 8768,
  },
];

export class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  async checkHealth(): Promise<ApiHealth> {
    const startTime = performance.now();
    
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseTime = performance.now() - startTime;

      return {
        name: this.config.name,
        healthy: response.ok,
        lastChecked: new Date(),
        responseTime,
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      
      return {
        name: this.config.name,
        healthy: false,
        lastChecked: new Date(),
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Create API client instances
export const omegaClient = new ApiClient(API_CONFIGS[0]);
export const ingestClient = new ApiClient(API_CONFIGS[1]);
export const memosClient = new ApiClient(API_CONFIGS[2]);
