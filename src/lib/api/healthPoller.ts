import { API_CONFIGS, ApiClient, ApiHealth } from '@/lib/api/client';

export type HealthUpdateCallback = (health: ApiHealth[]) => void;

export class HealthPoller {
  private clients: Map<string, ApiClient> = new Map();
  private intervalId?: number;
  private callbacks: Set<HealthUpdateCallback> = new Set();
  private pollInterval: number;

  constructor(pollInterval = 10000) {
    this.pollInterval = pollInterval;
    
    // Initialize API clients
    API_CONFIGS.forEach(config => {
      this.clients.set(config.name, new ApiClient(config));
    });
  }

  async checkAllHealth(): Promise<ApiHealth[]> {
    const healthPromises = Array.from(this.clients.values()).map(client =>
      client.checkHealth()
    );

    return Promise.all(healthPromises);
  }

  start() {
    if (this.intervalId) {
      return;
    }

    // Initial check
    this.checkAllHealth().then(health => {
      this.notifyCallbacks(health);
    });

    // Set up interval
    this.intervalId = window.setInterval(async () => {
      const health = await this.checkAllHealth();
      this.notifyCallbacks(health);
    }, this.pollInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  subscribe(callback: HealthUpdateCallback) {
    this.callbacks.add(callback);
    
    return () => {
      this.callbacks.delete(callback);
    };
  }

  private notifyCallbacks(health: ApiHealth[]) {
    this.callbacks.forEach(callback => callback(health));
  }
}

export const healthPoller = new HealthPoller();
