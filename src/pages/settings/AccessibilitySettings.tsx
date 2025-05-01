
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Accessibility, Type, Monitor, MousePointer } from 'lucide-react';

const AccessibilitySettings: React.FC = () => {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    textToSpeech: false,
    autoComplete: true,
    fontSize: 16,
    focusMode: false,
    keyboardNavigation: true,
    readingMode: false,
    cursorSize: "medium"
  });

  const handleToggleSetting = (key: string) => {
    setSettings(prev => ({ 
      ...prev, 
      [key]: !prev[key as keyof typeof prev] 
    }));
  };

  const handleFontSizeChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, fontSize: value[0] }));
  };

  const handleCursorSizeChange = (value: string) => {
    setSettings(prev => ({ ...prev, cursorSize: value }));
  };

  const saveSettings = () => {
    // In a real app, save to backend/localStorage
    localStorage.setItem('accessibility_settings', JSON.stringify(settings));
    toast.success('Accessibility settings saved successfully');
    
    // Apply some settings immediately
    if (settings.largeText) {
      document.documentElement.style.fontSize = `${settings.fontSize}px`;
    } else {
      document.documentElement.style.fontSize = ''; // Reset to default
    }
    
    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply reduce motion
    if (settings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  // Load settings on component mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse saved accessibility settings', e);
      }
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Accessibility className="h-5 w-5 text-blue-600" />
          <CardTitle>Accessibility Settings</CardTitle>
        </div>
        <CardDescription>
          Configure accessibility options to enhance your experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between space-x-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <Monitor className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="high-contrast" 
                  className="font-medium"
                >
                  High Contrast Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Increase contrast for better readability
                </p>
              </div>
            </div>
            <Switch 
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={() => handleToggleSetting('highContrast')}
            />
          </div>

          <div className="flex items-start justify-between space-x-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <Type className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="large-text" 
                  className="font-medium"
                >
                  Large Text
                </Label>
                <p className="text-sm text-muted-foreground">
                  Increase text size throughout the application
                </p>
                
                {settings.largeText && (
                  <div className="mt-3">
                    <Label htmlFor="font-size" className="text-sm mb-1 block">
                      Font Size: {settings.fontSize}px
                    </Label>
                    <Slider
                      id="font-size"
                      value={[settings.fontSize]}
                      min={14}
                      max={24}
                      step={1}
                      onValueChange={handleFontSizeChange}
                      className="max-w-xs"
                    />
                  </div>
                )}
              </div>
            </div>
            <Switch 
              id="large-text"
              checked={settings.largeText}
              onCheckedChange={() => handleToggleSetting('largeText')}
            />
          </div>

          <div className="flex items-start justify-between space-x-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <MousePointer className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="cursor-size" 
                  className="font-medium"
                >
                  Cursor Size
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Adjust the size of the cursor
                </p>
                <Select 
                  value={settings.cursorSize} 
                  onValueChange={handleCursorSizeChange}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="Select cursor size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium (Default)</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between space-x-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <Accessibility className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="reduce-motion" 
                  className="font-medium"
                >
                  Reduce Motion
                </Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations throughout the interface
                </p>
              </div>
            </div>
            <Switch 
              id="reduce-motion"
              checked={settings.reduceMotion}
              onCheckedChange={() => handleToggleSetting('reduceMotion')}
            />
          </div>
          
          <div className="flex items-start justify-between space-x-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <Type className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="reading-mode" 
                  className="font-medium"
                >
                  Reading Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Optimize text layout for easier reading of legal documents
                </p>
              </div>
            </div>
            <Switch 
              id="reading-mode"
              checked={settings.readingMode}
              onCheckedChange={() => handleToggleSetting('readingMode')}
            />
          </div>
          
          <div className="flex items-start justify-between space-x-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <Monitor className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="focus-mode" 
                  className="font-medium"
                >
                  Focus Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Remove distractions and focus on important content
                </p>
              </div>
            </div>
            <Switch 
              id="focus-mode"
              checked={settings.focusMode}
              onCheckedChange={() => handleToggleSetting('focusMode')}
            />
          </div>
          
          <div className="flex items-start justify-between space-x-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <MousePointer className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="keyboard-navigation" 
                  className="font-medium"
                >
                  Keyboard Navigation
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable enhanced keyboard navigation throughout the app
                </p>
              </div>
            </div>
            <Switch 
              id="keyboard-navigation"
              checked={settings.keyboardNavigation}
              onCheckedChange={() => handleToggleSetting('keyboardNavigation')}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-4">
        <Button onClick={saveSettings}>
          Save Accessibility Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccessibilitySettings;
