/**
 * Cleanses mangled image URLs, removing "BIkeurl-" prefixes and handling duplicated/concatenated URLs.
 * @param url The raw URL string from input or database.
 * @returns A sanitized URL string.
 */
export const cleanImageUrl = (url: string): string => {
    if (!url || typeof url !== 'string') return "";

    // 1. Remove "BIkeurl-" prefix (case-insensitive and handle various spacing)
    let cleaned = url.replace(/BIkeurl[-\s]*/gi, "").trim();

    // 2. Handle concatenated/duplicated URLs (common with accidental double-pasting)
    // Find all occurrences of http:// or https://
    const matches = cleaned.match(/https?:\/\/[^\s]+/g);
    if (matches && matches.length > 0) {
        // Take the first valid URL
        cleaned = matches[0];
    }

    return cleaned;
};
