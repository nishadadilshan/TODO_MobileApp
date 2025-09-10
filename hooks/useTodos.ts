import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { Todo, TodoFilter, TodoSort } from '@/types/Todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sort, setSort] = useState<TodoSort>('created');

  const addTodo = useCallback((newTodo: Omit<Todo, 'id' | 'createdAt'>) => {
    const todo: Todo = {
      ...newTodo,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    
    setTodos(prevTodos => [todo, ...prevTodos]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  const editTodo = useCallback((id: string, newText: string) => {
    if (!newText.trim()) {
      Alert.alert('Error', 'Todo text cannot be empty');
      return;
    }

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    Alert.alert(
      'Clear Completed',
      'Are you sure you want to delete all completed todos?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setTodos(prevTodos => prevTodos.filter(todo => !todo.completed))
        }
      ]
    );
  }, []);

  const getStats = useCallback(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    
    return { total, completed, active };
  }, [todos]);

  return {
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
    getStats,
  };
}
