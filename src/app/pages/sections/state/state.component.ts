import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionPageComponent } from '../../../shared/section-page/section-page.component';
import { ComparisonCardComponent } from '../../../shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

@Component({
  selector: 'app-state',
  imports: [CommonModule, SectionPageComponent, ComparisonCardComponent, CodeBlockComponent],
  templateUrl: './state.component.html',
})
export class StateComponent {
  // ===== SIGNAL DEMO =====
  // Angular's equivalent of React's useState
  readonly count = signal(0);
  readonly name = signal('Angular');

  // Angular computed() — equivalent to React's useMemo
  readonly doubleCount = computed(() => this.count() * 2);
  readonly greeting = computed(() => `Hello from ${this.name()}! Count x2 = ${this.doubleCount()}`);

  // Derived signal
  readonly isEven = computed(() => this.count() % 2 === 0);

  increment(): void {
    // signal.update() — equivalent to setState(prev => prev + 1)
    this.count.update((v) => v + 1);
  }

  decrement(): void {
    this.count.update((v) => v - 1);
  }

  reset(): void {
    // signal.set() — equivalent to setState(0)
    this.count.set(0);
  }

  // ===== CODE SNIPPETS =====
  readonly basicStateReact = `// React useState
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('React');

  const doubleCount = count * 2; // Recalculated every render

  return (
    <div>
      <p>Count: {count}</p>
      <p>Double: {doubleCount}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`;

  readonly basicStateAngular = `// Angular Signals (v16+)
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubleCount() }}</p>
    <button (click)="increment()">+</button>
    <button (click)="decrement()">-</button>
    <button (click)="reset()">Reset</button>
  \`
})
export class CounterComponent {
  // signal() — fine-grained reactive primitive (no VDOM needed)
  count = signal(0);
  name = signal('Angular');

  // computed() is lazily evaluated and cached
  doubleCount = computed(() => this.count() * 2);

  increment() { this.count.update(v => v + 1); }
  decrement() { this.count.update(v => v - 1); }
  reset()     { this.count.set(0); }
}`;

  readonly useMemoReact = `// React useMemo — memoize expensive calculations
import { useState, useMemo } from 'react';

function PrimeList({ max }: { max: number }) {
  const [filter, setFilter] = useState('');

  // Only recomputes when 'max' changes
  const primes = useMemo(() => {
    return Array.from({ length: max }, (_, i) => i + 2)
      .filter(n => isPrime(n));
  }, [max]);

  return <ul>{primes.map(p => <li key={p}>{p}</li>)}</ul>;
}`;

  readonly computedAngular = `// Angular computed() — automatically memoized signal
import { Component, signal, computed } from '@angular/core';

@Component({ ... })
export class PrimeListComponent {
  max = signal(100);

  // Recomputes only when max() changes — similar to useMemo
  primes = computed(() =>
    Array.from({ length: this.max() }, (_, i) => i + 2)
      .filter(n => this.isPrime(n))
  );

  private isPrime(n: number): boolean {
    for (let i = 2; i <= Math.sqrt(n); i++)
      if (n % i === 0) return false;
    return true;
  }
}`;

  readonly useReducerReact = `// React useReducer — complex state transitions
type Action = { type: 'increment' } | { type: 'reset' } | { type: 'set', value: number };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'reset':     return 0;
    case 'set':       return action.value;
  }
}

function Counter() {
  const [count, dispatch] = useReducer(reducer, 0);
  return <button onClick={() => dispatch({ type: 'increment' })}>+</button>;
}`;

  readonly signalUpdateAngular = `// Angular Signals — equivalent update patterns
@Component({ ... })
export class CounterComponent {
  count = signal(0);

  // Equivalent to dispatch({ type: 'increment' })
  increment() { this.count.update(v => v + 1); }

  // Equivalent to dispatch({ type: 'set', value: 42 })
  setTo42()   { this.count.set(42); }

  // Equivalent to dispatch({ type: 'reset' })
  reset()     { this.count.set(0); }

  // For complex state, use a signal with an object
  state = signal({ count: 0, name: 'default' });

  updateCount(n: number) {
    this.state.update(s => ({ ...s, count: n }));
  }
}`;

  readonly linkedSignalAngular = `// Angular linkedSignal() — derives writable signal from source
import { signal, linkedSignal } from '@angular/core';

@Component({ ... })
export class ShoppingCartComponent {
  items = signal<string[]>([]);

  // linkedSignal auto-resets when 'items' changes
  selectedItem = linkedSignal(() => this.items()[0] ?? null);

  addItem(item: string) {
    this.items.update(list => [...list, item]);
    // selectedItem automatically updates!
  }
}`;
}
