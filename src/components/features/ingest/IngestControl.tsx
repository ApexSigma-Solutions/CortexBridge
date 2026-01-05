import { IngestStatus } from './IngestStatus';
import { IngestPlayground } from './IngestPlayground';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function IngestControl() {
  return (
    <div className="space-y-6">
      {/* Top Section: Queue Metrics */}
      <section>
        <IngestStatus />
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Left Column: Playground */}
        <div className="lg:col-span-2 h-[500px]">
            <IngestPlayground />
        </div>
        
        {/* Right Column: Info/Config (Placeholder) */}
        <div className="h-full">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                </CardHeader>
                <CardContent className="text-secondary text-sm space-y-2">
                    <p><strong>Async Processing:</strong> Enabled</p>
                    <p><strong>Chunk Size:</strong> 1000 chars</p>
                    <p><strong>Embedding Model:</strong> bge-m3</p>
                    <p><strong>Summarizer:</strong> qwen2.5-coder</p>
                    <div className="pt-4 border-t border-border mt-4">
                        <p className="text-xs text-tertiary">
                            Configure these settings in environment variables or the Settings view (coming soon).
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
