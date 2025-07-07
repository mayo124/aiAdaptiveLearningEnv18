// API Configuration for both development and production environments

const getBaseUrl = () => {
  // For Vercel deployment, use relative URLs (which will be the same domain)
  if (typeof window !== 'undefined') {
    // Client-side
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3001';
    }
    return window.location.origin; // Uses same domain as frontend
  }
  
  // Server-side or fallback
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

export const API_BASE_URL = getBaseUrl();

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/health`,
  biologyLearn: `${API_BASE_URL}/api/biology/learn`,
  wordExplanation: `${API_BASE_URL}/api/biology/word-explanation`,
};

// Utility function for making API requests with error handling
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Biology learning API function
export const biologyLearnAPI = async (topic: string) => {
  return apiRequest(API_ENDPOINTS.biologyLearn, {
    method: 'POST',
    body: JSON.stringify({ topic }),
  });
};

// Word explanation API function
export const wordExplanationAPI = async (word: string, context?: string) => {
  return apiRequest(API_ENDPOINTS.wordExplanation, {
    method: 'POST',
    body: JSON.stringify({ word, context }),
  });
};

// Health check API function
export const healthCheckAPI = async () => {
  return apiRequest(API_ENDPOINTS.health);
};
