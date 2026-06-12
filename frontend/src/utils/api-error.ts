import axios from "axios";
import type { ApiResponse } from "../types/api";

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message ?? "Nao foi possivel concluir a operacao.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocorreu um erro inesperado.";
};
