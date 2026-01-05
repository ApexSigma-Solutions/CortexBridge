import { useAuditLogStore, AuditAction } from '@/lib/store/useAuditLogStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollText, Trash2, Database, Inbox, Search, LogIn, AlertTriangle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const actionIcons: Record<AuditAction, typeof Inbox> = {
  capture: Inbox,
  ingest: Database,
  search: Search,
  login: LogIn,
  logout: LogIn,
  alert: AlertTriangle,
  error: XCircle,
};

const actionColors: Record<AuditAction, string> = {
  capture: 'text-blue-400',
  ingest: 'text-green-400',
  search: 'text-purple-400',
  login: 'text-cyan-400',
  logout: 'text-gray-400',
  alert: 'text-amber-400',
  error: 'text-red-400',
};

export function AuditLogViewer() {
  const { logs, clearLogs } = useAuditLogStore();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ScrollText className="h-4 w-4" /> Audit Log
          </CardTitle>
          <CardDescription>Recent system activity</CardDescription>
        </div>
        {logs.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearLogs}>
            <Trash2 className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-auto">
        {logs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <ScrollText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => {
              const Icon = actionIcons[log.action];
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <Icon className={`h-4 w-4 mt-0.5 ${actionColors[log.action]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{log.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] flex-shrink-0">
                    {log.action}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
