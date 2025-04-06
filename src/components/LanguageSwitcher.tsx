
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
          <Globe className="h-[1.2rem] w-[1.2rem] text-[#4A6572] dark:text-white" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-[#4A6572] border border-[#F0F0F0] dark:border-[#7F8C8D]/30 rounded-xl shadow-apple">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={`cursor-pointer ${currentLanguage === language.code ? "bg-[#006039]/10 text-[#006039]" : "hover:bg-[#F0F0F0] dark:hover:bg-[#7F8C8D]/20"} rounded-md my-0.5 text-sf-body`}
            onClick={() => handleLanguageChange(language.code)}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
