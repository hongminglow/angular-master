import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
  Pipe,
  PipeTransform,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionPageComponent } from '../../../shared/section-page/section-page.component';
import { ComparisonCardComponent } from '../../../shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

// ===== Pure Pipe — Angular equivalent of useMemo for template transforms =====
@Pipe({ name: 'filterPrimes', pure: true, standalone: true })
export class FilterPrimesPipe implements PipeTransform {
  private isPrime(n: number): boolean {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
    return true;
  }

  // pure: true = only recalculates when REFERENCE changes (like useMemo)
  transform(numbers: number[], onlyPrimes: boolean): number[] {
    return onlyPrimes ? numbers.filter((n) => this.isPrime(n)) : numbers;
  }
}

@Component({
  selector: 'app-performance',
  imports: [
    CommonModule,
    SectionPageComponent,
    ComparisonCardComponent,
    CodeBlockComponent,
    FilterPrimesPipe,
  ],
  templateUrl: './performance.component.html',
  styleUrl: '../sections.shared.css',
  // OnPush = only update when inputs change, signals change, or events fire
  // This is like wrapping a React component in React.memo
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceComponent implements OnInit {
  readonly renderCount = signal(0);
  readonly onlyPrimes = signal(false);
  readonly maxNumber = signal(50);

  // computed() is cached — equivalent to useMemo
  readonly numbers = computed(() => Array.from({ length: this.maxNumber() }, (_, i) => i + 1));

  ngOnInit(): void {
    this.renderCount.update((v) => v + 1);
  }

  togglePrimes(): void {
    this.onlyPrimes.update((v) => !v);
  }

  increaseMax(): void {
    this.maxNumber.update((v) => Math.min(v + 10, 200));
  }

  track(index: number, item: number): number {
    return item; // trackBy = React's key prop in @for loops
  }

  // ===== CODE SNIPPETS =====
  readonly useMemoReact = `// React — useMemo for expensive calculations
import { useState, useMemo, useCallback } from 'react';

function PrimeFilter({ max }: { max: number }) {
  const [showPrimes, setShowPrimes] = useState(false);

  // useMemo — only recomputes when 'max' changes
  const numbers = useMemo(() =>
    Array.from({ length: max }, (_, i) => i + 1),
    [max] // dependency array
  );

  // useCallback — stable function reference (prevents child rerenders)
  const toggle = useCallback(() => {
    setShowPrimes(p => !p);
  }, []); // empty deps = never recreated

  const visible = showPrimes ? numbers.filter(isPrime) : numbers;

  return <div>{visible.map(n => <span key={n}>{n}</span>)}</div>;
}

// React.memo — prevents rerender when props haven't changed
const ItemComponent = React.memo(({ value }: { value: number }) => (
  <div>{value}</div>
));`;

  readonly computedPipeAngular = `// Angular — computed() + Pure Pipes (no useCallback needed)
import { Component, signal, computed, ChangeDetectionStrategy, Pipe } from '@angular/core';

// Pure Pipe — memoized transform (Angular's useMemo for templates)
@Pipe({ name: 'filterPrimes', pure: true, standalone: true })
export class FilterPrimesPipe implements PipeTransform {
  transform(numbers: number[], onlyPrimes: boolean): number[] {
    return onlyPrimes ? numbers.filter(n => isPrime(n)) : numbers;
  }
  // pure: true (default) means: only recalculate when INPUT REFERENCE changes
  // pure: false = recalculates every change detection cycle (expensive!)
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush, // Like React.memo on the whole component
  template: \`
    @for (n of numbers() | filterPrimes:onlyPrimes(); track n) {
      <span>{{ n }}</span>
    }
    <!-- trackBy ≈ key prop in React -->
  \`,
})
export class PrimeFilterComponent {
  numbers = computed(() => Array.from({ length: this.max() }, (_, i) => i + 1));
  max = signal(50);
  onlyPrimes = signal(false);
  // No useCallback needed — methods on class have stable references!
}`;

  readonly onPushStrategy = `// Angular — ChangeDetectionStrategy.OnPush
// Without OnPush (Default): component re-checks every time ANYTHING changes in the app

// With OnPush — component only re-renders when:
// 1. ✅ Input reference changes (@Input() changes)
// 2. ✅ A Signal it reads changes
// 3. ✅ An Observable it's using emits (via AsyncPipe)
// 4. ✅ An event fires inside the component (click, keydown)
// 5. ✅ Explicit markForCheck() or detectChanges()

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`...Renders efficiently...\`
})
export class EfficientComponent {
  // All signals automatically trigger updates when they change
  count = signal(0);
  derived = computed(() => this.count() * 2);
}

// React equivalent:
const EfficientComponent = React.memo(({ count }) => {
  const derived = useMemo(() => count * 2, [count]);
  return <div>{derived}</div>;
}, (prevProps, nextProps) => prevProps.count === nextProps.count);`;

  readonly trackByAngular = `// Angular — trackBy in @for (≈ React's 'key' prop)
@Component({
  template: \`
    <!-- ✅ With trackBy — Angular knows which items changed (like React key) -->
    @for (item of items(); track item.id) {
      <app-item [data]="item" />
    }

    <!-- ❌ Without track — Angular re-renders ALL items on any change -->
    @for (item of items(); track $index) {
      <app-item [data]="item" />
    }
  \`
})
export class ItemListComponent {
  items = signal<Item[]>([]);
}

// React equivalent:
// items.map(item => <Item key={item.id} data={item} />)

// Rule: Always use track item.id (not $index) for mutable lists`;
}
