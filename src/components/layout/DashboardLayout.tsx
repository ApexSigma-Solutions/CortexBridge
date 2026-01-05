import { ReactNode } from 'react';
import {
  LayoutDashboard,
  Activity,
  Database,
  FileText,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { useSystemStore } from '@/lib/store/systemStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertBanner } from '@/components/ui/alert-banner';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '#dashboard' },
  { name: 'Omega API', icon: Activity, href: '#omega' },
  { name: 'InGest API', icon: Database, href: '#ingest' },
  { name: 'Memos API', icon: FileText, href: '#memos' },
  { name: 'Settings', icon: Settings, href: '#settings' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarCollapsed, toggleSidebar, systemStatus, theme, toggleTheme } = useSystemStore();
  const { user, logout } = useAuthStore();

  const getStatusBadge = () => {
    switch (systemStatus) {
      case 'online':
        return <Badge variant="success">Online</Badge>;
      case 'degraded':
        return <Badge variant="warning">Degraded</Badge>;
      case 'offline':
        return <Badge variant="error">Offline</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-base">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } bg-elevated border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">CB</span>
              </div>
              <span className="text-primary font-semibold">CortexBridge</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-card text-secondary transition-colors"
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-card text-secondary hover:text-primary transition-colors"
              title={sidebarCollapsed ? item.name : undefined}
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </a>
          ))}
        </nav>

        {/* System Status */}
        <div className="p-4 border-t border-border">
          {!sidebarCollapsed ? (
            <div className="space-y-2">
              <div className="text-xs text-tertiary uppercase font-semibold">
                System Status
              </div>
              {getStatusBadge()}
            </div>
          ) : (
            <div className="flex justify-center">{getStatusBadge()}</div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-16 bg-elevated border-b border-border flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-primary">
            ApexSigma Control Plane
          </h1>
          <div className="flex items-center gap-2">
            {user && (
              <span className="text-xs text-secondary mr-2 hidden md:inline">
                {user.email}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title="Sign Out"
            >
              <LogOut size={20} />
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <AlertBanner />
          {children}
        </div>
      </main>
    </div>
  );
}
