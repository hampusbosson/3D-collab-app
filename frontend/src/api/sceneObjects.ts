import { CreateSceneObjectDto, SceneObjectDto } from "../types/scenes";
import { apiClient } from "./client";

export async function addObjectToScene(sceneId: string, object: CreateSceneObjectDto) {
    const response = await apiClient.post<SceneObjectDto>(`/scenes/${sceneId}/objects`, object);
    return response.data;
}