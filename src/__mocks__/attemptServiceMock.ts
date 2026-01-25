import type {MetricServiceDTO} from "../models/dtos/MetricServiceDTO.ts";

const attemptServiceMock = {
    getAttemptMetric: async (attemptId: string): Promise<MetricServiceDTO> => {
        return mockMetrics.find(metric => metric.taskId === attemptId) || {
            attemptId: "5f9a2d3c-7b8e-4c1a-9d6e-1a2b3c4d5e01",
            taskId: "26804dc9-d638-4394-9a72-97eb46548316",
            profileDiscoveryPercentage: 0.25,
            finalAcceptance: 0.1,
            remainingBudget: 85,
            totalTurnsUsed: 12,
            finalOutcome: "LOSE",
            sessionDate: "2026-02-01T13:20:10"
        }
    },
}

const mockMetrics: MetricServiceDTO[] = [
    {
        attemptId: "5f9a2d3c-7b8e-4c1a-9d6e-1a2b3c4d5e01",
        taskId: "26804dc9-d638-4394-9a72-97eb46548316",
        profileDiscoveryPercentage: 0.25,
        finalAcceptance: 0.1,
        remainingBudget: 85,
        totalTurnsUsed: 12,
        finalOutcome: "LOSE",
        sessionDate: "2026-02-01T13:20:10"
    },
    {
        attemptId: "6a1c9e4b-2d5f-4e8a-9b3c-7d8e1f2a3b02",
        taskId: "cf233f40-906d-4836-a516-ba1a1724a0de",
        profileDiscoveryPercentage: 0.35,
        finalAcceptance: 0.2,
        remainingBudget: 70,
        totalTurnsUsed: 18,
        finalOutcome: "LOSE",
        sessionDate: "2026-02-03T16:35:40"
    },
    {
        attemptId: "7b2e8c1d-4f6a-4c9e-8d3b-5a1f2c9e4d03",
        taskId: "c16b011a-73cb-4d57-a277-ef35054260d0",
        profileDiscoveryPercentage: 0.45,
        finalAcceptance: 0.3,
        remainingBudget: 60,
        totalTurnsUsed: 22,
        finalOutcome: "LOSE",
        sessionDate: "2026-02-10T18:25:00"
    },
    {
        attemptId: "8c4f1e9b-6d2a-4e5c-9b7d-3a2c1f8e4d04",
        taskId: "b23c4d5e-2222-4bbb-cccc-234567890111",
        profileDiscoveryPercentage: 0.90,
        finalAcceptance: 0.85,
        remainingBudget: 40,
        totalTurnsUsed: 30,
        finalOutcome: "WIN",
        sessionDate: "2026-02-10T19:25:00"
    },
    {
        attemptId: "9d5b2c8e-1a4f-4c6d-8e3a-7f9b1c2d5a05",
        taskId: "981a19d8-4abb-437f-80fa-d45084e44c14",
        profileDiscoveryPercentage: 0.50,
        finalAcceptance: 0.4,
        remainingBudget: 55,
        totalTurnsUsed: 25,
        finalOutcome: "LOSE",
        sessionDate: "2026-02-12T10:30:00"
    },
    {
        attemptId: "ad3e7c2b-5f9a-4d1c-9e6b-8a2f4c5d1e06",
        taskId: "84f942a3-0a17-4c9f-94c5-763ce8b72814",
        profileDiscoveryPercentage: 0.60,
        finalAcceptance: 0.5,
        remainingBudget: 45,
        totalTurnsUsed: 27,
        finalOutcome: "LOSE",
        sessionDate: "2026-02-13T11:20:00"
    },
    {
        attemptId: "bf8c1d5a-4e2b-4f9c-8a7d-6e3b2c9f1a07",
        taskId: "870b4a5f-f3a8-4fef-a1dd-cd65a64520f2",
        profileDiscoveryPercentage: 0.70,
        finalAcceptance: 0.6,
        remainingBudget: 30,
        totalTurnsUsed: 29,
        finalOutcome: "LOSE",
        sessionDate: "2026-02-14T12:10:00"
    }
];

export { attemptServiceMock };
