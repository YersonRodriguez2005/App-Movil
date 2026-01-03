import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useRef, useState, useEffect } from "react";
import { theme } from "../styles/theme";

type Props = {
  onAddTask: (title: string) => void;
};

export default function TaskInput({ onAddTask }: Props) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(10)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animación al montar
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animación al focus
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.02 : 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  const handleAdd = () => {
    if (!text.trim()) return;

    onAddTask(text.trim());
    setText("");

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: translateAnim },
            { scale: scaleAnim },
          ],
          borderColor: focused
            ? theme.colors.primary
            : theme.colors.border,
        },
      ]}
    >
      <TextInput
        placeholder="Nueva tarea..."
        placeholderTextColor={theme.colors.textSecondary}
        value={text}
        onChangeText={setText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.input}
        returnKeyType="done"
        onSubmitEditing={handleAdd}
      />

      <Pressable onPress={handleAdd} style={styles.button}>
        <Text style={styles.buttonText}>＋</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  input: {
    flex: 1,
    height: 48,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  button: {
    marginLeft: theme.spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
