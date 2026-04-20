"use server";

import { API_URL } from "@/lib/config";

export async function submitServiceBooking(data: any) {
    try {
        const response = await fetch(`${API_URL}/services`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...data,
                // Ensure proper structure
            })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Failed to submit service booking");

        return { success: true, data: result.data };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
