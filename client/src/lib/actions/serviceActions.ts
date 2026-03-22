"use server";

export async function submitServiceBooking(data: any) {
    try {
        const response = await fetch("http://localhost:5000/api/services", {
            // Actually, I'll add a service endpoint to the server next.
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...data,
                interests: ["SERVICE_REQUEST"], // Tag it as service
                source: "Service Portal"
            })
        });

        if (!response.ok) throw new Error("Failed to submit service booking");

        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
