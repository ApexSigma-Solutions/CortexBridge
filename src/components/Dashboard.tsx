import { useEffect } from 'react';
import { Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useSystemStore } from '@/lib/store/systemStore';
import { healthPoller } from '@/lib/api/healthPoller';
import { ApiHealth } from '@/lib/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function Dashboard() {
  const { apiHealth, setApiHealth } = useSystemStore();

  useEffect(() => {
    // Start health polling
    healthPoller.start();

    // Subscribe to health updates
    const unsubscribe = healthPoller.subscribe((health: ApiHealth[]) => {
      setApiHealth(health);
    });

    return () => {
      unsubscribe();
      healthPoller.stop();
    };
  }, [setApiHealth]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          Welcome to CortexBridge
        </h2>
        <p className="text-secondary">
          The Executive Control Plane for the ApexSigma Ecosystem
        </p>
      </div>

      {/* API Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {apiHealth.length === 0 ? (
          <Card className="col-span-3">
            <div className="text-center py-8">
              <Activity className="mx-auto mb-3 text-secondary" size={48} />
              <p className="text-secondary">Checking API status...</p>
            </div>
          </Card>
        ) : (
          apiHealth.map((api: ApiHealth) => (
            <Card key={api.name} title={`${api.name} API`}>
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-secondary text-sm">Status</span>
                  <div className="flex items-center gap-2">
                    {api.healthy ? (
                      <>
                        <CheckCircle2 size={16} className="text-green-500" />
                        <Badge variant="success">Healthy</Badge>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="text-red-500" />
                        <Badge variant="error">Unhealthy</Badge>
                      </>
                    )}
                  </div>
                </div>

                {/* Response Time */}
                {api.responseTime !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-secondary text-sm">Response Time</span>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-secondary" />
                      <span className="text-primary font-mono text-sm">
                        {api.responseTime.toFixed(0)}ms
                      </span>
                    </div>
                  </div>
                )}

                {/* Last Checked */}
                <div className="flex items-center justify-between">
                  <span className="text-secondary text-sm">Last Checked</span>
                  <span className="text-primary text-sm">
                    {api.lastChecked.toLocaleTimeString()}
                  </span>
                </div>

                {/* Error */}
                {api.error && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-red-500 text-xs font-mono">
                      {api.error}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* System Information */}
      <Card title="System Information">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-tertiary text-sm mb-1">Omega API</div>
            <div className="text-primary font-semibold">Port 8765</div>
          </div>
          <div>
            <div className="text-tertiary text-sm mb-1">InGest API</div>
            <div className="text-primary font-semibold">Port 8766</div>
          </div>
          <div>
            <div className="text-tertiary text-sm mb-1">Memos API</div>
            <div className="text-primary font-semibold">Port 8768</div>
          </div>
          <div>
            <div className="text-tertiary text-sm mb-1">Total APIs</div>
            <div className="text-primary font-semibold">3</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
