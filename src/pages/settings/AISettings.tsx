
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Sparkles, MessageSquare, Brain, Cpu, CheckCircle2 } from 'lucide-react';
import ErrorMessage from '@/components/ui/error-message';
import { supabase } from '@/integrations/supabase/client';
import { OPENAI_MODELS, OpenAIModel } from '@/components/OpenAIIntegration';

const AISettings: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<OpenAIModel>('gpt-4o-mini');
  const [temperature, setTemperature] = useState(0.7);
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    // Load settings from localStorage
    const savedModel = localStorage.getItem('openaiModel') as OpenAIModel || 'gpt-4o-mini';
    const savedTemperature = parseFloat(localStorage.getItem('ai-temperature') || '0.7');
    const savedHistoryEnabled = localStorage.getItem('ai-history-enabled') !== 'false';
    
    setSelectedModel(savedModel);
    setTemperature(savedTemperature);
    setHistoryEnabled(savedHistoryEnabled);
  }, []);
  
  const saveSettings = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    
    try {
      // Save all settings to localStorage
      localStorage.setItem('openaiModel', selectedModel);
      localStorage.setItem('ai-temperature', temperature.toString());
      localStorage.setItem('ai-history-enabled', String(historyEnabled));
      
      // If the user is authenticated, we could also save their preferences to Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // You could implement this to save user preferences to a database
      }
      
      toast.success('AI settings saved successfully');
    } catch (error) {
      console.error('Error saving AI settings:', error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to save settings");
      toast.error('Failed to save AI settings', {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setIsSaving(false);
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
            <Sparkles className="h-5 w-5 text-green-600" />
            <CardTitle>OpenAI Settings</CardTitle>
          </div>
          <CardDescription>
            Configure your AI model preferences for VakilGPT. The OpenAI API key is managed centrally by the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ai-model">OpenAI Model</Label>
            <Select value={selectedModel} onValueChange={(value: OpenAIModel) => setSelectedModel(value)}>
              <SelectTrigger id="ai-model" className="w-full">
                <SelectValue placeholder="Select OpenAI model" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(OPENAI_MODELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              GPT-4o models are more capable but cost more. GPT-4o Mini is fast and cost-effective.
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Centralized API Key
              </h3>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              The OpenAI API key is managed centrally by the system. You don't need to provide your own API key to use VakilGPT's AI features.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-green-600" />
            <CardTitle>Model Settings</CardTitle>
          </div>
          <CardDescription>
            Configure AI behavior and response preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
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
            
            <div className="flex items-start justify-between space-x-4 pt-4">
              <div>
                <Label htmlFor="history-toggle" className="font-medium">
                  Conversation History
                </Label>
                <p className="text-sm text-muted-foreground">
                  Store chat history for context-aware responses
                </p>
              </div>
              <Switch 
                id="history-toggle"
                checked={historyEnabled}
                onCheckedChange={setHistoryEnabled}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end pt-4 border-t">
          <Button 
            onClick={saveSettings} 
            disabled={isSaving}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {isSaving && <Cpu className="h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AISettings;
