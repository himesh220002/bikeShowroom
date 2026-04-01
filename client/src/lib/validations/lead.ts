import { z } from "zod";

export const LeadSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be under 50 characters"),
    phone: z.string()
        .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
    interests: z.array(z.string()).min(1, "Please select at least one interest"),
    email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
    message: z.string().max(500, "Message must be under 500 characters").optional(),
});

export type LeadInput = z.infer<typeof LeadSchema>;
