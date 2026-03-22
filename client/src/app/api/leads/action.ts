"use server";

import { calculateLeadScore, LeadSignal } from "@/lib/utils/leadScoring";

export async function submitLeadAction(formData: FormData) {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const interests = formData.getAll("interest") as string[];
    const message = formData.get("message") as string;

    // Map interests to scoring signals
    const signals: LeadSignal[] = [];
    if (interests.some(i => i.includes("EMI"))) signals.push("EMI_CALC");
    if (interests.some(i => i.includes("Exchange"))) signals.push("EXCHANGE_VAL");

    // Base browsing score
    signals.push("GENERAL_BROWSE");

    const score = calculateLeadScore(signals);

    const lead = {
        name,
        phone,
        interests,
        message,
        score,
        timestamp: new Date().toISOString(),
        status: "New"
    };

    // Here we would save to MongoDB as per requirements
    console.log("LEAD PROCESSED:", lead);

    return {
        success: true,
        score,
        message: "Thank you! Our Katihar team will contact you shortly."
    };
}
