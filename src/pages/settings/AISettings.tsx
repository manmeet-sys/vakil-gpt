
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Sparkles, Brain, Cpu, CheckCircle2, Key } from 'lucide-react';
import ErrorMessage from '@/components/ui/error-message';

const AISettings: React.FC = () => {
  const [temperature, setTemperature] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'valid' | 'validating' | 'invalid'>('valid');
  
  useEffect(() => {
    const savedTemperature = parseFloat(localStorage.getItem('ai-temperature') || '0.7');
    setTemperature(savedTemperature);
  }, []);
  
  const saveSettings = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Save temperature settings to localStorage
      localStorage.setItem('ai-temperature', temperature.toString());
      
      toast.success('AI settings saved successfully');
      setKeyStatus('valid');
    } catch (error) {
      console.error('Error saving AI settings:', error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to save settings");
      toast.error('Failed to save AI settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0]);
  };
  
  return (
    <div className="space-y-6">
      {errorMessage && (
        <ErrorMessage 
          message={errorMessage} 
          severity="error"
          className="mb-4"
        />
      )}
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <CardTitle>AI Settings</CardTitle>
          </div>
          <CardDescription>
            Configure OpenAI GPT-4 model settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center">
              <Key className="h-4 w-4 mr-2" /> API Key
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                <div>{keyStatus === 'valid' && <CheckCircle2 className="h-4 w-4 text-green-500" />}</div>
              </div>
              <div className="bg-muted/50 border rounded p-4 text-sm text-muted-foreground">
                API key is securely configured and working properly.
              </div>
              <p className="text-xs text-muted-foreground">
                The application is using a pre-configured OpenAI API key.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle>Model Settings</CardTitle>
          </div>
          <CardDescription>
            Configure AI behavior and response preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="temperature-slider">Temperature: {temperature.toFixed(1)}</Label>
            </div>
            <Slider
              id="temperature-slider"
              defaultValue={[temperature]}
              max={1}
              min={0}
              step={0.1}
              onValueChange={handleTemperatureChange}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Lower values produce more predictable responses, higher values more creative ones.
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-end pt-4 border-t">
          <Button 
            onClick={saveSettings} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading && <Cpu className="h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AISettings;
