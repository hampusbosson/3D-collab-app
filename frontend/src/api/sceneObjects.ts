import {
  CreateSceneObjectDto,
  SceneObjectDto,
  UpdateSceneObjectDto,
} from "../types/scenes";
import { apiClient } from "./client";

export async function addObjectToScene(
  sceneId: string,
  object: CreateSceneObjectDto,
) {
  const response = await apiClient.post<SceneObjectDto>(
    `/scenes/${sceneId}/objects`,
    object,
  );
  return response.data;
}

export async function deleteSceneObject(sceneId: string, objectId: string) {
  await apiClient.delete(`/scenes/${sceneId}/objects/${objectId}`);
}

export async function updateSceneObject(
  sceneId: string,
  objectId: string,
  data: UpdateSceneObjectDto,
): Promise<SceneObjectDto> {
  const response = await apiClient.put<SceneObjectDto>(
    `/scenes/${sceneId}/objects/${objectId}`,
    data,
  );

  return response.data;
}
