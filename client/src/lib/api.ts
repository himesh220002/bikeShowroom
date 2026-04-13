import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// We can't use hooks like useToast in a regular JS file
// But we can listen to a custom event or use a callback-based approach
// Alternatively, we can export a function that the ToastProvider will inject its showToast into.

let toastHandler: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void = () => { };

export const setToastHandler = (handler: typeof toastHandler) => {
    toastHandler = handler;
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';

        // Only show toast for actual errors, not cancellations or specific status codes if needed
        if (!(axios as any).isAxiosError(error) || !(axios as any).isCancel(error)) {
            toastHandler('error', message);
        }

        return Promise.reject(error);
    }
);

export default api;
