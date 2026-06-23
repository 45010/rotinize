//import axios from "axios";
import apiAuthenticatedClient from "./apiAuthenticatedClient";
import { API_ENDPOINTS } from "../constants/api";

export const habitsService = {
  /**
   * Cria um novo hábito.
   * @param {object} payload - O objeto (DTO) com os dados do hábito a criar
   */
  async create(payload) {
    try {
      const response = await apiAuthenticatedClient.post(API_ENDPOINTS.HABITS.CREATE, payload);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Create habit error: ", error);
      return handleAxiosError(error, "Erro ao criar hábito");
    }
  },

  /**
   * Busca todos os hábitos, com filtros opcionais.
   * @param {object} params - Objeto com os filtros. Ex: { isActive: true, category: 1 }
   */
  async getAll(params = {}) {
    try {
      const config = { params: params };
      const response = await apiAuthenticatedClient.get(API_ENDPOINTS.HABITS.GET_ALL, config);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get all habits error: ", error);
      return handleAxiosError(error, "Erro ao buscar hábitos");
    }
  },

  /**
   * Busca um hábito específico pelo ID.
   * @param {string} id - O ID do hábito
   */
  async getById(id) {
    try {
      const response = await apiAuthenticatedClient.get(API_ENDPOINTS.HABITS.GET_BY_ID(id));

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get habit by id error: ", error);
      if (error.response && error.response.status === 404) {
        return { success: false, error: "Hábito não encontrado." };
      }
      return handleAxiosError(error, "Erro ao buscar hábito");
    }
  },

  /**
   * Atualiza um hábito existente.
   * @param {string} id - O ID do hábito a ser atualizado
   * @param {object} payload - O objeto (DTO) com os dados atualizados
   */
  async update(id, payload) {
    try {
      const response = await apiAuthenticatedClient.put(
        API_ENDPOINTS.HABITS.UPDATE(id),
        payload
      );

      return {
        success: true,
        data: response.data || true,
      };
    } catch (error) {
      console.error("Update habit error: ", error);
      return handleAxiosError(error, "Erro ao atualizar hábito");
    }
  },

  /**
   * Para o acompanhamento de um hábito existente.
   * @param {string} id - O ID do hábito a ser pausado
   */
  async stop(id) {
    try {
      const response = await apiAuthenticatedClient.put(API_ENDPOINTS.HABITS.STOP(id));

      return {
        success: true,
        data: response.data || true,
      };
    } catch (error) {
      console.error("Stop habit error: ", error);
      return handleAxiosError(error, "Erro ao pausar hábito");
    }
  },

    async updateActive(id, payload) {
    try {
      const response = await apiAuthenticatedClient.put(API_ENDPOINTS.HABITS.UPDATE_ACTIVE(id), payload, 
        {
          headers: { "Content-Type": "application/json" }
        });

      return {
        success: true,
        data: response.data || true,
      };
    } catch (error) {
      console.error("Toggle active habit error: ", error);
      return handleAxiosError(error, "Erro ao alternar ativo do hábito");
    }
  },

  /**
   * Exclui um hábito pelo ID.
   * @param {string} id - O ID do hábito a ser excluído
   */
  async delete(id) {
    try {
      const response = await apiAuthenticatedClient.delete(API_ENDPOINTS.HABITS.DELETE(id));

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      console.error("Delete habit error: ", error);
      if (error.response && error.response.status === 404) {
        return { success: false, error: "Hábito não encontrado para excluir." };
      }
      return handleAxiosError(error, "Erro ao excluir hábito");
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
