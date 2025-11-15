/**
 * Validator Utilities
 * 
 * Utilities for form validation.
 */

import { PRESCRIPTION_VALIDATION } from '@/config/constants';

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone number validation regex
 */
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

/**
 * URL validation regex
 */
const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

/**
 * Validate email
 * 
 * @param email Email to validate
 * @returns True if valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validate phone number
 * 
 * @param phone Phone number to validate
 * @returns True if valid, false otherwise
 */
export const isValidPhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone.replace(/\s/g, ''));
};

/**
 * Validate URL
 * 
 * @param url URL to validate
 * @returns True if valid, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  return URL_REGEX.test(url);
};

/**
 * Validate password strength
 * 
 * @param password Password to validate
 * @param minLength Minimum length (default: 6)
 * @returns True if valid, false otherwise
 */
export const isValidPassword = (
  password: string,
  minLength: number = 6
): boolean => {
  return password.length >= minLength;
};

/**
 * Validate required field
 * 
 * @param value Value to validate
 * @returns True if valid, false otherwise
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  return true;
};

/**
 * Validate string length
 * 
 * @param value Value to validate
 * @param min Minimum length
 * @param max Maximum length
 * @returns True if valid, false otherwise
 */
export const isValidLength = (
  value: string,
  min: number,
  max: number
): boolean => {
  if (!value) {
    return false;
  }
  
  return value.length >= min && value.length <= max;
};

/**
 * Validate prescription medicine details
 * 
 * @param medicineDetails Medicine details to validate
 * @returns Validation result
 */
export const validateMedicineDetails = (
  medicineDetails: string
): { isValid: boolean; error?: string } => {
  if (!isRequired(medicineDetails)) {
    return {
      isValid: false,
      error: 'Medicine details is required',
    };
  }
  
  if (
    !isValidLength(
      medicineDetails,
      PRESCRIPTION_VALIDATION.MEDICINE_DETAILS.MIN_LENGTH,
      PRESCRIPTION_VALIDATION.MEDICINE_DETAILS.MAX_LENGTH
    )
  ) {
    return {
      isValid: false,
      error: PRESCRIPTION_VALIDATION.MEDICINE_DETAILS.MESSAGE,
    };
  }
  
  return { isValid: true };
};

/**
 * Validate prescription patient name
 * 
 * @param patientName Patient name to validate
 * @returns Validation result
 */
export const validatePatientName = (
  patientName: string
): { isValid: boolean; error?: string } => {
  if (!isRequired(patientName)) {
    return {
      isValid: false,
      error: 'Patient name is required',
    };
  }
  
  if (
    !isValidLength(
      patientName,
      PRESCRIPTION_VALIDATION.PATIENT_NAME.MIN_LENGTH,
      PRESCRIPTION_VALIDATION.PATIENT_NAME.MAX_LENGTH
    )
  ) {
    return {
      isValid: false,
      error: PRESCRIPTION_VALIDATION.PATIENT_NAME.MESSAGE,
    };
  }
  
  return { isValid: true };
};

/**
 * Validate prescription form
 * 
 * @param formData Prescription form data
 * @returns Validation result with errors
 */
export const validatePrescriptionForm = (formData: {
  medicine_details: string;
  patient_name: string;
}): {
  isValid: boolean;
  errors?: {
    medicine_details?: string;
    patient_name?: string;
  };
} => {
  const errors: {
    medicine_details?: string;
    patient_name?: string;
  } = {};
  
  const medicineDetailsValidation = validateMedicineDetails(
    formData.medicine_details
  );
  if (!medicineDetailsValidation.isValid) {
    errors.medicine_details = medicineDetailsValidation.error;
  }
  
  const patientNameValidation = validatePatientName(formData.patient_name);
  if (!patientNameValidation.isValid) {
    errors.patient_name = patientNameValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

/**
 * Validate login form
 * 
 * @param formData Login form data
 * @returns Validation result with errors
 */
export const validateLoginForm = (formData: {
  email: string;
  password: string;
}): {
  isValid: boolean;
  errors?: {
    email?: string;
    password?: string;
  };
} => {
  const errors: {
    email?: string;
    password?: string;
  } = {};
  
  if (!isRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!isRequired(formData.password)) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

/**
 * Validate register form
 * 
 * @param formData Register form data
 * @returns Validation result with errors
 */
export const validateRegisterForm = (formData: {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  type: string;
}): {
  isValid: boolean;
  errors?: {
    name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    type?: string;
  };
} => {
  const errors: {
    name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    type?: string;
  } = {};
  
  if (!isRequired(formData.name)) {
    errors.name = 'Display name is required';
  }
  
  if (!isRequired(formData.first_name)) {
    errors.first_name = 'First name is required';
  }
  
  if (!isRequired(formData.last_name)) {
    errors.last_name = 'Last name is required';
  }
  
  if (!isRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!isRequired(formData.password)) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (!isRequired(formData.type)) {
    errors.type = 'Account type is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

/**
 * Validate broadcast form
 * 
 * @param formData Broadcast form data
 * @returns Validation result with errors
 */
export const validateBroadcastForm = (formData: {
  message: string;
}): {
  isValid: boolean;
  errors?: {
    message?: string;
  };
} => {
  const errors: {
    message?: string;
  } = {};
  
  if (!isRequired(formData.message)) {
    errors.message = 'Message is required';
  } else if (formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (formData.message.trim().length > 1000) {
    errors.message = 'Message must be less than 1000 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

