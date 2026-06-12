import axios from "axios";
import { getStoredAuthSession } from "../utils/auth-storage";

const localApiUrl = "http://localhost:3333/api";

function getApiBaseUrl() {
  const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredApiUrl) {
    return configuredApiUrl.replace(/\/+$/, "");
  }

  if (import.meta.env.DEV) {
    return localApiUrl;
  }

  throw new Error("VITE_API_URL precisa ser configurada para o ambiente de producao.");
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const session = getStoredAuthSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return Promise.reject(error);
  },
);
