import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader, CheckCircle, XCircle } from 'lucide-react';

export default function ApiTester() {
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 'http://localhost:8080');
  const [endpoint, setEndpoint] = useState('/api/test/ping');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
    error?: any;
  } | null>(null);

  const testConnection = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const fullUrl = `${apiUrl}${endpoint}`;
      console.log(`Testing connection to: ${fullUrl}`);
      
      const response = await axios.get(fullUrl, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setResult({
        success: true,
        message: `Connection successful! Status: ${response.status}`,
        data: response.data
      });
      
    } catch (error: any) {
      console.error('API test error:', error);
      
      let errorMessage = 'Unknown error occurred';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Server responded with status ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
          errorMessage = 'No response received from server. The server might be down or the URL is incorrect.';
        } else {
          errorMessage = `Error setting up request: ${error.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setResult({
        success: false,
        message: errorMessage,
        error: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testEndpoints = [
    { name: 'Ping Test', endpoint: '/api/test/ping' },
    { name: 'Sessions', endpoint: '/api/sessions' },
    { name: 'Topics', endpoint: '/api/subjects' }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">API Connection Tester</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Backend Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">API Base URL</Label>
            <Input 
              id="apiUrl" 
              value={apiUrl} 
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8080"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endpoint">Endpoint</Label>
            <Input 
              id="endpoint" 
              value={endpoint} 
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/api/test/ping"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {testEndpoints.map((test) => (
              <Button 
                key={test.endpoint}
                variant="outline" 
                onClick={() => setEndpoint(test.endpoint)}
              >
                {test.name}
              </Button>
            ))}
          </div>
          
          <Button 
            onClick={testConnection} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : 'Test Connection'}
          </Button>
          
          {result && (
            <Alert className={result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <AlertDescription className="font-medium">
                  {result.message}
                </AlertDescription>
              </div>
              
              {result.data && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto max-h-40">
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              )}
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>1. Make sure your backend server is running</p>
          <p>2. Check that the API URL is correct (including port)</p>
          <p>3. Verify that CORS is properly configured on the backend</p>
          <p>4. Check network tab in browser dev tools for detailed errors</p>
          <p>5. Ensure your backend is properly configured to handle JWT authentication</p>
        </CardContent>
      </Card>
    </div>
  );
}