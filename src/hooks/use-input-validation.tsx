
import { useState, useCallback } from 'react';

interface ValidationRule {
  validator: (value: string | number) => boolean;
  message: string;
}

interface ValidationConfig {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: ValidationRule[];
}

export function useInputValidation(initialValue: string = '', config: ValidationConfig = {}) {
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  
  const validate = useCallback(() => {
    // Reset error
    setError(null);
    
    // Required validation
    if (config.required && !value.trim()) {
      setError('This field is required');
      return false;
    }
    
    // Numeric validation for min/max
    if ((config.min !== undefined || config.max !== undefined) && value.trim()) {
      const numValue = parseFloat(value);
      
      if (isNaN(numValue)) {
        setError('Please enter a valid number');
        return false;
      }
      
      if (config.min !== undefined && numValue < config.min) {
        setError(`Value must be at least ${config.min}`);
        return false;
      }
      
      if (config.max !== undefined && numValue > config.max) {
        setError(`Value must be at most ${config.max}`);
        return false;
      }
    }
    
    // Pattern validation
    if (config.pattern && value.trim() && !config.pattern.test(value)) {
      setError('Please enter a valid format');
      return false;
    }
    
    // Custom validations
    if (config.custom) {
      for (const rule of config.custom) {
        if (!rule.validator(value)) {
          setError(rule.message);
          return false;
        }
      }
    }
    
    return true;
  }, [value, config]);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (isTouched) {
      // Re-validate on change if field was already touched
      validate();
    }
  }, [isTouched, validate]);
  
  const handleBlur = useCallback(() => {
    setIsTouched(true);
    validate();
  }, [validate]);
  
  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setIsTouched(false);
  }, [initialValue]);
  
  return {
    value,
    setValue,
    error,
    setError,
    handleChange,
    handleBlur,
    validate,
    reset,
    isTouched
  };
}

export default useInputValidation;
