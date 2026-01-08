import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ingestApi } from '@/lib/api/client';
import { toast } from '@/lib/store/useToastStore';
import { auditLog } from '@/lib/store/useAuditLogStore';
import { useAnalyticsStore } from '@/lib/store/useAnalyticsStore';
import { FileText, FolderSearch, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { DocumentUpload } from './DocumentUpload';

export function IngestPlayground() {
  const incrementIngestions = useAnalyticsStore((s) => s.incrementIngestions);
  const [text, setText] = useState('');
  const [repoPath, setRepoPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTextIngest = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await ingestApi.ingestText(text);
      setResult(`Success! ID: ${res.ingestion_id}`);
      toast.success('Text ingested successfully!');
      auditLog.ingest(`Text ingested (${text.length} chars)`, { id: res.ingestion_id });
      incrementIngestions();
      setText('');
    } catch (err) {
        if(err instanceof Error) {
            setError(err.message);
            toast.error(`Ingestion failed: ${err.message}`);
        } else {
             setError('Failed to ingest text');
             toast.error('Failed to ingest text');
        }
    } finally {
      setLoading(false);
    }
  };

  const handleRepoIngest = async () => {
    if (!repoPath.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await ingestApi.ingestRepo(repoPath);
      setResult(`Raid Started! ID: ${res.ingestion_id} - ${res.message}`);
      toast.success('Repository raid initiated!');
    } catch (err) {
        if(err instanceof Error) {
            setError(err.message);
            toast.error(`Raid failed: ${err.message}`);
        } else {
            setError('Failed to raid repo');
            toast.error('Failed to raid repository');
        }
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Ingestion Playground</CardTitle>
        <CardDescription>
          Manually ingest data into the Omega Knowledge Graph.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Tabs defaultValue="text" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text" className="gap-2">
              <FileText className="h-4 w-4" /> Text
            </TabsTrigger>
            <TabsTrigger value="repo" className="gap-2">
                <FolderSearch className="h-4 w-4" /> Repo Raider
            </TabsTrigger>
            <TabsTrigger value="file" className="gap-2">
                <Upload className="h-4 w-4" /> Upload
            </TabsTrigger>
          </TabsList>

          {/* Text Tab */}
          <TabsContent value="text" className="flex-1 space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Raw Text Content</label>
              <Textarea
                placeholder="Paste any text, code snippet, or notes here..."
                className="min-h-[200px] font-mono text-sm"
                value={text}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
              />
            </div>
            <Button 
                onClick={handleTextIngest} 
                disabled={loading || !text.trim()} 
                className="w-full"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Ingest Text'}
            </Button>
          </TabsContent>

          {/* Repo Tab */}
          <TabsContent value="repo" className="space-y-4 mt-4">
             <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FolderSearch className="h-4 w-4" /> Repository Raider
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Point InGest-LLM at a local folder to recursively ingest code, docs, and logic.
                </p>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Local Path</label>
                    <Input 
                        placeholder="C:\Projects\MyCoolApp" 
                        value={repoPath}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepoPath(e.target.value)}
                    />
                </div>
             </div>
             <Button 
                onClick={handleRepoIngest} 
                disabled={loading || !repoPath.trim()} 
                className="w-full"
                variant="secondary"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Start Raid'}
            </Button>
          </TabsContent>

          {/* File Tab */}
          <TabsContent value="file" className="flex-1 space-y-4 mt-4">
            <DocumentUpload 
              onSuccess={(id) => {
                setResult(`Uploaded! ID: ${id}`);
                incrementIngestions();
              }} 
            />
          </TabsContent>

          {/* Status Messages */}
          <div className="mt-6">
            {result && (
                <div className="p-3 bg-green-500/15 border border-green-500/30 text-green-600 rounded-md flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {result}
                </div>
            )}
            {error && (
                <div className="p-3 bg-destructive/15 border border-destructive/30 text-destructive rounded-md flex items-center text-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                </div>
            )}
          </div>

        </Tabs>
      </CardContent>
    </Card>
  );
}
