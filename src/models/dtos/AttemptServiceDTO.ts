interface AttemptServiceDTO {
    attemptId: string;
    taskId: string;
    startedAt: string;
    finishedAt: string;
    status: AttemptStatus;
    outcome: AttemptOutcome;
    score: number;
}

type AttemptStatus = 'UNKNOWN' | 'APPROVED' | 'DISAPPROVED';

type AttemptOutcome = 'WIN' | 'LOSE' | 'IN_PROGRESS';

export type { AttemptServiceDTO }