import React, { useState, useCallback } from 'react';

// Type for the validation rules object
type ValidationRules<T> = {
  [K in keyof T]?: (value: T[K], allValues: T) => string | null;
};

// Type for the errors object
type FormErrors<T> = {
  [K in keyof T]?: string;
};

export const useFormValidation = <T extends Record<string, any>>(
  initialState: T,
  validationRules: ValidationRules<T>
) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setValues(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  }, []);
  
  const validateField = (name: keyof T, value: T[keyof T], currentValues: T) => {
    const rule = validationRules[name];
    if (rule) {
      const error = rule(value, currentValues);
      setErrors(prev => ({ ...prev, [name]: error || undefined }));
    }
  };

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name as keyof T, value, values);
  }, [values, validationRules]);

  const validateForm = useCallback(() => {
    let formIsValid = true;
    const newErrors: FormErrors<T> = {};
    const newTouched: Partial<Record<keyof T, boolean>> = {};

    for (const key in validationRules) {
      const rule = validationRules[key];
      if (rule) {
        const error = rule(values[key], values);
        if (error) {
          formIsValid = false;
          newErrors[key] = error;
        }
      }
      newTouched[key] = true;
    }
    
    setErrors(newErrors);
    setTouched(newTouched);
    return formIsValid;
  }, [values, validationRules]);

  const resetForm = useCallback(() => {
      setValues(initialState);
      setErrors({});
      setTouched({});
  }, [initialState]);

  return {
    values,
    setValues,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  };
};

// Common validation functions
export const Validators = {
    required: (value: any) => (String(value || '').trim() ? null : 'This field is required.'),
    email: (value: string) => {
        if (!value) return null; // Don't validate if empty, let `required` handle that
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : 'Please enter a valid email address.';
    },
    url: (value: string) => {
        if (!value) return null;
        try {
            let fullUrl = value;
            if (!fullUrl.startsWith('http')) {
                fullUrl = `https://${fullUrl}`;
            }
            new URL(fullUrl);
            return null;
        } catch (_) {
            return 'Please enter a valid URL (e.g., example.com).';
        }
    },
};