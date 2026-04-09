export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const API_URL = `${API_BASE_URL}/api`;

if (typeof window !== 'undefined') {
    console.log('BikeShowroom API Config:', {
        API_BASE_URL,
        isProduction: process.env.NODE_ENV === 'production'
    });
}

export const CONFIG = {
    API_BASE_URL,
    API_URL,
    WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000',
};
