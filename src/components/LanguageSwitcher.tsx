
import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// Define available languages
const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'bn', name: 'বাংলা' },
];

export function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    // In a real implementation, this would update the app's language context
    // and potentially store the preference in localStorage
    console.log(`Language changed to: ${languageCode}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-[1.2rem] w-[1.2rem] text-blue-slate dark:text-blue-light" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-blue-light dark:bg-blue-slate border border-blue-border dark:border-blue-muted/30 rounded-xl">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={currentLanguage === language.code ? "bg-blue-accent/10 text-blue-accent" : ""}
            onClick={() => handleLanguageChange(language.code)}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
