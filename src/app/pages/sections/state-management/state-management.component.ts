import { Component, Injectable, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionPageComponent } from '@shared/section-page/section-page.component';
import { ComparisonCardComponent } from '@shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '@shared/code-block/code-block.component';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

/**
 * Angular's "Zustand" — a service with signals as a global store.
 * In React: const useTodoStore = create((set) => ({ todos: [], addTodo: ... }))
 * In Angular: @Injectable({ providedIn: 'root' }) class TodoStore { todos = signal([]) }
 */
@Injectable({ providedIn: 'root' })
export class TodoStore {
  // The entire store state lives in signals
  private readonly _todos = signal<Todo[]>([
    { id: 1, text: 'Learn Angular Signals', done: true },
    { id: 2, text: 'Build a reactive store', done: false },
    { id: 3, text: 'Compare with Zustand', done: false },
  ]);

  // Public derived state (computed = selector in Zustand/Redux)
  readonly todos = this._todos.asReadonly();
  readonly completedCount = computed(() => this._todos().filter((t) => t.done).length);
  readonly totalCount = computed(() => this._todos().length);
  readonly progress = computed(() =>
    this.totalCount() === 0 ? 0 : Math.round((this.completedCount() / this.totalCount()) * 100),
  );

  // Actions (mutations)
  addTodo(text: string): void {
    if (!text.trim()) return;
    this._todos.update((todos) => [...todos, { id: Date.now(), text: text.trim(), done: false }]);
  }

  toggleTodo(id: number): void {
    this._todos.update((todos) => todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  removeTodo(id: number): void {
    this._todos.update((todos) => todos.filter((t) => t.id !== id));
  }

  clearCompleted(): void {
    this._todos.update((todos) => todos.filter((t) => !t.done));
  }
}

@Component({
  selector: 'app-state-management',
  imports: [CommonModule, SectionPageComponent, ComparisonCardComponent, CodeBlockComponent],
  templateUrl: './state-management.component.html',
  styleUrl: '../sections.shared.css',
})
export class StateManagementComponent {
  // Inject the singleton store — same instance shared across all components
  readonly store = inject(TodoStore);
  readonly newTodo = signal('');

  addTodo(): void {
    this.store.addTodo(this.newTodo());
    this.newTodo.set('');
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.addTodo();
  }

  updateInput(event: Event): void {
    this.newTodo.set((event.target as HTMLInputElement).value);
  }

  // ===== CODE SNIPPETS =====
  readonly zustandStore = `// React — Zustand global store
import { create } from 'zustand';

interface Todo { id: number; text: string; done: boolean; }
interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
}

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  addTodo: (text) => set(state => ({
    todos: [...state.todos, { id: Date.now(), text, done: false }]
  })),
  toggleTodo: (id) => set(state => ({
    todos: state.todos.map(t => t.id === id ? {...t, done: !t.done} : t)
  })),
  removeTodo: (id) => set(state => ({
    todos: state.todos.filter(t => t.id !== id)
  })),
}));

// Usage in component:
function TodoList() {
  const { todos, addTodo, toggleTodo } = useTodoStore();
  return ( ... );
}`;

  readonly angularSignalStore = `// Angular — Signal-based store (Service with Signals)
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' }) // <-- Singleton = global!
export class TodoStore {
  // Private writable signal (equivalent to Zustand's state)
  private _todos = signal<Todo[]>([]);

  // Public computed selectors (like Zustand's derived state)
  todos = this._todos.asReadonly();
  completedCount = computed(() => this._todos().filter(t => t.done).length);
  progress = computed(() =>
    Math.round(this.completedCount() / this._todos().length * 100)
  );

  // Actions (equivalents to Zustand's set functions)
  addTodo(text: string) {
    this._todos.update(list => [
      ...list, { id: Date.now(), text, done: false }
    ]);
  }
  toggleTodo(id: number) {
    this._todos.update(list =>
      list.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  }
}

// Usage in component:
@Component({ ... })
export class TodoListComponent {
  store = inject(TodoStore); // Same singleton instance everywhere
}`;

  readonly ngrxStore = `// Angular — NgRx (Redux-pattern for large apps)
// npm install @ngrx/store @ngrx/effects

// 1. Define Actions
const addTodo = createAction('[Todo] Add', props<{ text: string }>());
const toggleTodo = createAction('[Todo] Toggle', props<{ id: number }>());

// 2. Define Reducer
const todoReducer = createReducer(
  initialState,
  on(addTodo, (state, { text }) => ({
    ...state, todos: [...state.todos, { id: Date.now(), text, done: false }]
  })),
  on(toggleTodo, (state, { id }) => ({
    ...state, todos: state.todos.map(t => t.id === id ? {...t, done: !t.done} : t)
  })),
);

// 3. Define Selectors
const selectTodos = createSelector(selectTodoState, s => s.todos);
const selectCompleted = createSelector(selectTodos, todos => todos.filter(t => t.done));

// 4. Use in component
@Component({ ... })
export class TodoComponent {
  store = inject(Store);
  todos$ = this.store.select(selectTodos);
  add(text: string) { this.store.dispatch(addTodo({ text })); }
}`;
}
