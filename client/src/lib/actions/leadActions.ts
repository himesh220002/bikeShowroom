"use server";

import { LeadSchema } from "../validations/lead";
import { LeadService } from "../services/leadService";

export async function submitLead(formData: FormData) {
    try {
        // 1. Extract raw data
        const rawData = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            email: formData.get("email") || undefined,
            interests: formData.getAll("interest"),
            message: formData.get("message") || undefined,
            utmSource: formData.get("utm_source") || undefined,
            utmMedium: formData.get("utm_medium") || undefined,
            utmCampaign: formData.get("utm_campaign") || undefined,
            utmContent: formData.get("utm_content") || undefined,
            utmTerm: formData.get("utm_term") || undefined,
        };

        // 2. Validate with Zod (The "No Errors Walk Under Our Vision" Gate)
        const validatedData = LeadSchema.parse(rawData);

        // 3. Process with Service Layer
        const result = await LeadService.processLead(validatedData);

        return {
            success: true,
            message: "Lead processed successfully by the Choudhary Yamaha Service Engine.",
            data: result
        };

    } catch (error: any) {
        console.error("[LeadAction] Error:", error.errors || error.message);

        return {
            success: false,
            message: error.errors?.[0]?.message || "Validation failed. Please check your inputs.",
            errors: error.errors
        };
    }
}
