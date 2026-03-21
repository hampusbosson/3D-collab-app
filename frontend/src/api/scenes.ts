import { apiClient } from "./client";
import type {
  SceneDto,
  CreateSceneDto,
  SceneDetailsDto,
  UpdateSceneDto,
} from "../types/scenes";

export async function getScenes(): Promise<SceneDto[]> {
  const response = await apiClient.get<SceneDto[]>("/scenes");
  return response.data;
}

export async function getSceneById(id: string): Promise<SceneDetailsDto> {
  const response = await apiClient.get<SceneDetailsDto>(`/scenes/${id}`);
  return response.data;
}

export async function createScene(data: CreateSceneDto): Promise<SceneDto> {
  const response = await apiClient.post<SceneDto>("/scenes", data);
  return response.data;
}

export async function deleteScene(id: string): Promise<void> {
  await apiClient.delete(`/scenes/${id}`);
}

export async function updateScene(sceneId: string, data: UpdateSceneDto) {
  const response = await apiClient.put<SceneDto>(`/scenes/${sceneId}`, data);
  return response.data;
}
