import apiAuthenticatedClient from "./apiAuthenticatedClient";
import { API_ENDPOINTS } from "../constants/api";

export const dashboardService = {

  async getToday() {
    try {
      const response = await apiAuthenticatedClient.get(API_ENDPOINTS.DASHBOARD.TODAY);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get today dashboard error: ", error);
      return handleAxiosError(error, "Erro ao buscar dashboard de hoje");
    }
  },
}

function handleAxiosError(error, defaultErrorMessage) {
  if (error.response) {
    const errorData = error.response.data;
    return {
      success: false,
      error:
        typeof errorData === "string"
          ? errorData
          : errorData.title || errorData.message || defaultErrorMessage,
    };
  } else if (error.request) {
    return {
      success: false,
      error: "Erro de conexão com o servidor.",
    };
  } else {
    return {
      success: false,
      error: "Erro ao preparar a requisição.",
    };
  }
}
