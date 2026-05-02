/**
 * Formats a price string or number into a comma-separated format (Indian Numbering System).
 * Example: 182000 -> 1,82,000
 * Handles ranges: "182000 - 198000" -> "1,82,000 - 1,98,000"
 */
export function formatPrice(price: string | number | undefined | null): string {
    if (price === undefined || price === null) return "";

    const formatSingleValue = (val: string | number): string => {
        // Convert to string and remove existing commas/spaces to get the raw number
        const cleanValue = String(val).replace(/,/g, "").trim();
        const num = parseFloat(cleanValue);

        if (isNaN(num)) return String(val);

        // Use en-IN for Indian numbering system (e.g., 1,82,000)
        return new Intl.NumberFormat("en-IN").format(num);
    };

    const priceStr = String(price);

    // Handle ranges if present (e.g., "1,82,000 - 1,98,000" or "182000-198000")
    if (priceStr.includes("-")) {
        return priceStr
            .split("-")
            .map((part) => formatSingleValue(part))
            .join(" - ");
    }

    return formatSingleValue(priceStr);
}
