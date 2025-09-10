export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
}

export interface TodoCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoSort = 'created' | 'priority' | 'alphabetical';
