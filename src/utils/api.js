/**
 * API Utility Functions
 * 
 * This file contains utility functions for making API calls to the backend.
 * It provides centralized error handling and response processing.
 * 
 * Author: Junior Developer
 * Date: 2024
 */

// Get the base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_RENDER_URL || 'http://localhost:3000';

/**
 * Generic API request function with error handling
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Object>} - The response data
 * @throws {Error} - If the request fails
 */
export async function apiRequest(endpoint, options = {}) {
  try {
    // Construct the full URL
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Set default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    // Merge default headers with provided headers
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };
    
    // Make the fetch request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    // Check if the response is successful
    if (!response.ok) {
      // Try to get error message from response body
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    // Parse and return the response data
    return await response.json();
    
  } catch (error) {
    // Handle different types of errors
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection and try again.');
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      // Re-throw the error with a more user-friendly message
      throw error;
    }
  }
}

/**
 * Get all lessons from the API
 * @returns {Promise<Array>} - Array of lesson objects
 */
export async function getLessons() {
  return await apiRequest('/lessons');
}

/**
 * Get a single lesson by ID
 * @param {string} id - The lesson ID
 * @returns {Promise<Object>} - The lesson object
 */
export async function getLesson(id) {
  return await apiRequest(`/lessons/${id}`);
}

/**
 * Search lessons by query
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of matching lesson objects
 */
export async function searchLessons(query) {
  if (!query || query.trim() === '') {
    return getLessons(); // Return all lessons if query is empty
  }
  return await apiRequest(`/search?q=${encodeURIComponent(query.trim())}`);
}

/**
 * Create a new order
 * @param {Object} orderData - The order data
 * @returns {Promise<Object>} - The created order
 */
export async function createOrder(orderData) {
  return await apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

/**
 * Update lesson spaces
 * @param {string} id - The lesson ID
 * @param {number} spaces - The new number of spaces
 * @returns {Promise<Object>} - The updated lesson
 */
export async function updateLessonSpaces(id, spaces) {
  return await apiRequest(`/lessons/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ spaces }),
  });
}

/**
 * Get image URL for a lesson
 * @param {string} filename - The image filename
 * @returns {string} - The full image URL
 */
export function getImageUrl(filename) {
  return `${API_BASE_URL}/images/${filename}`;
}

/**
 * Validate API response data
 * @param {any} data - The data to validate
 * @param {string} expectedType - The expected data type ('array', 'object')
 * @returns {boolean} - True if data is valid
 */
export function validateApiResponse(data, expectedType = 'object') {
  if (expectedType === 'array') {
    return Array.isArray(data);
  }
  return typeof data === 'object' && data !== null;
}

/**
 * Handle API errors consistently
 * @param {Error} error - The error to handle
 * @returns {string} - User-friendly error message
 */
export function handleApiError(error) {
  if (error.message.includes('Network error')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  } else if (error.message.includes('timeout')) {
    return 'Request took too long. Please try again.';
  } else if (error.message.includes('404')) {
    return 'The requested resource was not found.';
  } else if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  } else {
    return error.message || 'An unexpected error occurred.';
  }
}

// Export the API base URL for reference
export { API_BASE_URL };
