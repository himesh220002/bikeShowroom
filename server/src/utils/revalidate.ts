import axios from 'axios';

/**
 * Triggers on-demand revalidation in the Next.js frontend
 * @param tag The cache tag to revalidate (e.g., 'bikes')
 */
export const triggerRevalidation = async (tag: string) => {
    const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    // Ensure no trailing slash for consistency
    const clientUrl = rawClientUrl.endsWith('/') ? rawClientUrl.slice(0, -1) : rawClientUrl;
    const secret = process.env.REVALIDATION_SECRET;

    if (!secret) {
        console.warn(`[Revalidate] ⚠️  Skipping revalidation for tag "${tag}": REVALIDATION_SECRET is not set in environment variables.`);
        return;
    }

    const revalidateUrl = `${clientUrl}/api/revalidate`;
    console.log(`[Revalidate] 🔄 Triggering revalidation for tag: "${tag}" at URL: ${revalidateUrl}`);

    try {
        const response = await axios.post(revalidateUrl, {
            tag,
            secret
        }, {
            timeout: 5000 // 5 second timeout
        });
        console.log(`[Revalidate] ✅ Success for tag "${tag}":`, response.data);
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message;
        const statusCode = error.response?.status;
        console.error(`[Revalidate] ❌ Failed for tag "${tag}" (Status: ${statusCode || 'Unknown'}):`, errorMessage);

        if (clientUrl.includes('localhost') && process.env.NODE_ENV === 'production') {
            console.warn(`[Revalidate] 💡 TIP: You are in production but CLIENT_URL is still set to localhost. Please set CLIENT_URL in your Render/Vercel dashboard.`);
        }
    }
};
