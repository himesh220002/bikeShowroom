import axios from 'axios';
import { API_URL, API_BASE_URL } from './config';
import io from 'socket.io-client';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Create a shared socket instance
export const socket = io(API_BASE_URL, {
    transports: ['polling', 'websocket'],
    autoConnect: true,
    // Add withCredentials if needed via extraHeaders or other means if supported by the version
});

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
