import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';
import { STORAGE_KEYS } from '../constants/storageKeys';

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.TASKS,
      JSON.stringify(tasks)
    );
  } catch (error) {
    console.error('Error guardando tareas', error);
  }
}

export async function loadTasks(): Promise<Task[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error cargando tareas', error);
    return [];
  }
}
