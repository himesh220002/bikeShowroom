export type LeadSignal =
    | "EMI_CALC"
    | "EXCHANGE_VAL"
    | "PRICING_PAGE"
    | "BROCHURE_DL"
    | "GENERAL_BROWSE";

const SIGNAL_SCORES: Record<LeadSignal, number> = {
    EMI_CALC: 50,
    EXCHANGE_VAL: 45,
    PRICING_PAGE: 30,
    BROCHURE_DL: 15,
    GENERAL_BROWSE: 5,
};

export function calculateLeadScore(signals: LeadSignal[]): number {
    return signals.reduce((total, signal) => total + (SIGNAL_SCORES[signal] || 0), 0);
}

export function getLeadHeat(score: number): "Cold" | "Warm" | "Hot" {
    if (score >= 80) return "Hot";
    if (score >= 40) return "Warm";
    return "Cold";
}
