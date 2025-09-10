import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert, TextInput, Modal, View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AddTodo } from '@/components/AddTodo';
import { TodoList } from '@/components/TodoList';
import { TodoFilters } from '@/components/TodoFilters';
import { useTodos } from '@/hooks/useTodos';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TodosScreen() {
  const [editingTodo, setEditingTodo] = useState<{ id: string; text: string } | null>(null);
  const [editText, setEditText] = useState('');
  
  const {
    todos,
    filter,
    sort,
    setFilter,
    setSort,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    getStats
  } = useTodos();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  const stats = getStats();

  const handleEditTodo = (id: string, text: string) => {
    setEditingTodo({ id, text });
    setEditText(text);
  };

  const handleSaveEdit = () => {
    if (editingTodo && editText.trim()) {
      editTodo(editingTodo.id, editText.trim());
      setEditingTodo(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setEditText('');
  };

  const handleClearCompleted = () => {
    if (stats.completed > 0) {
      clearCompleted();
    } else {
      Alert.alert('No completed todos', 'There are no completed todos to clear.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style="auto" />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100)}
          style={styles.header}
        >
          <Text style={styles.title}>My Todos</Text>
          <ThemedText style={styles.subtitle}>
            {stats.total === 0 
              ? 'Start adding your tasks' 
              : `${stats.active} active, ${stats.completed} completed`
            }
          </ThemedText>
        </Animated.View>

        {/* Add Todo Component */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.addTodoContainer}>
          <AddTodo onAddTodo={addTodo} />
        </Animated.View>

        {/* Filters */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.filtersContainer}>
          <TodoFilters
            filter={filter}
            sort={sort}
            onFilterChange={setFilter}
            onSortChange={setSort}
          />
        </Animated.View>

        {/* Action Buttons */}
        {stats.completed > 0 && (
          <Animated.View 
            entering={FadeInUp.delay(400)}
            style={styles.actionButtons}
          >
            <TouchableOpacity
              style={[styles.clearButton, { borderColor: '#FF6B6B' }]}
              onPress={handleClearCompleted}
            >
              <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
              <ThemedText style={[styles.clearButtonText, { color: '#FF6B6B' }]}>
                Clear Completed ({stats.completed})
              </ThemedText>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Todo List */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.todoListContainer}>
          <TodoList
            todos={todos}
            filter={filter}
            sort={sort}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            onEditTodo={handleEditTodo}
          />
        </Animated.View>
        </View>
      </TouchableWithoutFeedback>

      {/* Edit Modal */}
      <Modal
        visible={!!editingTodo}
        transparent
        animationType="fade"
        onRequestClose={handleCancelEdit}
      >
        <Animated.View style={styles.modalOverlay}>
          <Animated.View 
            style={[styles.modalContent, { backgroundColor }]}
            entering={FadeInUp}
          >
            <ThemedText style={styles.modalTitle}>Edit Todo</ThemedText>
            
            <TextInput
              style={[styles.modalInput, { color: textColor, borderColor: iconColor }]}
              value={editText}
              onChangeText={setEditText}
              placeholder="Enter todo text..."
              placeholderTextColor={iconColor}
              multiline
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: tintColor }]}
                onPress={handleSaveEdit}
              >
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  addTodoContainer: {
    marginBottom: 16,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  actionButtons: {
    marginBottom: 20,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  todoListContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    // backgroundColor set dynamically
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});