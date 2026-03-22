import { LeadInput } from "../utils/validations";
import { calculateLeadScore, getLeadHeat } from "../utils/leadScoring";

export interface ProcessedLead extends LeadInput {
    id: string;
    score: number;
    heat: "Cold" | "Warm" | "Hot";
    createdAt: string;
    status: "New" | "Contacted" | "Test Ride" | "Booked";
}

export class LeadService {
    /**
     * Processes a new lead inquiry from the showroom site.
     * Ensures zero-error data transformation and strategic scoring.
     */
    static async processLead(input: LeadInput): Promise<ProcessedLead> {
        // 1. Map interests to scoring signals
        const signals: any[] = [];
        if (input.interests.some((i: string) => i.includes("EMI"))) signals.push("EMI_CALC");
        if (input.interests.some((i: string) => i.includes("Exchange"))) signals.push("EXCHANGE_VAL");
        signals.push("GENERAL_BROWSE");

        // 2. Calculate strategic score
        const score = calculateLeadScore(signals);
        const heat = getLeadHeat(score);

        // 3. Construct processed lead object
        const lead: ProcessedLead = {
            ...input,
            id: Math.random().toString(36).substring(7), // Temporary ID generation
            score,
            heat,
            createdAt: new Date().toISOString(),
            status: "New"
        };

        // 4. Persistence logic would go here (MongoDB/PostgreSQL)
        console.log(`[LeadService] Lead processed for ${input.name}. Score: ${score}. Heat: ${heat}`);

        return lead;
    }
}
