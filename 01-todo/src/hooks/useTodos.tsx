import { useState } from 'react';
import { getLocalDateString} from '../utils/date';
import type { Todo } from '../types/todo';

const MOCK_TODOS: Todo[] = [
    {
        id: 1,
        type: 'todo',
        emoji: '🏃',
        text: '아침 러닝',
        date: getLocalDateString(),
        completed: false,
    }
];
export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const savedNewList = localStorage.getItem('todo-routine-list');
        if (savedNewList) {
            return JSON.parse(savedNewList) as Todo[];
        }

        const savedOldList = localStorage.getItem('todo-list');
        if (savedOldList) {
            const parsed = JSON.parse(savedOldList) as Array<Partial<Todo> & { id: number; text?: string; completed?: boolean }>;
            const todayStr = getLocalDateString();
            return parsed.map(t => ({
                id: t.id,
                type: 'todo',
                emoji: t.emoji || '📝',
                text: t.text || '',
                date: todayStr,
                completed: Boolean(t.completed)
            }));
        }
        return MOCK_TODOS;
    });
    return { todos, setTodos };
}
