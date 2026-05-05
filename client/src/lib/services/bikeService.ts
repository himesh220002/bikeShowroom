import api from '../api';

export interface Bike {
    _id: string;
    name: string;
    slug: string;
    category: 'bike' | 'scooty';
    price: string;
    colors: {
        name: string;
        hex: string;
        image: string;
        colorOption: string;
        stock: number;
        price?: string;
    }[];
    variants?: {
        name: string;
        price: string;
        colors: {
            name: string;
            hex: string;
            image: string;
            colorOption: string;
            stock: number;
            price?: string;
        }[];
    }[];
    specs?: {
        icon: string;
        label: string;
    }[];
    tag?: string;
    description?: string;
    threeSixtyUrl?: string;
    threeSixtyImageCount?: number;
    brochureUrl?: string;
    image2?: string;
}

export const getAllBikes = async (): Promise<{ success: boolean; data: Bike[] }> => {
    const response = await api.get('/bikes');
    return response.data as { success: boolean; data: Bike[] };
};

export const getBikeBySlug = async (slug: string): Promise<{ success: boolean; data: Bike }> => {
    const response = await api.get(`/bikes/slug/${slug}`);
    return response.data as { success: boolean; data: Bike };
};
