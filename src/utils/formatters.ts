/**
 * Formatter Utilities
 * 
 * Utilities for formatting dates, currencies, and other data types.
 */

/**
 * Format date to relative time (e.g., "2 hours ago")
 * 
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

/**
 * Format date to readable string (e.g., "January 1, 2024")
 * 
 * @param date Date to format
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options).format(targetDate);
};

/**
 * Format date to short string (e.g., "Jan 1, 2024")
 * 
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDateShort = (date: string | Date): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date to time string (e.g., "10:30 AM")
 * 
 * @param date Date to format
 * @returns Formatted time string
 */
export const formatTime = (date: string | Date): string => {
  return formatDate(date, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format date to date and time string (e.g., "January 1, 2024, 10:30 AM")
 * 
 * @param date Date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format date to ISO string (e.g., "2024-01-01T10:30:00.000Z")
 * 
 * @param date Date to format
 * @returns ISO date string
 */
export const formatISO = (date: string | Date): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  return targetDate.toISOString();
};

/**
 * Format currency
 * 
 * @param amount Amount to format
 * @param currency Currency code (default: 'USD')
 * @param locale Locale (default: 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format number
 * 
 * @param number Number to format
 * @param locale Locale (default: 'en-US')
 * @returns Formatted number string
 */
export const formatNumber = (
  number: number,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * Format file size
 * 
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format phone number
 * 
 * @param phone Phone number to format
 * @param format Format pattern (default: '(XXX) XXX-XXXX')
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (
  phone: string,
  format: string = '(XXX) XXX-XXXX'
): string => {
  const cleaned = phone.replace(/\D/g, '');
  let formatted = format;
  
  for (let i = 0; i < cleaned.length; i++) {
    formatted = formatted.replace('X', cleaned[i]);
  }
  
  return formatted.replace(/X/g, '');
};

/**
 * Format initials from name
 * 
 * @param name Name to format
 * @returns Initials string (e.g., "John Doe" -> "JD")
 */
export const formatInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 0) {
    return '';
  }
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format message preview
 * 
 * @param message Message to format
 * @param maxLength Maximum length (default: 50)
 * @returns Formatted message preview
 */
export const formatMessagePreview = (
  message: string | null,
  maxLength: number = 50
): string => {
  if (!message) {
    return '';
  }
  
  if (message.length <= maxLength) {
    return message;
  }
  
  return message.slice(0, maxLength) + '...';
};

