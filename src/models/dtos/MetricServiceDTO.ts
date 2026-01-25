interface MetricServiceDTO {
    attemptId: string,
    taskId: string,
    profileDiscoveryPercentage: number;
    finalAcceptance: number;
    remainingBudget: number;
    totalTurnsUsed: number;
    finalOutcome: MetricOutcome;
    sessionDate: string;
}

type MetricOutcome = 'WIN' | 'LOSE';

export type { MetricServiceDTO }