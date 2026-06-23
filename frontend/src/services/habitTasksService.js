import apiAuthenticatedClient from "./apiAuthenticatedClient";
import { API_ENDPOINTS } from "../constants/api";

export const habitTasksService = {
    /**
   * Busca uma tarefa específica pelo ID.
   * @param {string} id - O ID da tarefa
   */
  async getById(id) {
    try {
      const response = await apiAuthenticatedClient.get(API_ENDPOINTS.HABIT_TASKS.GET_BY_ID(id));

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get habit task by id error: ", error);
      return handleAxiosError(error, "Erro ao buscar tarefa");
    }
  },

    /**
     * Busca todas as tarefas de um hábito específico pelo ID do hábito.
     * @param {string} habitId - O ID do hábito
     */
    async getByHabitId(habitId) {
        try {
            const response = await apiAuthenticatedClient.get(API_ENDPOINTS.HABIT_TASKS.GET_BY_HABIT_ID(habitId));
        
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error("Get habit tasks by habit id error: ", error);
            return handleAxiosError(error, "Erro ao buscar tarefas do hábito");
        }
    },

    /**
     * Atualiza o status de uma tarefa de hábito específica.
     * @param {string} id - O ID da tarefa de hábito
     * @param {object} payload - O objeto (DTO) com os dados a serem atualizados
     */
    async updateStatus(id, payload) {
        try {
            const response = await apiAuthenticatedClient.put(API_ENDPOINTS.HABIT_TASKS.UPDATE_STATUS(id), payload);
            return {
                success: true,
                data: response.data || true,
            };
        } catch (error) {
            console.error("Update habit task status error: ", error);
            return handleAxiosError(error, "Erro ao atualizar status da tarefa do hábito");
        }
    },
}

/**
 * Função helper centralizada para tratar erros do Axios.
 */
function handleAxiosError(error, defaultErrorMessage) {
  if (error.response) {
    // O servidor respondeu com um erro (4xx, 5xx)
    const errorData = error.response.data;
    return {
      success: false,
      error:
        typeof errorData === "string"
          ? errorData
          : errorData.title || errorData.message || defaultErrorMessage,
    };
  } else if (error.request) {
    // A requisição foi feita, mas não houve resposta
    return {
      success: false,
      error: "Erro de conexão com o servidor.",
    };
  } else {
    // Erro ao configurar a requisição
    return {
      success: false,
      error: "Erro ao preparar a requisição.",
    };
  }
}