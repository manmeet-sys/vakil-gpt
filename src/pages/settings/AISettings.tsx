
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Sparkles, MessageSquare, Key, Brain, Cpu } from 'lucide-react';

const AISettings: React.FC = () => {
  const [provider, setProvider] = useState<'gemini' | 'deepseek'>('gemini');
  const [apiKey, setApiKey] = useState({
    gemini: localStorage.getItem('geminiApiKey') || '',
    deepseek: localStorage.getItem('deepseekApiKey') || '',
  });
  const [temperature, setTemperature] = useState(0.7);
  const [historyEnabled, setHistoryEnabled] = useState(true);
  
  useEffect(() => {
    // Load the preferred provider from localStorage
    const savedProvider = localStorage.getItem('preferredApiProvider') as 'gemini' | 'deepseek' || 'gemini';
    setProvider(savedProvider);
    
    // Load other settings
    const savedTemperature = parseFloat(localStorage.getItem('ai-temperature') || '0.7');
    const savedHistoryEnabled = localStorage.getItem('ai-history-enabled') !== 'false';
    
    setTemperature(savedTemperature);
    setHistoryEnabled(savedHistoryEnabled);
  }, []);
  
  const saveSettings = () => {
    localStorage.setItem('preferredApiProvider', provider);
    localStorage.setItem('geminiApiKey', apiKey.gemini);
    localStorage.setItem('deepseekApiKey', apiKey.deepseek);
    localStorage.setItem('ai-temperature', temperature.toString());
    localStorage.setItem('ai-history-enabled', String(historyEnabled));
    
    toast.success('AI settings saved successfully');
  };
  
  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0]);
  };
  
  const handleApiKeyChange = (provider: 'gemini' | 'deepseek', value: string) => {
    setApiKey(prev => ({
      ...prev,
      [provider]: value,
    }));
  };

  return (
    <div className="space-y-6">
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
            <Select value={provider} onValueChange={(value) => setProvider(value as 'gemini' | 'deepseek')}>
              <SelectTrigger id="ai-provider" className="w-full">
                <SelectValue placeholder="Select AI provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Google Gemini</SelectItem>
                <SelectItem value="deepseek">DeepSeek AI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center">
              <Key className="h-4 w-4 mr-2" /> API Keys
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="gemini-api-key">Gemini API Key</Label>
              <Input
                id="gemini-api-key"
                type="password"
                value={apiKey.gemini}
                onChange={(e) => handleApiKeyChange('gemini', e.target.value)}
                placeholder="Enter your Gemini API key"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deepseek-api-key">DeepSeek API Key</Label>
              <Input
                id="deepseek-api-key"
                type="password"
                value={apiKey.deepseek}
                onChange={(e) => handleApiKeyChange('deepseek', e.target.value)}
                placeholder="Enter your DeepSeek API key"
              />
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
          <Button onClick={saveSettings}>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AISettings;
