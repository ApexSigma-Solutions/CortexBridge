import { create } from 'zustand';
import { ApiHealth } from '@/lib/api/client';

interface SystemState {
  // API Health State
  apiHealth: ApiHealth[];
  setApiHealth: (health: ApiHealth[]) => void;

  // UI State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // System Info
  systemStatus: 'online' | 'degraded' | 'offline';
  updateSystemStatus: () => void;
}

export const useSystemStore = create<SystemState>((set, get) => ({
  // API Health State
  apiHealth: [],
  setApiHealth: (health) => {
    set({ apiHealth: health });
    get().updateSystemStatus();
  },

  // UI State
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  // System Status
  systemStatus: 'offline',
  updateSystemStatus: () => {
    const { apiHealth } = get();
    
    if (apiHealth.length === 0) {
      set({ systemStatus: 'offline' });
      return;
    }

    const healthyCount = apiHealth.filter(api => api.healthy).length;
    const totalCount = apiHealth.length;

    if (healthyCount === totalCount) {
      set({ systemStatus: 'online' });
    } else if (healthyCount > 0) {
      set({ systemStatus: 'degraded' });
    } else {
      set({ systemStatus: 'offline' });
    }
  },
}));
