import { useEffect } from 'react';
import { Activity, CheckCircle2, XCircle, Clock, Play, Square } from 'lucide-react';
import { useSystemStore } from '@/lib/store/systemStore';
import { healthPoller } from '@/lib/api/healthPoller';
import { ApiHealth, captureApi } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuditLogViewer } from '@/components/features/AuditLogViewer';
import { AnalyticsWidgets } from '@/components/features/AnalyticsWidgets';

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

  const handleControl = (name: string, action: 'start' | 'stop') => {
      // Cast to any to bypass generic build issues
      (captureApi as any).controlService(name, action).then(() => healthPoller.checkNow());
  };

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

      {/* Analytics */}
      <AnalyticsWidgets />

      {/* API Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {apiHealth.length === 0 ? (
          <Card className="col-span-3">
            <CardContent>
              <div className="text-center py-8">
                <Activity className="mx-auto mb-3 text-secondary" size={48} />
                <p className="text-secondary">Checking API status...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          apiHealth.map((api: ApiHealth) => (
            <Card key={api.name}>
              <CardHeader>
                <CardTitle>{`${api.name} API`}</CardTitle>
              </CardHeader>
              <CardContent>
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
                
                {/* Control Actions */}
                 <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                    {api.healthy ? (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10" 
                            onClick={() => handleControl(api.name, 'stop')} 
                            disabled={api.name === 'Omega'}
                        >
                             <Square className="w-3 h-3 mr-2" fill="currentColor" /> Stop Service
                        </Button>
                    ) : (
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full h-8 text-xs text-green-500 hover:text-green-600 hover:bg-green-500/10" 
                            onClick={() => handleControl(api.name, 'start')} 
                            disabled={api.name === 'Omega'}
                        >
                             <Play className="w-3 h-3 mr-2" fill="currentColor" /> Start Service
                        </Button>
                    )}
                </div>
              </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Bottom Section: Audit Log & System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audit Log */}
        <AuditLogViewer />

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
