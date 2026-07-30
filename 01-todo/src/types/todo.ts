export type ViewMode = 'list' | 'weekly' | 'monthly' | 'add' | 'edit';

export type TodoItem = {
  id: number;
  type: 'todo';
  emoji: string;
  text: string;
  date: string;
  completed: boolean;
};

export type RoutineItem = {
  id: number;
  type: 'routine';
  emoji: string;
  text: string;
  startDate: string;
  endDate: string;
  completedDates: string[];
  alarmTime: string | null;
};

export type Todo = TodoItem | RoutineItem;

export type TodoFormData = {
  type: Todo['type'];
  emoji: string;
  text: string;
  endDate?: string;
  alarmTime?: string | null;
};

export type DayCompletionStats = {
  total: number;
  completed: number;
  rate: number | null;
};

export type CalendarDay = {
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
};
