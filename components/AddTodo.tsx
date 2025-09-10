import { useThemeColor } from "@/hooks/useThemeColor";
import { Todo } from "@/types/Todo";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type TodoPriority = Todo["priority"];

interface AddTodoProps {
  onAddTodo: (todo: Omit<Todo, "id" | "createdAt">) => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function AddTodo({ onAddTodo }: AddTodoProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [category, setCategory] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "icon");

  const expandAnimation = useSharedValue(0);
  const rotateAnimation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      maxHeight: expandAnimation.value,
      opacity: expandAnimation.value / 180,
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateAnimation.value}deg` }],
    };
  });

  const handleToggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);

    expandAnimation.value = withTiming(newExpanded ? 180 : 0, {
      duration: 300,
    });
    rotateAnimation.value = withSpring(newExpanded ? 45 : 0);
  };

  const handleAddTodo = () => {
    if (!text.trim()) {
      Alert.alert("Error", "Please enter a todo item");
      return;
    }

    onAddTodo({
      text: text.trim(),
      completed: false,
      priority,
      category: category.trim() || undefined,
    });

    setText("");
    setCategory("");
    setPriority("medium");
    setIsExpanded(false);
    expandAnimation.value = withTiming(0, { duration: 300 });
    rotateAnimation.value = withSpring(0);
  };

  const priorityOptions: {
    value: TodoPriority;
    label: string;
    color: string;
  }[] = [
    { value: "low", label: "Low", color: "#6BCF7F" },
    { value: "medium", label: "Medium", color: "#FFD93D" },
    { value: "high", label: "High", color: "#FF6B6B" },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.textInput, { color: textColor, borderColor }]}
          placeholder="Add a new todo..."
          placeholderTextColor={iconColor}
          value={text}
          onChangeText={setText}
          multiline
        />

        <TouchableOpacity
          style={[styles.expandButton, { backgroundColor: tintColor }]}
          onPress={handleToggleExpanded}
        >
          <Animated.View style={iconAnimatedStyle}>
            <Ionicons name="add" size={22} color="black" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <AnimatedView style={[styles.expandedContent, animatedStyle]}>
        <View style={styles.prioritySection}>
          <ThemedText style={styles.sectionTitle}>Priority</ThemedText>
          <View style={styles.priorityButtons}>
            {priorityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.priorityButton,
                  { borderColor: option.color },
                  priority === option.value && {
                    backgroundColor: option.color,
                  },
                ]}
                onPress={() => setPriority(option.value)}
              >
                <ThemedText
                  style={[
                    styles.priorityButtonText,
                    priority === option.value && { color: "white" },
                  ]}
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.categorySection}>
          <ThemedText style={styles.sectionTitle}>
            Category (Optional)
          </ThemedText>
          <TextInput
            style={[styles.categoryInput, { color: textColor, borderColor }]}
            placeholder="e.g., Work, Personal, Shopping"
            placeholderTextColor={iconColor}
            value={category}
            onChangeText={setCategory}
          />
        </View>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: tintColor }]}
            onPress={handleAddTodo}
          >
            <Ionicons name="checkmark" size={20} color="black" />
            <ThemedText style={styles.addButtonText}>Add Todo</ThemedText>
          </TouchableOpacity>

      </AnimatedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
    maxHeight: 100,
  },
  expandButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  expandedContent: {
    marginTop: 16,
  },
  prioritySection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.8,
  },
  priorityButtons: {
    flexDirection: "row",
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  priorityButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  categorySection: {
    marginBottom: 12,
  },
  categoryInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
});
