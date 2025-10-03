import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw,
  Wifi,
  WifiOff 
} from 'lucide-react';

interface ConnectionStatus {
  isConnected: boolean;
  message: string;
  lastChecked: Date | null;
  latency?: number;
}

const DatabaseConnectionTest = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    message: 'Not tested yet',
    lastChecked: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      // Test 1: Basic client connection
      const { data: healthCheck, error: healthError } = await supabase
        .from('activities')
        .select('count')
        .limit(1);

      if (healthError) {
        // If activities table doesn't exist, try a simpler test
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        
        if (authError && !authError.message.includes('No JWT')) {
          throw new Error(`Auth connection failed: ${authError.message}`);
        }
      }

      // Test 2: Database query test
      const { data, error } = await supabase
        .from('activities')
        .select('id')
        .limit(1);

      const latency = Date.now() - startTime;

      if (error) {
        // Handle specific error cases
        if (error.message.includes('relation "activities" does not exist')) {
          setStatus({
            isConnected: true,
            message: 'Connected to Supabase! (Activities table not yet created)',
            lastChecked: new Date(),
            latency
          });
        } else {
          throw new Error(error.message);
        }
      } else {
        setStatus({
          isConnected: true,
          message: `Connected successfully! Found ${data?.length || 0} activities.`,
          lastChecked: new Date(),
          latency
        });
      }
    } catch (error) {
      setStatus({
        isConnected: false,
        message: `Connection failed: ${error.message}`,
        lastChecked: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testRealtimeConnection = async () => {
    setIsLoading(true);
    try {
      // Test realtime connection
      const channel = supabase
        .channel('test-channel')
        .on('broadcast', { event: 'test' }, () => {
          console.log('Realtime test successful');
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setStatus(prev => ({
              ...prev,
              message: prev.message + ' (Realtime: ✓)'
            }));
          }
        });

      // Clean up after 3 seconds
      setTimeout(() => {
        supabase.removeChannel(channel);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        message: prev.message + ' (Realtime: ✗)'
      }));
      setIsLoading(false);
    }
  };

  // Auto-test on component mount
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Database className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Supabase Database Connection Test</h2>
      </div>

      {/* Connection Status */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          ) : status.isConnected ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={status.isConnected ? "default" : "destructive"}>
                {status.isConnected ? "Connected" : "Disconnected"}
              </Badge>
              {status.isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{status.message}</p>
            {status.lastChecked && (
              <p className="text-xs text-muted-foreground mt-1">
                Last checked: {status.lastChecked.toLocaleTimeString()}
                {status.latency && ` (${status.latency}ms)`}
              </p>
            )}
          </div>
        </div>

        {/* Connection Details */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium mb-2">Connection Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Project URL:</span>
              <p className="text-muted-foreground break-all">
                {import.meta.env.VITE_SUPABASE_URL}
              </p>
            </div>
            <div>
              <span className="font-medium">Project ID:</span>
              <p className="text-muted-foreground">
                {import.meta.env.VITE_SUPABASE_PROJECT_ID}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={testConnection} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Test Connection
          </Button>
          
          <Button 
            onClick={testRealtimeConnection} 
            disabled={isLoading || !status.isConnected}
            variant="outline"
            size="sm"
          >
            Test Realtime
          </Button>
        </div>

        {/* Troubleshooting Tips */}
        {!status.isConnected && (
          <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
            <h4 className="font-medium text-yellow-800 mb-2">Troubleshooting Tips:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Check if your Supabase project is active</li>
              <li>• Verify environment variables in .env file</li>
              <li>• Ensure you're connected to the internet</li>
              <li>• Check if your Supabase project has reached limits</li>
              <li>• Make sure the API key has correct permissions</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DatabaseConnectionTest;