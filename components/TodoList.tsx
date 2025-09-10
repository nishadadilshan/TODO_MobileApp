import React from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TodoItem } from './TodoItem';
import { Todo, TodoFilter, TodoSort } from '@/types/Todo';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TodoListProps {
  todos: Todo[];
  filter: TodoFilter;
  sort: TodoSort;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, text: string) => void;
}

export function TodoList({ 
  todos, 
  filter, 
  sort, 
  onToggleTodo, 
  onDeleteTodo, 
  onEditTodo 
}: TodoListProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const getFilteredTodos = () => {
    let filtered = todos;

    // Apply filter
    switch (filter) {
      case 'active':
        filtered = todos.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = todos.filter(todo => todo.completed);
        break;
      default:
        filtered = todos;
    }

    // Apply sort
    switch (sort) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered = [...filtered].sort((a, b) => 
          priorityOrder[b.priority] - priorityOrder[a.priority]
        );
        break;
      case 'alphabetical':
        filtered = [...filtered].sort((a, b) => 
          a.text.toLowerCase().localeCompare(b.text.toLowerCase())
        );
        break;
      case 'created':
      default:
        filtered = [...filtered].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return filtered;
  };

  const filteredTodos = getFilteredTodos();

  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    
    return { total, completed, active };
  };

  const stats = getStats();

  const renderTodoItem = ({ item, index }: { item: Todo; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      exiting={FadeOutUp}
    >
      <TodoItem
        todo={item}
        onToggle={onToggleTodo}
        onDelete={onDeleteTodo}
        onEdit={onEditTodo}
      />
    </Animated.View>
  );

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeInDown.delay(200)}
      style={styles.emptyState}
    >
      <Ionicons 
        name={filter === 'completed' ? 'checkmark-circle-outline' : 'list-outline'} 
        size={64} 
        color={iconColor} 
        style={styles.emptyIcon}
      />
      <ThemedText style={styles.emptyTitle}>
        {filter === 'completed' 
          ? 'No completed todos' 
          : filter === 'active' 
          ? 'No active todos' 
          : 'No todos yet'
        }
      </ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        {filter === 'completed' 
          ? 'Complete some todos to see them here' 
          : filter === 'active' 
          ? 'All todos are completed!' 
          : 'Add your first todo to get started'
        }
      </ThemedText>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Stats Header */}
      <Animated.View 
        entering={FadeInDown.delay(100)}
        style={[styles.statsContainer, { backgroundColor }]}
      >
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>{stats.total}</ThemedText>
          <ThemedText style={styles.statLabel}>Total</ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <ThemedText style={[styles.statNumber, { color: '#6BCF7F' }]}>
            {stats.active}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Active</ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <ThemedText style={[styles.statNumber, { color: '#FF6B6B' }]}>
            {stats.completed}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Done</ThemedText>
        </View>
      </Animated.View>

      {/* Todo List */}
      <FlatList
        data={filteredTodos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          filteredTodos.length === 0 && styles.emptyListContainer
        ]}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    opacity: 0.5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
  },
  separator: {
    height: 8,
  },
});
