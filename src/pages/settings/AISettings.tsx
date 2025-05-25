
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Sparkles, MessageSquare, Key, Brain, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react';
import ErrorMessage from '@/components/ui/error-message';
import { supabase } from '@/integrations/supabase/client';
import { OPENAI_MODELS, OpenAIModel } from '@/components/OpenAIIntegration';

const AISettings: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<OpenAIModel>('gpt-4o-mini');
  const [apiKey, setApiKey] = useState(localStorage.getItem('openaiApiKey') || '');
  const [temperature, setTemperature] = useState(0.7);
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
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
  
  const validateOpenAIKey = async (key: string): Promise<boolean> => {
    try {
      setValidationStatus('validating');
      
      // Simple test request to validate the key
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello, please respond with "API key is valid."' }],
          max_tokens: 10,
        })
      });
      
      if (!response.ok) {
        setErrorMessage("OpenAI API key validation failed. Please check your key.");
        setValidationStatus('invalid');
        return false;
      }
      
      setValidationStatus('valid');
      setErrorMessage(null);
      return true;
    } catch (error) {
      console.error('Error validating OpenAI API key:', error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to validate OpenAI API key");
      setValidationStatus('invalid');
      return false;
    }
  };
  
  const saveSettings = async () => {
    setIsValidating(true);
    setErrorMessage(null);
    
    try {
      // Validate key before saving
      let isValid = true;
      
      if (apiKey) {
        isValid = await validateOpenAIKey(apiKey);
      }
      
      if (!isValid) {
        return;
      }
      
      // Save all settings to localStorage
      localStorage.setItem('openaiModel', selectedModel);
      localStorage.setItem('openaiApiKey', apiKey);
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
      setIsValidating(false);
    }
  };
  
  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0]);
  };
  
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    // Reset validation status when key changes
    setValidationStatus('idle');
  };
  
  const getKeyStatus = () => {
    if (validationStatus === 'validating') {
      return <Cpu className="h-4 w-4 animate-spin text-blue-500" />;
    } else if (validationStatus === 'valid') {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    } else if (validationStatus === 'invalid') {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    
    return null;
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
            Configure your OpenAI API key and model preferences for VakilGPT
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
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center">
              <Key className="h-4 w-4 mr-2" /> API Key
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                <div>{getKeyStatus()}</div>
              </div>
              <div className="relative">
                <Input
                  id="openai-api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className={validationStatus === 'invalid' ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Get your OpenAI API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenAI Platform</a>
              </p>
            </div>
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
            disabled={isValidating}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {isValidating && <Cpu className="h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AISettings;
