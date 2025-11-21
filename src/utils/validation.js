/**
 * Validation Utilities
 * 
 * This file contains validation functions for forms and data validation.
 * Provides centralized validation logic with helpful error messages.
 * 
 * Author: Junior Developer
 * Date: 2024
 */

import { VALIDATION_PATTERNS, ERROR_MESSAGES } from '@/constants';

/**
 * Validate customer name
 * @param {string} name - The name to validate
 * @returns {Object} - Validation result with isValid and message
 */
export function validateName(name) {
  if (!name || typeof name !== 'string') {
    return {
      isValid: false,
      message: ERROR_MESSAGES.VALIDATION.NAME_REQUIRED,
    };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.VALIDATION.NAME_REQUIRED,
    };
  }
  
  if (trimmedName.length < 2) {
    return {
      isValid: false,
      message: 'Name must be at least 2 characters long.',
    };
  }
  
  if (trimmedName.length > 50) {
    return {
      isValid: false,
      message: 'Name must be less than 50 characters long.',
    };
  }
  
  if (!VALIDATION_PATTERNS.NAME.test(trimmedName)) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.VALIDATION.NAME_INVALID,
    };
  }
  
  return {
    isValid: true,
    message: '',
  };
}

/**
 * Validate phone number
 * @param {string} phone - The phone number to validate
 * @returns {Object} - Validation result with isValid and message
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return {
      isValid: false,
      message: ERROR_MESSAGES.VALIDATION.PHONE_REQUIRED,
    };
  }
  
  const trimmedPhone = phone.trim();
  
  if (trimmedPhone.length === 0) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.VALIDATION.PHONE_REQUIRED,
    };
  }
  
  if (!VALIDATION_PATTERNS.PHONE.test(trimmedPhone)) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.VALIDATION.PHONE_INVALID,
    };
  }
  
  if (trimmedPhone.length < 10) {
    return {
      isValid: false,
      message: 'Phone number must be at least 10 digits long.',
    };
  }
  
  if (trimmedPhone.length > 15) {
    return {
      isValid: false,
      message: 'Phone number must be less than 15 digits long.',
    };
  }
  
  return {
    isValid: true,
    message: '',
  };
}

/**
 * Validate email address
 * @param {string} email - The email to validate
 * @returns {Object} - Validation result with isValid and message
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      message: 'Email is required.',
    };
  }
  
  const trimmedEmail = email.trim();
  
  if (trimmedEmail.length === 0) {
    return {
      isValid: false,
      message: 'Email is required.',
    };
  }
  
  if (!VALIDATION_PATTERNS.EMAIL.test(trimmedEmail)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address.',
    };
  }
  
  return {
    isValid: true,
    message: '',
  };
}

/**
 * Validate search query
 * @param {string} query - The search query to validate
 * @returns {Object} - Validation result with isValid and message
 */
export function validateSearchQuery(query) {
  if (!query || typeof query !== 'string') {
    return {
      isValid: true, // Empty search is valid (returns all results)
      message: '',
    };
  }
  
  const trimmedQuery = query.trim();
  
  if (trimmedQuery.length === 0) {
    return {
      isValid: true, // Empty search is valid
      message: '',
    };
  }
  
  if (trimmedQuery.length > 100) {
    return {
      isValid: false,
      message: 'Search query must be less than 100 characters.',
    };
  }
  
  return {
    isValid: true,
    message: '',
  };
}

/**
 * Validate lesson quantity
 * @param {number} quantity - The quantity to validate
 * @param {number} availableSpaces - The available spaces
 * @returns {Object} - Validation result with isValid and message
 */
export function validateQuantity(quantity, availableSpaces = Infinity) {
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    return {
      isValid: false,
      message: 'Quantity must be a valid number.',
    };
  }
  
  if (quantity < 1) {
    return {
      isValid: false,
      message: 'Quantity must be at least 1.',
    };
  }
  
  if (quantity > 10) {
    return {
      isValid: false,
      message: 'Maximum quantity per lesson is 10.',
    };
  }
  
  if (quantity > availableSpaces) {
    return {
      isValid: false,
      message: `Only ${availableSpaces} spaces available.`,
    };
  }
  
  return {
    isValid: true,
    message: '',
  };
}

/**
 * Validate lesson object
 * @param {Object} lesson - The lesson object to validate
 * @returns {Object} - Validation result with isValid and message
 */
export function validateLesson(lesson) {
  if (!lesson || typeof lesson !== 'object') {
    return {
      isValid: false,
      message: 'Invalid lesson data.',
    };
  }
  
  const requiredFields = ['_id', 'subject', 'location', 'price', 'spaces', 'image'];
  const missingFields = requiredFields.filter(field => !lesson[field]);
  
  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(', ')}`,
    };
  }
  
  if (typeof lesson.price !== 'number' || lesson.price < 0) {
    return {
      isValid: false,
      message: 'Price must be a positive number.',
    };
  }
  
  if (typeof lesson.spaces !== 'number' || lesson.spaces < 0) {
    return {
      isValid: false,
      message: 'Spaces must be a positive number.',
    };
  }
  
  return {
    isValid: true,
    message: '',
  };
}

/**
 * Validate cart items
 * @param {Array} cartItems - The cart items to validate
 * @returns {Object} - Validation result with isValid and message
 */
export function validateCart(cartItems) {
  if (!Array.isArray(cartItems)) {
    return {
      isValid: false,
      message: 'Invalid cart data.',
    };
  }
  
  if (cartItems.length === 0) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.VALIDATION.CART_EMPTY,
    };
  }
  
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const lessonValidation = validateLesson(item);
    
    if (!lessonValidation.isValid) {
      return {
        isValid: false,
        message: `Invalid item in cart (${i + 1}): ${lessonValidation.message}`,
      };
    }
    
    const quantityValidation = validateQuantity(item.quantity, item.spaces);
    if (!quantityValidation.isValid) {
      return {
        isValid: false,
        message: `Invalid quantity for ${item.subject}: ${quantityValidation.message}`,
      };
    }
  }
  
  return {
    isValid: true,
    message: '',
  };
}

/**
 * Validate customer information for checkout
 * @param {Object} customerInfo - The customer information to validate
 * @returns {Object} - Validation result with isValid and message
 */
export function validateCustomerInfo(customerInfo) {
  if (!customerInfo || typeof customerInfo !== 'object') {
    return {
      isValid: false,
      message: 'Invalid customer information.',
    };
  }
  
  const nameValidation = validateName(customerInfo.name);
  if (!nameValidation.isValid) {
    return nameValidation;
  }
  
  const phoneValidation = validatePhone(customerInfo.phone);
  if (!phoneValidation.isValid) {
    return phoneValidation;
  }
  
  return {
    isValid: true,
    message: '',
  };
}

/**
 * Validate complete order data
 * @param {Object} orderData - The order data to validate
 * @returns {Object} - Validation result with isValid and message
 */
export function validateOrder(orderData) {
  if (!orderData || typeof orderData !== 'object') {
    return {
      isValid: false,
      message: 'Invalid order data.',
    };
  }
  
  // Validate customer info
  const customerValidation = validateCustomerInfo(orderData);
  if (!customerValidation.isValid) {
    return customerValidation;
  }
  
  // Validate that lessonIDs and numSpaces arrays exist and match
  if (!Array.isArray(orderData.lessonIDs) || !Array.isArray(orderData.numSpaces)) {
    return {
      isValid: false,
      message: 'Order must include lesson IDs and quantities.',
    };
  }
  
  if (orderData.lessonIDs.length !== orderData.numSpaces.length) {
    return {
      isValid: false,
      message: 'Lesson IDs and quantities must match.',
    };
  }
  
  if (orderData.lessonIDs.length === 0) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.VALIDATION.CART_EMPTY,
    };
  }
  
  return {
    isValid: true,
    message: '',
  };
}

/**
 * Sanitize input string
 * @param {string} input - The input to sanitize
 * @returns {string} - The sanitized input
 */
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Format validation errors for display
 * @param {Object} validationResult - The validation result
 * @returns {string} - Formatted error message
 */
export function formatValidationError(validationResult) {
  if (!validationResult) {
    return 'Validation error occurred.';
  }
  
  return validationResult.message || 'Invalid input.';
}

// Export all validation functions as a single object for convenience
export const validators = {
  name: validateName,
  phone: validatePhone,
  email: validateEmail,
  searchQuery: validateSearchQuery,
  quantity: validateQuantity,
  lesson: validateLesson,
  cart: validateCart,
  customerInfo: validateCustomerInfo,
  order: validateOrder,
};
