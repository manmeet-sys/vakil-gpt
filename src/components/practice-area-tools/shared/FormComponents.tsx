
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { designSystem } from '@/lib/design-system-standards';

// Standardized text input with consistent styling
export const FormInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    description?: string;
    error?: string;
    id: string;
  }
>(({ label, description, error, id, ...props }, ref) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={designSystem.forms.label}>
        {label}
      </Label>
      <Input ref={ref} id={id} {...props} className={`${designSystem.forms.input} ${error ? 'border-red-500' : ''}`} />
      {description && <p className={designSystem.forms.helpText}>{description}</p>}
      {error && <p className={designSystem.forms.errorText}>{error}</p>}
    </div>
  );
});
FormInput.displayName = "FormInput";

// Standardized textarea with consistent styling
export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    description?: string;
    error?: string;
    id: string;
  }
>(({ label, description, error, id, ...props }, ref) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={designSystem.forms.label}>
        {label}
      </Label>
      <Textarea ref={ref} id={id} {...props} className={`${designSystem.forms.input} min-h-[120px]`} />
      {description && <p className={designSystem.forms.helpText}>{description}</p>}
      {error && <p className={designSystem.forms.errorText}>{error}</p>}
    </div>
  );
});
FormTextarea.displayName = "FormTextarea";

// Standardized select component
export const FormSelect = React.forwardRef<
  HTMLSelectElement,
  {
    label: string;
    id: string;
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    description?: string;
    error?: string;
  }
>(({ label, id, options, value, onChange, placeholder, description, error }, ref) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={designSystem.forms.label}>
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder={placeholder || 'Select an option'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <p className={designSystem.forms.helpText}>{description}</p>}
      {error && <p className={designSystem.forms.errorText}>{error}</p>}
    </div>
  );
});
FormSelect.displayName = "FormSelect";

// File upload component with consistent styling
export const FileUpload = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    description?: string;
    error?: string;
    id: string;
    acceptedFileTypes?: string;
    selectedFile?: File | null;
    onFileSelected?: (file: File | null) => void;
  }
>(({ label, description, error, id, acceptedFileTypes, selectedFile, onFileSelected, ...props }, ref) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (onFileSelected) {
      onFileSelected(file);
    }
  };

  const handleRemoveFile = () => {
    if (onFileSelected) {
      onFileSelected(null);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={designSystem.forms.label}>
        {label}
      </Label>
      
      {!selectedFile ? (
        <div className="border-2 border-dashed border-input rounded-md p-6 text-center">
          <Input
            ref={ref}
            id={id}
            type="file"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            className="hidden"
            {...props}
          />
          <label
            htmlFor={id}
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <span className="text-sm font-medium mb-1">Drag & drop file here or click to browse</span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </label>
        </div>
      ) : (
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        </div>
      )}
      
      {error && <p className={designSystem.forms.errorText}>{error}</p>}
    </div>
  );
});
FileUpload.displayName = "FileUpload";

// AI Toggle component with consistent styling
export interface AIToggleProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  description?: string;
}

export const AIToggle: React.FC<AIToggleProps> = ({
  enabled,
  setEnabled,
  description
}) => {
  return (
    <div className="mt-4 pt-4 border-t border-border/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">AI-Enhanced Analysis</span>
          <div className="h-4 w-4 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-xs text-blue-600">AI</span>
          </div>
        </div>
        <Switch 
          checked={enabled} 
          onCheckedChange={setEnabled}
          aria-label="Enable AI assistance"
        />
      </div>
      {description && enabled && (
        <p className="text-sm text-muted-foreground italic mb-2">
          {description}
        </p>
      )}
    </div>
  );
};
