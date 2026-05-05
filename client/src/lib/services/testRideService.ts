import api from '../api';

export interface TestRideData {
    _id: string; // Made required for the table
    name: string;
    phone: string;
    email?: string;
    bikeModel: string;
    preferredDate: string | Date;
    preferredTime: string;
    status: 'Unread' | 'Scheduled' | 'Completed' | 'Cancelled';
    notes?: string;
    adminRemarks?: string;
    staffRemark?: string;
    createdAt: string;
    associatedLead?: {
        status: string;
        heat: string;
        score: number;
        _id: string;
    } | null;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const createTestRide = async (data: any): Promise<ApiResponse<TestRideData>> => {
    const response = await api.post('/test-rides', data);
    return response.data as ApiResponse<TestRideData>;
};

export const getTestRides = async (): Promise<ApiResponse<TestRideData[]>> => {
    const response = await api.get('/test-rides');
    return response.data as ApiResponse<TestRideData[]>;
};

export const updateTestRideStatus = async (id: string, status: string, remarks?: { adminRemarks?: string, staffRemark?: string }): Promise<ApiResponse<TestRideData>> => {
    const response = await api.patch(`/test-rides/${id}`, { status, ...remarks });
    return response.data as ApiResponse<TestRideData>;
};

export const getUnreadTestRideCount = async (): Promise<{ success: boolean, count: number }> => {
    const response = await api.get('/test-rides/unread-count');
    return response.data as { success: boolean, count: number };
};
