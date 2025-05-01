
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import { toast } from 'sonner';
import { Sun, Moon, Monitor, Palette, Layout } from 'lucide-react';

const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [density, setDensity] = useState('normal');
  const [fontSize, setFontSize] = useState('medium');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  const savePreferences = () => {
    localStorage.setItem('ui-density', density);
    localStorage.setItem('font-size', fontSize);
    localStorage.setItem('animations-enabled', String(animationsEnabled));
    toast.success('Appearance preferences saved');
  };
  
  useEffect(() => {
    // Load saved preferences
    const savedDensity = localStorage.getItem('ui-density') || 'normal';
    const savedFontSize = localStorage.getItem('font-size') || 'medium';
    const savedAnimations = localStorage.getItem('animations-enabled') !== 'false';
    
    setDensity(savedDensity);
    setFontSize(savedFontSize);
    setAnimationsEnabled(savedAnimations);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-600" />
            <CardTitle>Theme</CardTitle>
          </div>
          <CardDescription>
            Customize the appearance of the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            defaultValue={theme} 
            onValueChange={setTheme}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem 
                value="light" 
                id="theme-light" 
                className="sr-only" 
              />
              <Label 
                htmlFor="theme-light"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-100 hover:border-gray-200 ${theme === 'light' ? 'border-blue-500' : ''}`}
              >
                <Sun className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Light</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem 
                value="dark" 
                id="theme-dark" 
                className="sr-only" 
              />
              <Label 
                htmlFor="theme-dark"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-zinc-950 text-white p-4 hover:bg-zinc-900 hover:border-gray-700 ${theme === 'dark' ? 'border-blue-500' : ''}`}
              >
                <Moon className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Dark</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem 
                value="system" 
                id="theme-system" 
                className="sr-only" 
              />
              <Label 
                htmlFor="theme-system"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-br from-white to-zinc-900 p-4 hover:from-gray-50 hover:to-zinc-800 ${theme === 'system' ? 'border-blue-500' : ''}`}
              >
                <Monitor className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">System</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-blue-600" />
            <CardTitle>Layout & Density</CardTitle>
          </div>
          <CardDescription>
            Adjust the spacing and layout of the interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="density-select">Interface Density</Label>
              <Select value={density} onValueChange={setDensity}>
                <SelectTrigger id="density-select">
                  <SelectValue placeholder="Select density" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="font-size-select">Font Size</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger id="font-size-select">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animations-toggle">Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable interface animations
                </p>
              </div>
              <Label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="animations-toggle"
                  checked={animationsEnabled}
                  onChange={(e) => setAnimationsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </Label>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button onClick={savePreferences}>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
