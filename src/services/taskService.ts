import { apiClient } from "./apiClient.ts";
import type { AttemptServiceDTO } from "../models/dtos/AttemptServiceDTO.ts";
import { taskServiceMock } from "../__mocks__/taskServiceMock.ts";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const taskService = {

    getTaskAttempts: async (
        taskId: string,
        studentId?: string
    ): Promise<AttemptServiceDTO[]> => {
        if (USE_MOCK) return taskServiceMock.getTaskAttempts(taskId);

        const query = studentId ? `?studentId=${studentId}` : '';

        return apiClient.request<AttemptServiceDTO[]>(
            `/tasks/${taskId}/attempts${query}`,
            { method: 'GET' }
        );
    },

}

export { taskService }