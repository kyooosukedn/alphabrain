import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="p-8 space-y-6">
          <div className="inline-flex h-20 w-20 rounded-full bg-orange-100 dark:bg-orange-950/40 items-center justify-center mx-auto">
            <WifiOff className="h-10 w-10 text-orange-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">You're offline</h1>
            <p className="text-muted-foreground">
              Check your internet connection and try again. Some features may be limited while offline.
            </p>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p><strong>Available offline:</strong></p>
            <ul className="text-left space-y-1 ml-4">
              <li>• View your study schedule</li>
              <li>• Review your notes</li>
              <li>• Check achievements</li>
              <li>• View progress stats</li>
            </ul>
          </div>

          <Button onClick={handleRetry} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
