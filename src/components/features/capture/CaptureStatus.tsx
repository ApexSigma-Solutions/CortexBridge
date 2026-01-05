import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { captureApi, VectorHealth, ServiceHealth } from '@/lib/api/client';
import { Activity, Database, HardDrive, Server } from 'lucide-react';

export function CaptureStatus() {
  const [vectorHealth, setVectorHealth] = useState<VectorHealth | null>(null);
  const [serviceHealth, setServiceHealth] = useState<ServiceHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const [vHealth, sHealth] = await Promise.all([
        captureApi.getVectorHealth(),
        captureApi.getServiceHealth(),
      ]);
      setVectorHealth(vHealth);
      setServiceHealth(sHealth);
    } catch (error) {
      console.error('Failed to fetch capture health', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !vectorHealth) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>Loading health metrics...</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Overall Service Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Service Health</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {serviceHealth?.status || 'Unknown'}
          </div>
          <p className="text-xs text-muted-foreground">
            Vault: {serviceHealth?.vault_accessible ? 'OK' : 'Error'} | 
            DB: {serviceHealth?.postgres_connected ? 'OK' : 'Error'}
          </p>
        </CardContent>
      </Card>

      {/* Vector Queue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vector Queue</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {vectorHealth?.pending_count || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Pending embeddings
          </p>
        </CardContent>
      </Card>

      {/* Vector Store */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vector Store</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {vectorHealth?.total_records || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Total indexed vectors
          </p>
        </CardContent>
      </Card>

       {/* Worker Status */}
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Embedding Worker</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={vectorHealth?.worker_running ? 'success' : 'error'}>
              {vectorHealth?.worker_running ? 'Running' : 'Stopped'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Failures: {vectorHealth?.failed_count || 0}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
