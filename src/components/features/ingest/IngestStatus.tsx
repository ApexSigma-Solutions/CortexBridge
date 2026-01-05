import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ingestApi, QueueStatus } from '@/lib/api/client';
import { Database, Clock, Layers, Inbox } from 'lucide-react';



export function IngestStatus() {
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const data = await ingestApi.getQueueStatus();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch ingest queue status', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds?: number) => {
    if (seconds === undefined || seconds === null) return '0s';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  if (loading && !status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ingestion Queue</CardTitle>
        </CardHeader>
        <CardContent>Loading metrics...</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Pending Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Queue</CardTitle>
          <Inbox className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{status?.pending_count || 0}</div>
          <p className="text-xs text-muted-foreground">
            Conversations waiting
          </p>
        </CardContent>
      </Card>

      {/* Processed Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processed</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{status?.processed_count || 0}</div>
          <p className="text-xs text-muted-foreground">
            Total ingested successfully
          </p>
        </CardContent>
      </Card>

      {/* Latency/Age */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wait Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDuration(status?.oldest_pending_age_seconds)}</div>
          <p className="text-xs text-muted-foreground">
            Age of oldest pending item
          </p>
        </CardContent>
      </Card>

      {/* Total Volume */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          <Layers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{status?.total_count || 0}</div>
          <p className="text-xs text-muted-foreground">
            Lifetime conversations
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
