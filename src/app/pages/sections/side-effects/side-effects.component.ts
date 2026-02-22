import { Component, signal, effect, OnInit, OnDestroy, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionPageComponent } from '@shared/section-page/section-page.component';
import { ComparisonCardComponent } from '@shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '@shared/code-block/code-block.component';

@Component({
  selector: 'app-side-effects',
  imports: [CommonModule, SectionPageComponent, ComparisonCardComponent, CodeBlockComponent],
  templateUrl: './side-effects.component.html',
  styleUrl: '../sections.shared.css',
})
export class SideEffectsComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  // Live Demo — timer that updates every second
  readonly seconds = signal(0);
  readonly isRunning = signal(false);
  readonly windowWidth = signal(0);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // effect() — runs whenever isRunning() changes (like useEffect with [isRunning] dep)
    effect(() => {
      if (this.isRunning()) {
        this.intervalId = setInterval(() => {
          this.seconds.update((v) => v + 1);
        }, 1000);
      } else {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      }
    });
  }

  ngOnInit(): void {
    // ngOnInit — equivalent to useEffect(() => { ... }, []) — runs once on mount
    if (typeof window !== 'undefined') {
      this.windowWidth.set(window.innerWidth);
      const handler = () => this.windowWidth.set(window.innerWidth);
      window.addEventListener('resize', handler);

      // DestroyRef — cleaner alternative to ngOnDestroy for cleanup
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('resize', handler);
        if (this.intervalId) clearInterval(this.intervalId);
      });
    }
  }

  ngOnDestroy(): void {
    // ngOnDestroy — equivalent to useEffect cleanup return function
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  toggleTimer(): void {
    this.isRunning.update((v) => !v);
  }

  resetTimer(): void {
    this.isRunning.set(false);
    this.seconds.set(0);
  }

  // ===== CODE SNIPPETS =====
  readonly useEffectBasicReact = `// React useEffect — side effects on mount/update
import { useEffect, useState } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Cleanup pattern: return a function
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(id); // Cleanup!
  }, [isRunning]); // Re-runs when isRunning changes

  return <button onClick={() => setIsRunning(r => !r)}>Toggle</button>;
}`;

  readonly effectBasicAngular = `// Angular effect() + lifecycle hooks
import { Component, signal, effect, OnInit, OnDestroy, DestroyRef, inject } from '@angular/core';

@Component({ ... })
export class TimerComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  seconds = signal(0);
  isRunning = signal(false);
  private intervalId: any = null;

  constructor() {
    // effect() auto-tracks isRunning() — no dependency array needed!
    effect(() => {
      if (this.isRunning()) {
        this.intervalId = setInterval(() => {
          this.seconds.update(v => v + 1);
        }, 1000);
      } else {
        clearInterval(this.intervalId);
      }
    });
  }

  // ngOnInit ≈ useEffect(() => {...}, [])
  ngOnInit() {
    console.log('Component mounted');
  }

  // ngOnDestroy ≈ useEffect cleanup return
  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}`;

  readonly useEffectMountReact = `// React — run once on mount (empty deps)
useEffect(() => {
  document.title = 'My App';

  return () => {
    document.title = 'Default'; // cleanup on unmount
  };
}, []); // Empty array = run once

// React — run on every render (no array)
useEffect(() => {
  console.log('Every render');
});

// React — run when deps change
useEffect(() => {
  fetchUser(userId);
}, [userId]);`;

  readonly lifecycleAngular = `// Angular lifecycle hooks map
@Component({ ... })
export class MyComponent implements OnInit, OnDestroy, AfterViewInit {
  // ≈ useEffect(() => {}, []) — runs once after first render
  ngOnInit() {
    console.log('Mounted — fetch initial data here');
  }

  // ≈ useEffect cleanup — runs before destruction
  ngOnDestroy() {
    console.log('About to unmount — cleanup subscriptions');
  }

  // ≈ useLayoutEffect — runs after DOM is rendered
  ngAfterViewInit() {
    console.log('DOM is ready — work with ViewChild here');
  }

  // ≈ useEffect([prop]) — runs when @Input changes
  ngOnChanges(changes: SimpleChanges) {
    console.log('Input changed:', changes);
  }
}`;

  readonly destroyRefAngular = `// Angular DestroyRef — cleaner cleanup (Angular 16+)
// Instead of implementing OnDestroy interface:

@Component({ ... })
export class MyComponent {
  private destroyRef = inject(DestroyRef);

  constructor(private http: HttpClient) {
    // Register cleanup ANYWHERE — no ngOnDestroy needed!
    this.destroyRef.onDestroy(() => {
      console.log('Cleaned up!');
    });
  }
}

// Even cleaner with takeUntilDestroyed operator:
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ ... })
export class MyComponent {
  data$ = this.http.get('/api/data').pipe(
    takeUntilDestroyed() // auto-unsubscribes on destroy
  );
}`;
}
