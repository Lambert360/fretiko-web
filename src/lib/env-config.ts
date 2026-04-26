// Environment configuration for different modes
export const ENVIRONMENT = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

// Backend URLs based on environment
export const BACKEND_URLS = {
  development: process.env.DEV_BACKEND_URL || 'http://localhost:3000',
  production: process.env.PROD_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || '',
  test: process.env.TEST_BACKEND_URL || 'http://localhost:3000',
} as const;

// Get current backend URL based on environment
export function getBackendUrl(): string {
  // First check for explicit backend URL (for build time compatibility)
  let explicitUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
  if (explicitUrl) {
    // Auto-add https:// if no protocol specified
    if (!explicitUrl.startsWith('http://') && !explicitUrl.startsWith('https://')) {
      explicitUrl = `https://${explicitUrl}`;
    }
    return explicitUrl;
  }

  if (ENVIRONMENT.isDevelopment) {
    return BACKEND_URLS.development;
  }
  if (ENVIRONMENT.isProduction) {
    // Auto-add https:// if production URL lacks protocol
    let prodUrl = BACKEND_URLS.production;
    if (prodUrl && !prodUrl.startsWith('http://') && !prodUrl.startsWith('https://')) {
      prodUrl = `https://${prodUrl}`;
    }
    return prodUrl;
  }
  if (ENVIRONMENT.isTest) {
    return BACKEND_URLS.test;
  }
  
  // Fallback to development
  return BACKEND_URLS.development;
}

// Log environment info (only in development)
if (ENVIRONMENT.isDevelopment) {
  console.log('🔧 Development Mode Detected');
  console.log('🌐 Backend URL:', getBackendUrl());
  console.log('📦 Environment:', process.env.NODE_ENV);
}

// Export for easy usage
export const config = {
  backendUrl: getBackendUrl(),
  isDev: ENVIRONMENT.isDevelopment,
  isProd: ENVIRONMENT.isProduction,
  isTest: ENVIRONMENT.isTest,
} as const;
