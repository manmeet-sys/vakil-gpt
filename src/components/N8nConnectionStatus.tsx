
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { testN8nConnection } from '@/utils/pdfGenerator';

const N8nConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    message: string;
    lastChecked?: Date;
  }>({
    connected: false,
    message: 'Not tested',
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    
    try {
      const result = await testN8nConnection();
      setConnectionStatus({
        connected: result.success,
        message: result.message,
        lastChecked: new Date(),
      });
      
      if (result.success) {
        toast.success('n8n webhook connection verified');
      } else {
        toast.error(`n8n connection issue: ${result.message}`);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus({
        connected: false,
        message: 'Connection test failed',
        lastChecked: new Date(),
      });
      toast.error('Failed to test n8n connection');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Auto-check connection on component mount
    checkConnection();
  }, []);

  return (
    <Card className="border border-blue-100 dark:border-blue-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            {connectionStatus.connected ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            n8n Integration Status
          </div>
          <Badge variant={connectionStatus.connected ? 'secondary' : 'destructive'}>
            {connectionStatus.connected ? 'Connected' : 'Disconnected'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          {connectionStatus.connected ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="text-sm text-muted-foreground">
            {connectionStatus.message}
          </span>
        </div>
        
        {connectionStatus.lastChecked && (
          <p className="text-xs text-muted-foreground">
            Last checked: {connectionStatus.lastChecked.toLocaleTimeString()}
          </p>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={checkConnection}
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3 mr-2" />
              Test Connection
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Webhook automatically sends data on:</p>
          <p className="ml-2">- New billing entries</p>
          <p className="ml-2">- Entry updates/deletions</p>
          <p className="ml-2">- Client and matter changes</p>
          <p className="ml-2">- Invoice creation</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default N8nConnectionStatus;
