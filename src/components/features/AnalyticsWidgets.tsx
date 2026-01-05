import { useAnalyticsStore } from '@/lib/store/useAnalyticsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Inbox, Database, Search, Clock } from 'lucide-react';

export function AnalyticsWidgets() {
  const { totalCaptures, totalIngestions, totalSearches, activeSessionMinutes } = useAnalyticsStore();

  const metrics = [
    { label: 'Captures', value: totalCaptures, icon: Inbox, color: 'text-blue-400' },
    { label: 'Ingestions', value: totalIngestions, icon: Database, color: 'text-green-400' },
    { label: 'Searches', value: totalSearches, icon: Search, color: 'text-purple-400' },
    { 
      label: 'Session', 
      value: `${activeSessionMinutes}m`, 
      icon: Clock, 
      color: 'text-amber-400' 
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4" /> Activity Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center">
              <Icon className={`h-6 w-6 mx-auto mb-1 ${color}`} />
              <div className="text-2xl font-bold text-primary">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
