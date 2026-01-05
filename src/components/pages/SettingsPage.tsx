import { useSystemStore } from '@/lib/store/systemStore';
import { useAnalyticsStore } from '@/lib/store/useAnalyticsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Moon, RotateCcw, Palette } from 'lucide-react';

export function SettingsPage() {
  const { theme, toggleTheme } = useSystemStore();
  const { resetMetrics, totalCaptures, totalIngestions, totalSearches } = useAnalyticsStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-2">Settings</h2>
      
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" /> Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of CortexBridge.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Theme</h4>
              <p className="text-sm text-muted-foreground">
                Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </p>
            </div>
            <Button onClick={toggleTheme} variant="outline" className="gap-2">
              {theme === 'dark' ? (
                <>
                  <Sun className="h-4 w-4" /> Switch to Light
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" /> Switch to Dark
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>Manage your stored analytics and activity data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Analytics</h4>
              <p className="text-sm text-muted-foreground">
                {totalCaptures} captures · {totalIngestions} ingestions · {totalSearches} searches
              </p>
            </div>
            <Button onClick={resetMetrics} variant="destructive" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset Metrics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>CortexBridge</strong> v1.0.0</p>
            <p>The Executive Control Plane for the ApexSigma Omega Ecosystem.</p>
            <p>© 2026 ApexSigma Solutions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
