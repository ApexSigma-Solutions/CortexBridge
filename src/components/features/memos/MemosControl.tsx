import { MemosStatus } from './MemosStatus';
import { MemosSearch } from './MemosSearch';
import { MemosScratchpad } from './MemosScratchpad';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function MemosControl() {
  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Top Section: Metrics */}
      <section className="flex-none">
        <MemosStatus />
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 md:grid-cols-3 flex-1 min-h-0">
        {/* Left: Search Interface (2/3) */}
        <div className="md:col-span-2 h-full min-h-[400px] flex flex-col gap-6">
            <div className="flex-1 min-h-0">
                <MemosSearch />
            </div>
             <div className="h-[250px] flex-none">
                <MemosScratchpad />
            </div>
        </div>
        
        {/* Right: Agent/System Info (1/3) */}
        <div className="h-full">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm space-y-4">
                    <div>
                        <h4 className="font-semibold mb-1 text-foreground">Vector Store</h4>
                        <p className="text-xs text-muted-foreground">PostgreSQL + pgvector</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1 text-foreground">Embedding Model</h4>
                        <p className="text-xs text-muted-foreground">BAAI/bge-m3 (Dense)</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1 text-foreground">Active Tools</h4>
                        <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1 mt-1">
                            <li>consult_mirmir</li>
                            <li>retrieve_context</li>
                            <li>scratch_write</li>
                            <li>promote_memory</li>
                        </ul>
                    </div>
                     <div className="pt-4 border-t border-border mt-4">
                        <p className="text-xs text-muted-foreground/70">
                            Use the search interface to inspect vector similarities and stored context.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
