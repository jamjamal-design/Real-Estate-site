import { FormErrors } from './types';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (Nigerian format)
const PHONE_REGEX = /^(\+234|0)[789]\d{9}$/;

// Validate email
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

// Validate phone
export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return 'Phone number is required';
  }
  if (!PHONE_REGEX.test(phone)) {
    return 'Please enter a valid Nigerian phone number (e.g., +2348012345678 or 08012345678)';
  }
  return null;
};

// Validate required field
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

// Validate min length
export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

// Validate max length
export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

// Validate number
export const validateNumber = (value: string | number, fieldName: string): string | null => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) {
    return `${fieldName} must be a valid number`;
  }
  return null;
};

// Validate positive number
export const validatePositiveNumber = (value: string | number, fieldName: string): string | null => {
  const numError = validateNumber(value, fieldName);
  if (numError) return numError;
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (numValue <= 0) {
    return `${fieldName} must be greater than 0`;
  }
  return null;
};

// Booking form validation
export const validateBookingForm = (data: {
  clientName: string;
  email: string;
  phone: string;
  serviceType?: string;
  message?: string;
}): FormErrors => {
  const errors: FormErrors = {};

  const nameError = validateRequired(data.clientName, 'Full Name');
  if (nameError) errors.clientName = nameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;

  return errors;
};

// Property form validation (for admin)
export const validatePropertyForm = (data: {
  title: string;
  type: string;
  price: string | number;
  location: string;
  size: string;
}): FormErrors => {
  const errors: FormErrors = {};

  const titleError = validateRequired(data.title, 'Title');
  if (titleError) errors.title = titleError;

  const typeError = validateRequired(data.type, 'Property Type');
  if (typeError) errors.type = typeError;

  const priceError = validatePositiveNumber(data.price, 'Price');
  if (priceError) errors.price = priceError;

  const locationError = validateRequired(data.location, 'Location');
  if (locationError) errors.location = locationError;

  const sizeError = validateRequired(data.size, 'Size');
  if (sizeError) errors.size = sizeError;

  return errors;
};

// Check if form has errors
export const hasFormErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
