import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Animated,
  Easing,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { theme } from "../styles/theme";

type Props = {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (newTitle: string) => void;
};

export default function TaskItem({
  title,
  completed,
  onToggle,
  onDelete,
  onEdit,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(title);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(completed ? 1 : 0)).current;

  // Animación de entrada
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Animación checkbox
  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: completed ? 1 : 0,
      friction: 6,
      useNativeDriver: false,
    }).start();
  }, [completed, checkAnim]);

  const handleEditSave = () => {
    if (!text.trim()) return;
    onEdit(text.trim());
    setEditing(false);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Checkbox */}
      <Pressable onPress={onToggle}>
        <Animated.View
          style={[
            styles.checkbox,
            {
              backgroundColor: checkAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["transparent", theme.colors.primary],
              }),
              borderColor: completed
                ? theme.colors.primary
                : theme.colors.border,
            },
          ]}
        >
          {completed && <Text style={styles.check}>✓</Text>}
        </Animated.View>
      </Pressable>

      {/* Texto / Input */}
      <View style={styles.textContainer}>
        {editing ? (
          <TextInput
            value={text}
            onChangeText={setText}
            autoFocus
            onBlur={handleEditSave}
            onSubmitEditing={handleEditSave}
            style={styles.input}
          />
        ) : (
          <Text
            style={[
              styles.text,
              completed && styles.textCompleted,
            ]}
          >
            {title}
          </Text>
        )}
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        {!editing && (
          <Pressable
            onPress={() => setEditing(true)}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>✎</Text>
          </Pressable>
        )}

        <Pressable
          onPress={onDelete}
          style={styles.actionButton}
        >
          <Text style={[styles.actionText, { color: "#ff5c5c" }]}>
            ✕
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  check: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  textCompleted: {
    textDecorationLine: "line-through",
    color: theme.colors.textSecondary,
  },
  input: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    borderBottomWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: 2,
  },
  actions: {
    flexDirection: "row",
    marginLeft: theme.spacing.sm,
  },
  actionButton: {
    marginLeft: theme.spacing.sm,
  },
  actionText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
});
