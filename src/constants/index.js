/**
 * Application Constants
 * 
 * This file contains all the constant values used throughout the application.
 * Centralizing constants makes the code more maintainable and easier to update.
 * 
 * Author: Junior Developer
 * Date: 2024
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_RENDER_URL || 'http://localhost:3000',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// Application Settings
export const APP_CONFIG = {
  NAME: 'Course Management System',
  VERSION: '1.0.0',
  DESCRIPTION: 'Browse and enroll in educational courses',
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
  NAME: /^[a-zA-Z\s'-]+$/, // Letters, spaces, hyphens, and apostrophes
  PHONE: /^\d+$/, // Numbers only
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email pattern
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Unable to connect to the server. Please check your internet connection.',
  TIMEOUT: 'Request took too long. Please try again.',
  VALIDATION: {
    NAME_REQUIRED: 'Name is required',
    NAME_INVALID: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    PHONE_REQUIRED: 'Phone number is required',
    PHONE_INVALID: 'Phone number can only contain numbers',
    CART_EMPTY: 'Your cart is empty. Please add lessons before checkout.',
  },
  API: {
    GENERIC: 'An error occurred. Please try again.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ORDER_PLACED: 'Order placed successfully! You will receive a confirmation email.',
  ADDED_TO_CART: 'Lesson added to cart successfully.',
  REMOVED_FROM_CART: 'Lesson removed from cart.',
};

// Loading Messages
export const LOADING_MESSAGES = {
  FETCHING_LESSONS: 'Loading lessons...',
  SEARCHING: 'Searching lessons...',
  PLACING_ORDER: 'Placing your order...',
  UPDATING_CART: 'Updating cart...',
};

// Cart Configuration
export const CART_CONFIG = {
  MAX_QUANTITY_PER_LESSON: 10,
  MIN_QUANTITY_PER_LESSON: 1,
};

// Sort Options
export const SORT_OPTIONS = [
  { value: 'subject', label: 'Subject', icon: 'fa-book' },
  { value: 'location', label: 'Location', icon: 'fa-map-marker-alt' },
  { value: 'price', label: 'Price', icon: 'fa-pound-sign' },
  { value: 'spaces', label: 'Available Spaces', icon: 'fa-users' },
];

// Sort Order
export const SORT_ORDER = [
  { value: 'asc', label: 'Ascending', icon: 'fa-sort-amount-up' },
  { value: 'desc', label: 'Descending', icon: 'fa-sort-amount-down' },
];

// UI Constants
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300, // milliseconds for search input
  ANIMATION_DURATION: 300, // milliseconds for transitions
  MOBILE_BREAKPOINT: 576, // pixels
  TABLET_BREAKPOINT: 768, // pixels
  DESKTOP_BREAKPOINT: 992, // pixels
};

// Image Configuration
export const IMAGE_CONFIG = {
  FALLBACK_ICON: 'fa-image',
  DEFAULT_ALT_TEXT: 'Lesson image',
  LOADING_PLACEHOLDER: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=',
};

// Lesson Icons (Font Awesome)
export const LESSON_ICONS = {
  'Mathematics': 'fa-calculator',
  'Physics': 'fa-atom',
  'Chemistry': 'fa-flask',
  'Biology': 'fa-dna',
  'Computer Science': 'fa-laptop-code',
  'English Literature': 'fa-book',
  'History': 'fa-landmark',
  'Art & Design': 'fa-palette',
  'Music': 'fa-music',
  'French': 'fa-language',
  'Spanish': 'fa-globe',
  'Geography': 'fa-map-marked-alt',
};

// Color Themes for Subjects
export const SUBJECT_COLORS = {
  'Mathematics': '#007bff', // Blue
  'Physics': '#28a745', // Green
  'Chemistry': '#dc3545', // Red
  'Biology': '#6610f2', // Purple
  'Computer Science': '#fd7e14', // Orange
  'English Literature': '#20c997', // Teal
  'History': '#6f42c1', // Indigo
  'Art & Design': '#e83e8c', // Pink
  'Music': '#ffc107', // Yellow
  'French': '#17a2b8', // Cyan
  'Spanish': '#343a40', // Dark
  'Geography': '#6c757d', // Gray
};

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'course_management_cart',
  USER_PREFERENCES: 'course_management_preferences',
  LAST_SEARCH: 'course_management_last_search',
};

// Pagination (if needed in future)
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
};

// Export all constants as a single object for convenience
export const CONSTANTS = {
  API_CONFIG,
  APP_CONFIG,
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  CART_CONFIG,
  SORT_OPTIONS,
  SORT_ORDER,
  UI_CONFIG,
  IMAGE_CONFIG,
  LESSON_ICONS,
  SUBJECT_COLORS,
  STORAGE_KEYS,
  PAGINATION,
};
