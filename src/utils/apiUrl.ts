//********************************************************************
//
// API URL Utility
//
// Utility function to properly join API base URL with endpoints,
// handling trailing/leading slashes correctly.
//
//*******************************************************************

/**
 * Joins a base URL with an endpoint, handling trailing/leading slashes
 * @param baseUrl - The base API URL (e.g., "https://api.evendating.us/api")
 * @param endpoint - The endpoint path (e.g., "/admin/photos" or "admin/photos")
 * @returns Properly joined URL
 */
export function joinApiUrl(baseUrl: string, endpoint: string): string {
  // Remove trailing slash from baseUrl
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  
  // Remove leading slash from endpoint and add it back
  const normalizedEndpoint = '/' + endpoint.replace(/^\/+/, '');
  
  return normalizedBase + normalizedEndpoint;
}

/**
 * Gets the API base URL from environment variables
 * @returns The API base URL, defaulting to production if not set
 */
export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_BASE_URL || 'https://api.evendating.us/api';
  // Ensure no trailing slash
  let baseUrl = url.replace(/\/+$/, '');
  
  // Validate that the base URL doesn't contain tokens or credentials
  // Check for common patterns that might indicate a token in the URL
  if (baseUrl.includes('Bearer ') || baseUrl.includes('token=') || baseUrl.includes('auth=')) {
    console.error('Warning: API base URL appears to contain credentials. This is a security issue.');
    // Remove any token-like patterns from the URL
    baseUrl = baseUrl.split('Bearer ')[0].split('token=')[0].split('auth=')[0].replace(/\/+$/, '');
  }
  
  return baseUrl;
}


