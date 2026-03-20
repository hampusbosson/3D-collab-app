import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://localhost:7188/api",
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
