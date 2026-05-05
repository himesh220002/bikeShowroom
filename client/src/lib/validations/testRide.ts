import { z } from 'zod';

export const testRideSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    bikeModel: z.string().min(1, "Please select a bike model"),
    preferredDate: z.date({
        required_error: "Please select a preferred date",
        invalid_type_error: "That's not a date!",
    }),
    preferredTime: z.string().min(1, "Please select a preferred time"),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export type TestRideFormData = z.infer<typeof testRideSchema>;
