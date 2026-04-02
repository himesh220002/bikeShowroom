import { LeadInput } from "../validations/lead";

export interface ProcessedLead extends LeadInput {
    id: string;
    score: number;
    heat: "Cold" | "Warm" | "Hot";
    createdAt: string;
    status: "New" | "Contacted" | "Test Ride" | "Booked";
}

import { API_URL } from '../config';
const API_BASE_URL = API_URL;

export class LeadService {
    /**
     * Processes a new lead inquiry from the showroom site.
     * Connects to the Express backend for persistence and real-time updates.
     */
    static async processLead(input: LeadInput): Promise<ProcessedLead> {
        try {
            const response = await fetch(`${API_BASE_URL}/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to submit lead to engine');
            }

            const result = await response.json();
            return result.data;
        } catch (error: any) {
            console.error("[LeadService] Error:", error.message);
            throw error;
        }
    }
}
