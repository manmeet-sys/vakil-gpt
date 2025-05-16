
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

const AISettings: React.FC = () => {
  const [provider, setProvider] = useState<'gemini' | 'deepseek' | 'openai'>('gemini');
  const [apiKey, setApiKey] = useState({
    gemini: localStorage.getItem('geminiApiKey') || '',
    deepseek: localStorage.getItem('deepseekApiKey') || '',
    openai: localStorage.getItem('openaiApiKey') || '',
  });
  const [temperature, setTemperature] = useState(0.7);
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    gemini: 'idle' | 'validating' | 'valid' | 'invalid';
    deepseek: 'idle' | 'validating' | 'valid' | 'invalid';
    openai: 'idle' | 'validating' | 'valid' | 'invalid';
  }>({
    gemini: 'idle',
    deepseek: 'idle',
    openai: 'idle',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    // Load the preferred provider from localStorage
    const savedProvider = localStorage.getItem('preferredApiProvider') as 'gemini' | 'deepseek' | 'openai' || 'gemini';
    setProvider(savedProvider);
    
    // Load other settings
    const savedTemperature = parseFloat(localStorage.getItem('ai-temperature') || '0.7');
    const savedHistoryEnabled = localStorage.getItem('ai-history-enabled') !== 'false';
    
    setTemperature(savedTemperature);
    setHistoryEnabled(savedHistoryEnabled);
  }, []);
  
  const validateGeminiKey = async (key: string): Promise<boolean> => {
    try {
      setValidationStatus(prev => ({ ...prev, gemini: 'validating' }));
      
      // Simple test request to validate the key
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Hello, please respond with "API key is valid."' }] }],
          generationConfig: {
            maxOutputTokens: 10,
          }
        })
      });
      
      if (!response.ok) {
        setErrorMessage("Gemini API key validation failed. Please check your key.");
        setValidationStatus(prev => ({ ...prev, gemini: 'invalid' }));
        return false;
      }
      
      setValidationStatus(prev => ({ ...prev, gemini: 'valid' }));
      setErrorMessage(null);
      return true;
    } catch (error) {
      console.error('Error validating Gemini API key:', error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to validate Gemini API key");
      setValidationStatus(prev => ({ ...prev, gemini: 'invalid' }));
      return false;
    }
  };
  
  const validateDeepseekKey = async (key: string): Promise<boolean> => {
    // In a real implementation, you would validate against DeepSeek's API
    // For now, we'll consider it valid if it's at least 32 characters
    setValidationStatus(prev => ({ ...prev, deepseek: 'validating' }));
    
    if (key.length >= 32) {
      setValidationStatus(prev => ({ ...prev, deepseek: 'valid' }));
      setErrorMessage(null);
      return true;
    }
    
    setErrorMessage("DeepSeek API key should be at least 32 characters long");
    setValidationStatus(prev => ({ ...prev, deepseek: 'invalid' }));
    return false;
  };

  const validateOpenAIKey = async (key: string): Promise<boolean> => {
    try {
      setValidationStatus(prev => ({ ...prev, openai: 'validating' }));
      
      // Simple test request to validate the key
      const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: 'user', content: 'Hello, please respond with "API key is valid."' }],
          max_tokens: 10
        })
      });
      
      if (!response.ok) {
        setErrorMessage("OpenAI API key validation failed. Please check your key.");
        setValidationStatus(prev => ({ ...prev, openai: 'invalid' }));
        return false;
      }
      
      setValidationStatus(prev => ({ ...prev, openai: 'valid' }));
      setErrorMessage(null);
      return true;
    } catch (error) {
      console.error('Error validating OpenAI API key:', error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to validate OpenAI API key");
      setValidationStatus(prev => ({ ...prev, openai: 'invalid' }));
      return false;
    }
  };
  
  const saveSettings = async () => {
    setIsValidating(true);
    setErrorMessage(null);
    
    try {
      // Validate keys before saving
      let isGeminiValid = true;
      let isDeepseekValid = true;
      let isOpenAIValid = true;
      
      if (apiKey.gemini) {
        isGeminiValid = await validateGeminiKey(apiKey.gemini);
      }
      
      if (apiKey.deepseek) {
        isDeepseekValid = await validateDeepseekKey(apiKey.deepseek);
      }

      if (apiKey.openai) {
        isOpenAIValid = await validateOpenAIKey(apiKey.openai);
      }
      
      if (!isGeminiValid || !isDeepseekValid || !isOpenAIValid) {
        return;
      }
      
      // Save all settings to localStorage
      localStorage.setItem('preferredApiProvider', provider);
      localStorage.setItem('geminiApiKey', apiKey.gemini);
      localStorage.setItem('deepseekApiKey', apiKey.deepseek);
      localStorage.setItem('openaiApiKey', apiKey.openai);
      localStorage.setItem('ai-temperature', temperature.toString());
      localStorage.setItem('ai-history-enabled', String(historyEnabled));
      
      // If the user is authenticated, we could also save their preferences to Supabase
      // This is optional and would require additional implementation
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
  
  const handleApiKeyChange = (provider: 'gemini' | 'deepseek' | 'openai', value: string) => {
    setApiKey(prev => ({
      ...prev,
      [provider]: value,
    }));
    
    // Reset validation status when key changes
    setValidationStatus(prev => ({
      ...prev,
      [provider]: 'idle'
    }));
  };
  
  const getKeyStatus = (provider: 'gemini' | 'deepseek' | 'openai') => {
    const status = validationStatus[provider];
    
    if (status === 'validating') {
      return <Cpu className="h-4 w-4 animate-spin text-blue-500" />;
    } else if (status === 'valid') {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    } else if (status === 'invalid') {
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
            <Sparkles className="h-5 w-5 text-blue-600" />
            <CardTitle>AI Provider Settings</CardTitle>
          </div>
          <CardDescription>
            Choose your preferred AI provider and configure model settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ai-provider">Primary AI Provider</Label>
            <Select value={provider} onValueChange={(value) => setProvider(value as 'gemini' | 'deepseek' | 'openai')}>
              <SelectTrigger id="ai-provider" className="w-full">
                <SelectValue placeholder="Select AI provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Google Gemini</SelectItem>
                <SelectItem value="deepseek">DeepSeek AI</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center">
              <Key className="h-4 w-4 mr-2" /> API Keys
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="gemini-api-key">Gemini API Key</Label>
                <div>{getKeyStatus('gemini')}</div>
              </div>
              <div className="relative">
                <Input
                  id="gemini-api-key"
                  type="password"
                  value={apiKey.gemini}
                  onChange={(e) => handleApiKeyChange('gemini', e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className={validationStatus.gemini === 'invalid' ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Get your Gemini API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="deepseek-api-key">DeepSeek API Key</Label>
                <div>{getKeyStatus('deepseek')}</div>
              </div>
              <Input
                id="deepseek-api-key"
                type="password"
                value={apiKey.deepseek}
                onChange={(e) => handleApiKeyChange('deepseek', e.target.value)}
                placeholder="Enter your DeepSeek API key"
                className={validationStatus.deepseek === 'invalid' ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              <p className="text-xs text-muted-foreground">
                Get your DeepSeek API key from <a href="https://platform.deepseek.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">DeepSeek Platform</a>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                <div>{getKeyStatus('openai')}</div>
              </div>
              <Input
                id="openai-api-key"
                type="password"
                value={apiKey.openai}
                onChange={(e) => handleApiKeyChange('openai', e.target.value)}
                placeholder="Enter your OpenAI API key"
                className={validationStatus.openai === 'invalid' ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
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
            <Brain className="h-5 w-5 text-blue-600" />
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
            className="flex items-center gap-2"
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
