import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Todo } from '@/types/Todo';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFD93D';
      case 'low': return '#6BCF7F';
      default: return iconColor;
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value }
      ],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleDelete = () => {
    translateX.value = withTiming(-300, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(onDelete)(todo.id);
    });
  };

  const handleToggle = () => {
    onToggle(todo.id);
  };

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <ThemedView style={[styles.todoItem, { backgroundColor }]}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            todo.completed && { backgroundColor: tintColor }
          ]}
          onPress={handleToggle}
        >
          {todo.completed && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </TouchableOpacity>

        <View style={styles.content}>
          <ThemedText
            style={[
              styles.text,
              todo.completed && styles.completedText
            ]}
          >
            {todo.text}
          </ThemedText>
          
          <View style={styles.meta}>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(todo.priority) }]} />
            <ThemedText style={styles.priorityText}>
              {todo.priority}
            </ThemedText>
            {todo.category && (
              <>
                <Ionicons name="folder-outline" size={12} color={iconColor} />
                <ThemedText style={styles.categoryText}>
                  {todo.category}
                </ThemedText>
              </>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(todo.id, todo.text)}
          >
            <Ionicons name="pencil-outline" size={18} color={iconColor} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </ThemedView>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    textTransform: 'capitalize',
    opacity: 0.7,
  },
  categoryText: {
    fontSize: 12,
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
});
