import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Accessibility, Type, Monitor, MousePointer, Eye, Keyboard } from 'lucide-react';
import designSystem from '@/lib/design-system-standards';

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
    setSettings(prev => {
      const newSettings = { 
        ...prev, 
        [key]: !prev[key as keyof typeof prev]
      };
      
      // Save to localStorage immediately for immediate effect
      localStorage.setItem('accessibility_settings', JSON.stringify(newSettings));
      
      // Apply settings immediately for certain options
      applySettings(newSettings);
      
      return newSettings;
    });
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSettings = { ...settings, fontSize: value[0] };
    setSettings(newSettings);
    localStorage.setItem('accessibility_settings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  const handleCursorSizeChange = (value: string) => {
    const newSettings = { ...settings, cursorSize: value };
    setSettings(newSettings);
    localStorage.setItem('accessibility_settings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };
  
  const applySettings = (settingsToApply: typeof settings) => {
    // Apply font size
    if (settingsToApply.largeText) {
      document.documentElement.style.fontSize = `${settingsToApply.fontSize}px`;
    } else {
      document.documentElement.style.fontSize = ''; // Reset to default
    }
    
    // Apply high contrast
    if (settingsToApply.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply reduce motion
    if (settingsToApply.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // Apply reading mode
    if (settingsToApply.readingMode) {
      document.documentElement.classList.add('reading-mode');
    } else {
      document.documentElement.classList.remove('reading-mode');
    }
    
    // Apply focus mode
    if (settingsToApply.focusMode) {
      document.documentElement.classList.add('focus-mode');
    } else {
      document.documentElement.classList.remove('focus-mode');
    }
    
    // Apply cursor size
    document.documentElement.style.setProperty('--cursor-size', settingsToApply.cursorSize);
    
    // Apply other settings via CSS variables
    document.documentElement.style.setProperty('--enable-animations', settingsToApply.reduceMotion ? '0' : '1');
  };

  const saveSettings = () => {
    // In a real app, save to backend
    localStorage.setItem('accessibility_settings', JSON.stringify(settings));
    toast.success('Accessibility settings saved successfully');
    
    // Apply all settings
    applySettings(settings);
  };

  // Load settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        applySettings(parsedSettings);
      } catch (e) {
        console.error('Failed to parse saved accessibility settings', e);
      }
    }
  }, []);

  return (
    <Card className="section" role="region" aria-labelledby="accessibility-heading">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Accessibility className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <CardTitle id="accessibility-heading">Accessibility Settings</CardTitle>
        </div>
        <CardDescription>
          Configure accessibility options to enhance your experience
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-6" role="list">
          {/* High Contrast Mode */}
          <div className="flex items-start justify-between space-x-4" role="listitem">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <Monitor className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="high-contrast" 
                  className={designSystem.typography.fontWeight.medium}
                >
                  High Contrast Mode
                </Label>
                <p className={designSystem.typography.body.small}>
                  Increase contrast for better readability
                </p>
              </div>
            </div>
            <Switch 
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={() => handleToggleSetting('highContrast')}
              aria-describedby="high-contrast-description"
            />
            <span id="high-contrast-description" className={designSystem.a11y.visuallyHidden}>
              {settings.highContrast ? 'High contrast mode is enabled' : 'High contrast mode is disabled'}
            </span>
          </div>

          {/* Large Text */}
          <div className="flex items-start justify-between space-x-4" role="listitem">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <Type className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="large-text" 
                  className={designSystem.typography.fontWeight.medium}
                >
                  Large Text
                </Label>
                <p className={designSystem.typography.body.small}>
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
                      aria-valuetext={`${settings.fontSize} pixels`}
                    />
                  </div>
                )}
              </div>
            </div>
            <Switch 
              id="large-text"
              checked={settings.largeText}
              onCheckedChange={() => handleToggleSetting('largeText')}
              aria-describedby="large-text-description"
            />
            <span id="large-text-description" className={designSystem.a11y.visuallyHidden}>
              {settings.largeText ? 'Large text mode is enabled' : 'Large text mode is disabled'}
            </span>
          </div>

          {/* Cursor Size */}
          <div className="flex items-start justify-between space-x-4" role="listitem">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <MousePointer className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="cursor-size" 
                  className={designSystem.typography.fontWeight.medium}
                >
                  Cursor Size
                </Label>
                <p className={designSystem.typography.body.small + " mb-2"}>
                  Adjust the size of the cursor
                </p>
                <Select 
                  value={settings.cursorSize} 
                  onValueChange={handleCursorSizeChange}
                  aria-label="Select cursor size"
                >
                  <SelectTrigger id="cursor-size" className="w-full max-w-xs">
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

          {/* Reduce Motion */}
          <div className="flex items-start justify-between space-x-4" role="listitem">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <Accessibility className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="reduce-motion" 
                  className={designSystem.typography.fontWeight.medium}
                >
                  Reduce Motion
                </Label>
                <p className={designSystem.typography.body.small}>
                  Minimize animations throughout the interface
                </p>
              </div>
            </div>
            <Switch 
              id="reduce-motion"
              checked={settings.reduceMotion}
              onCheckedChange={() => handleToggleSetting('reduceMotion')}
              aria-describedby="reduce-motion-description"
            />
            <span id="reduce-motion-description" className={designSystem.a11y.visuallyHidden}>
              {settings.reduceMotion ? 'Reduced motion is enabled' : 'Reduced motion is disabled'}
            </span>
          </div>
          
          {/* Reading Mode */}
          <div className="flex items-start justify-between space-x-4" role="listitem">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <Eye className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="reading-mode" 
                  className={designSystem.typography.fontWeight.medium}
                >
                  Reading Mode
                </Label>
                <p className={designSystem.typography.body.small}>
                  Optimize text layout for easier reading of legal documents
                </p>
              </div>
            </div>
            <Switch 
              id="reading-mode"
              checked={settings.readingMode}
              onCheckedChange={() => handleToggleSetting('readingMode')}
              aria-describedby="reading-mode-description"
            />
            <span id="reading-mode-description" className={designSystem.a11y.visuallyHidden}>
              {settings.readingMode ? 'Reading mode is enabled' : 'Reading mode is disabled'}
            </span>
          </div>
          
          {/* Focus Mode */}
          <div className="flex items-start justify-between space-x-4" role="listitem">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <Monitor className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="focus-mode" 
                  className={designSystem.typography.fontWeight.medium}
                >
                  Focus Mode
                </Label>
                <p className={designSystem.typography.body.small}>
                  Remove distractions and focus on important content
                </p>
              </div>
            </div>
            <Switch 
              id="focus-mode"
              checked={settings.focusMode}
              onCheckedChange={() => handleToggleSetting('focusMode')}
              aria-describedby="focus-mode-description"
            />
            <span id="focus-mode-description" className={designSystem.a11y.visuallyHidden}>
              {settings.focusMode ? 'Focus mode is enabled' : 'Focus mode is disabled'}
            </span>
          </div>
          
          {/* Keyboard Navigation */}
          <div className="flex items-start justify-between space-x-4" role="listitem">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                <Keyboard className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="keyboard-navigation" 
                  className={designSystem.typography.fontWeight.medium}
                >
                  Keyboard Navigation
                </Label>
                <p className={designSystem.typography.body.small}>
                  Enable enhanced keyboard navigation throughout the app
                </p>
              </div>
            </div>
            <Switch 
              id="keyboard-navigation"
              checked={settings.keyboardNavigation}
              onCheckedChange={() => handleToggleSetting('keyboardNavigation')}
              aria-describedby="keyboard-navigation-description"
            />
            <span id="keyboard-navigation-description" className={designSystem.a11y.visuallyHidden}>
              {settings.keyboardNavigation ? 'Keyboard navigation is enabled' : 'Keyboard navigation is disabled'}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end border-t pt-4">
        <Button 
          onClick={saveSettings}
          aria-label="Save all accessibility settings"
        >
          Save Accessibility Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccessibilitySettings;
