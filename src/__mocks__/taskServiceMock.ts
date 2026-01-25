import type {AttemptServiceDTO} from "../models/dtos/AttemptServiceDTO.ts";

const taskServiceMock = {
    getTaskAttempts: async (taskId: string): Promise<AttemptServiceDTO[]> => {
        return mockAttempts.filter(attempt => attempt.taskId === taskId);
    }
}

const mockAttempts: AttemptServiceDTO[] = [
    // Tarea 1 - IN_PROGRESS
    {
        attemptId: "26804dc9-d638-4394-9a72-97eb46548316",
        taskId: "0747b3ba-8e54-4d0c-941f-c42afb2889ed",
        startedAt: "2026-02-01T13:00:20",
        finishedAt: "2026-02-01T13:20:10",
        status: "DISAPPROVED",
        outcome: "LOSE",
        score: 0.1
    },
    {
        attemptId: "cf233f40-906d-4836-a516-ba1a1724a0de",
        taskId: "0747b3ba-8e54-4d0c-941f-c42afb2889ed",
        startedAt: "2026-02-03T16:10:00",
        finishedAt: "2026-02-03T16:35:40",
        status: "DISAPPROVED",
        outcome: "LOSE",
        score: 0.2
    },

    // Tarea 3 - COMPLETED
    {
        attemptId: "c16b011a-73cb-4d57-a277-ef35054260d0",
        taskId: "7880d421-89c6-4cee-b994-7377cedbdbcb",
        startedAt: "2026-02-10T18:00:00",
        finishedAt: "2026-02-10T18:25:00",
        status: "DISAPPROVED",
        outcome: "LOSE",
        score: 0.3
    },
    {
        attemptId: "b23c4d5e-2222-4bbb-cccc-234567890111",
        taskId: "7880d421-89c6-4cee-b994-7377cedbdbcb",
        startedAt: "2026-02-10T19:00:00",
        finishedAt: "2026-02-10T19:25:00",
        status: "APPROVED",
        outcome: "WIN",
        score: 0.85
    },

    // Tarea 4 - FAILED
    {
        attemptId: "981a19d8-4abb-437f-80fa-d45084e44c14",
        taskId: "1903be90-0056-4072-af12-867ff10e9e96",
        startedAt: "2026-02-12T10:00:00",
        finishedAt: "2026-02-12T10:30:00",
        status: "DISAPPROVED",
        outcome: "LOSE",
        score: 0.4
    },
    {
        attemptId: "84f942a3-0a17-4c9f-94c5-763ce8b72814",
        taskId: "1903be90-0056-4072-af12-867ff10e9e96",
        startedAt: "2026-02-13T11:00:00",
        finishedAt: "2026-02-13T11:20:00",
        status: "DISAPPROVED",
        outcome: "LOSE",
        score: 0.5
    },
    {
        attemptId: "870b4a5f-f3a8-4fef-a1dd-cd65a64520f2",
        taskId: "1903be90-0056-4072-af12-867ff10e9e96",
        startedAt: "2026-02-14T12:00:00",
        finishedAt: "2026-02-14T12:10:00",
        status: "DISAPPROVED",
        outcome: "LOSE",
        score: 0.6
    }
];

export { taskServiceMock, mockAttempts }