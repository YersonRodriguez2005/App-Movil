import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  Easing,
} from "react-native";
import { useState, useEffect, useRef } from "react";

import TaskItem from "../components/TaskItem";
import TaskInput from "../components/TaskInput";
import { Task } from "../types/task";
import { saveTasks, loadTasks } from "../services/taskStorage";
import { theme } from "../styles/theme";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;

  // Animación al montar pantalla
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateAnim]);

  // Cargar tareas
  useEffect(() => {
    const init = async () => {
      const stored = await loadTasks();
      if (stored.length > 0) setTasks(stored);
    };
    init();
  }, []);

  // Persistencia
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // CRUD
  const addTask = (title: string) => {
    setTasks((prev) => [
      {
        id: Date.now().toString(),
        title,
        completed: false,
      },
      ...prev, // nueva tarea arriba (mejor UX)
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTask = (id: string, newTitle: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title: newTitle } : task))
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis tareas</Text>
        <Text style={styles.subtitle}>
          {tasks.filter((t) => t.completed).length} / {tasks.length} completadas
        </Text>
      </View>

      {/* Input */}
      <TaskInput onAddTask={addTask} />

      {/* Lista */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            title={item.title}
            completed={item.completed}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
            onEdit={(newTitle: string) => updateTask(item.id, newTitle)}
          />
        )}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  list: {
    paddingBottom: theme.spacing.xl,
  },
});
