import apiAuthenticatedClient from "./apiAuthenticatedClient";
import { API_ENDPOINTS } from "../constants/api";

export const tasksService = {
  /**
   * Cria uma nova tarefa.
   * @param {object} payload - O objeto (DTO) com os dados da tarefa a criar
   */
  async create(payload) {
    try {
      const response = await apiAuthenticatedClient.post(API_ENDPOINTS.TASKS.CREATE, payload);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Create task error: ", error);
      return handleAxiosError(error, "Erro ao criar tarefa");
    }
  },

  /**
   * Busca todas as tarefas, com filtros opcionais.
   * @param {object} params - Objeto com os filtros. Ex: { status: 1, category: 1 }
   */
  async getAll(params = {}) {
    try {
      const config = { params: params };
      const response = await apiAuthenticatedClient.get(API_ENDPOINTS.TASKS.GET_ALL, config);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get all tasks error: ", error);
      return handleAxiosError(error, "Erro ao buscar tarefas");
    }
  },

  /**
   * Busca uma tarefa específica pelo ID.
   * @param {string} id - O ID da tarefa
   */
  async getById(id) {
    try {
      const response = await apiAuthenticatedClient.get(API_ENDPOINTS.TASKS.GET_BY_ID(id));

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get task by id error: ", error);
      if (error.response && error.response.status === 404) {
        return { success: false, error: "Tarefa não encontrada." };
      }
      return handleAxiosError(error, "Erro ao buscar tarefa");
    }
  },

  /**
   * Atualiza uma tarefa existente.
   * @param {string} id - O ID da tarefa a ser atualizada
   * @param {object} payload - O objeto (DTO) com os dados atualizados
   */
  async update(id, payload) {
    try {
      const response = await apiAuthenticatedClient.put(API_ENDPOINTS.TASKS.UPDATE(id), payload);

      return {
        success: true,
        data: response.data || true,
      };
    } catch (error) {
      console.error("Update task error: ", error);
      return handleAxiosError(error, "Erro ao atualizar tarefa");
    }
  },

  async updateStatus(id, payload) {
    try {
      const response = await apiAuthenticatedClient.put(API_ENDPOINTS.TASKS.UPDATE_STATUS(id), payload, 
        {
          headers: { "Content-Type": "application/json" }
        });

      return {
        success: true,
        data: response.data || true,
      };
    } catch (error) {
      console.error("Toggle task status error: ", error);
      return handleAxiosError(error, "Erro ao atualizar status da tarefa");
    }
  },

  /**
   * Exclui uma tarefa pelo ID.
   * @param {string} id - O ID da tarefa a ser excluída
   */
  async delete(id) {
    try {
      const response = await apiAuthenticatedClient.delete(API_ENDPOINTS.TASKS.DELETE(id));
      return {
        success: true,
        data: true,
      };
    } catch (error) {
      console.error("Delete task error: ", error);
      if (error.response && error.response.status === 404) {
        return { success: false, error: "Tarefa não encontrada para excluir." };
      }
      return handleAxiosError(error, "Erro ao excluir tarefa");
    }
  },
};

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
