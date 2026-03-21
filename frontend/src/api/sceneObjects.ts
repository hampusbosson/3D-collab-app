import { CreateSceneObjectDto, SceneObjectDto } from "../types/scenes";
import { apiClient } from "./client";

export async function addObjectToScene(sceneId: string, object: CreateSceneObjectDto) {
    const response = await apiClient.post<SceneObjectDto>(`/scenes/${sceneId}/objects`, object);
    return response.data;
}

export async function deleteSceneObject(sceneId: string, objectId: string) {
    await apiClient.delete(`/scenes/${sceneId}/objects/${objectId}`);
}