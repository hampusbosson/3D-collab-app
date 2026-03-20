import { apiClient } from "./client";
import type { SceneDto, CreateSceneDto } from "../types/scenes";

export async function getScenes(): Promise<SceneDto[]> {
  const response = await apiClient.get<SceneDto[]>("/scenes");
  return response.data;
}

export async function getSceneById(id: string): Promise<SceneDto> {
  const response = await apiClient.get<SceneDto>(`/scenes/${id}`);
  return response.data;
}

export async function createScene(data: CreateSceneDto): Promise<SceneDto> {
  const response = await apiClient.post<SceneDto>("/scenes", data);
  return response.data;
}