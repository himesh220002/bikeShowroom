import axios from 'axios';

/**
 * Triggers on-demand revalidation in the Next.js frontend
 * @param tag The cache tag to revalidate (e.g., 'bikes')
 */
export const triggerRevalidation = async (tag: string) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const secret = process.env.REVALIDATION_SECRET;

    if (!secret) {
        console.warn(`[Revalidate] Skipping revalidation for tag "${tag}": REVALIDATION_SECRET not set.`);
        return;
    }

    try {
        const response = await axios.post(`${clientUrl}/api/revalidate`, {
            tag,
            secret
        });
        console.log(`[Revalidate] Success for tag "${tag}":`, response.data);
    } catch (error: any) {
        console.error(`[Revalidate] Failed for tag "${tag}":`, error.response?.data || error.message);
    }
};
