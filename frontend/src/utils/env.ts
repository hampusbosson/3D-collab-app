type RequiredEnvName = "VITE_API_BASE_URL" | "VITE_SIGNALR_HUB_URL";

function getEnvValue(name: RequiredEnvName) {
  if (name === "VITE_API_BASE_URL") {
    return import.meta.env.VITE_API_BASE_URL;
  }

  return import.meta.env.VITE_SIGNALR_HUB_URL;
}

function getRequiredEnv(name: RequiredEnvName) {
  const value = getEnvValue(name);

  if (value) {
    return value;
  }

  if (import.meta.env.DEV) {
    if (name === "VITE_API_BASE_URL") {
      return "https://localhost:7188/api";
    }

    return "https://localhost:7188/hubs/scene";
  }

  throw new Error(`Missing required environment variable: ${name}`);
}

export const apiBaseUrl = getRequiredEnv("VITE_API_BASE_URL");
export const signalRHubUrl = getRequiredEnv("VITE_SIGNALR_HUB_URL");
