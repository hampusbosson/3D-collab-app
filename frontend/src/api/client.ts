import axios from "axios";
import { apiBaseUrl } from "../utils/env";

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response ?? error.message);
    return Promise.reject(error);
  },
);
