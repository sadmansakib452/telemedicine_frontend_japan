/**
 * Helper Functions
 * 
 * Utility functions for common operations.
 */

/**
 * Debounce function
 * 
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Throttle function
 * 
 * @param func Function to throttle
 * @param wait Wait time in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCall >= wait) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Check if value is empty
 * 
 * @param value Value to check
 * @returns True if empty, false otherwise
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
};

/**
 * Check if value is not empty
 * 
 * @param value Value to check
 * @returns True if not empty, false otherwise
 */
export const isNotEmpty = (value: any): boolean => {
  return !isEmpty(value);
};

/**
 * Truncate string
 * 
 * @param str String to truncate
 * @param length Maximum length
 * @param suffix Suffix to append (default: '...')
 * @returns Truncated string
 */
export const truncate = (
  str: string,
  length: number,
  suffix: string = '...'
): string => {
  if (str.length <= length) {
    return str;
  }
  
  return str.slice(0, length) + suffix;
};

/**
 * Generate unique ID
 * 
 * @returns Unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sleep function
 * 
 * @param ms Milliseconds to sleep
 * @returns Promise that resolves after specified time
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Retry function
 * 
 * @param func Function to retry
 * @param maxAttempts Maximum number of attempts
 * @param delay Delay between attempts in milliseconds
 * @returns Promise that resolves with function result
 */
export const retry = async <T>(
  func: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await func();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxAttempts) {
        await sleep(delay * attempt); // Exponential backoff
      }
    }
  }
  
  throw lastError!;
};

/**
 * Deep clone object
 * 
 * @param obj Object to clone
 * @returns Cloned object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge objects
 * 
 * @param target Target object
 * @param source Source object
 * @returns Merged object
 */
export const merge = <T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T => {
  return { ...target, ...source };
};

/**
 * Get nested value from object
 * 
 * @param obj Object to get value from
 * @param path Path to value (e.g., 'user.name')
 * @param defaultValue Default value if not found
 * @returns Value or default value
 */
export const getNestedValue = (
  obj: any,
  path: string,
  defaultValue: any = undefined
): any => {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    
    value = value[key];
  }
  
  return value ?? defaultValue;
};

/**
 * Set nested value in object
 * 
 * @param obj Object to set value in
 * @param path Path to value (e.g., 'user.name')
 * @param value Value to set
 * @returns Updated object
 */
export const setNestedValue = (
  obj: any,
  path: string,
  value: any
): any => {
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    } else {
      current[key] = { ...current[key] };
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
};

/**
 * Check if object has property
 * 
 * @param obj Object to check
 * @param path Path to property (e.g., 'user.name')
 * @returns True if property exists, false otherwise
 */
export const hasProperty = (obj: any, path: string): boolean => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return false;
    }
    
    if (!(key in current)) {
      return false;
    }
    
    current = current[key];
  }
  
  return true;
};

