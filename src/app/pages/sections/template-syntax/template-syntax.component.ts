import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionPageComponent } from '@shared/section-page/section-page.component';
import { ComparisonCardComponent } from '@shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '@shared/code-block/code-block.component';

interface DemoItem {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'pending';
}

@Component({
  selector: 'app-template-syntax',
  imports: [CommonModule, SectionPageComponent, ComparisonCardComponent, CodeBlockComponent],
  templateUrl: './template-syntax.component.html',
  styleUrl: '../sections.shared.css',
})
export class TemplateSyntaxComponent {
  // Live demo state
  readonly showContent = signal(true);
  readonly currentTab = signal<'profile' | 'settings' | 'billing'>('profile');
  readonly items = signal<DemoItem[]>([
    { id: 1, name: 'Angular Signals', status: 'active' },
    { id: 2, name: 'RxJS Observables', status: 'active' },
    { id: 3, name: 'Zone.js (legacy)', status: 'inactive' },
    { id: 4, name: 'Standalone APIs', status: 'pending' },
  ]);

  toggleContent(): void {
    this.showContent.update((v) => !v);
  }

  setTab(tab: 'profile' | 'settings' | 'billing'): void {
    this.currentTab.set(tab);
  }

  addItem(): void {
    const id = this.items().length + 1;
    this.items.update((list) => [
      ...list,
      { id, name: `New Item ${id}`, status: 'pending' as const },
    ]);
  }

  removeItem(id: number): void {
    this.items.update((list) => list.filter((item) => item.id !== id));
  }

  // ===== CODE SNIPPETS =====
  readonly reactConditional = `// React — conditional rendering with JSX
function Dashboard({ user, isAdmin, status }) {
  return (
    <div>
      {/* Ternary for if/else */}
      {user ? <Welcome name={user.name} /> : <Login />}

      {/* && for conditional */}
      {isAdmin && <AdminPanel />}

      {/* No built-in switch — manual pattern */}
      {status === 'loading' && <Spinner />}
      {status === 'error' && <Error />}
      {status === 'success' && <Content />}
    </div>
  );
}`;

  readonly angularConditional = `// Angular — built-in control flow (Angular 17+)
@Component({
  template: \`
    <!-- @if / @else — cleaner than JSX ternary -->
    @if (user()) {
      <app-welcome [name]="user()!.name" />
    } @else {
      <app-login />
    }

    <!-- @if with condition -->
    @if (isAdmin()) {
      <app-admin-panel />
    }

    <!-- @switch — native switch/case (no JSX equivalent!) -->
    @switch (status()) {
      @case ('loading') { <app-spinner /> }
      @case ('error')   { <app-error /> }
      @case ('success') { <app-content /> }
      @default          { <p>Unknown status</p> }
    }
  \`
})
export class DashboardComponent {
  user = signal<User | null>(null);
  isAdmin = signal(false);
  status = signal<'loading' | 'error' | 'success'>('loading');
}`;

  readonly reactLists = `// React — rendering lists with .map() + key
function TodoList({ items }) {
  if (items.length === 0) {
    return <p>No items yet</p>;
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <span>{item.name}</span>
          <span>({item.status})</span>
        </li>
      ))}
    </ul>
  );
}

// Index access:
{items.map((item, index) => (
  <li key={item.id}>#{index + 1}: {item.name}</li>
))}`;

  readonly angularLists = `// Angular — @for with track + built-in variables
@Component({
  template: \`
    <!-- @for loop with required track expression -->
    @for (item of items(); track item.id) {
      <li>
        <span>{{ item.name }}</span>
        <span>({{ item.status }})</span>
      </li>
    } @empty {
      <!-- Built-in empty state! No React equivalent -->
      <p>No items yet</p>
    }

    <!-- Built-in loop variables (like React index): -->
    @for (item of items(); track item.id; let i = $index) {
      <li>#{{ i + 1 }}: {{ item.name }}</li>
    }
    <!-- Also available: $first, $last, $even, $odd, $count -->
  \`
})
export class TodoListComponent {
  items = signal<Item[]>([]);
}`;

  readonly reactEventBinding = `// React — event handling in JSX
function Form() {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Submitted: ' + name);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Event + value binding (controlled input) */}
      <input value={name} onChange={e => setName(e.target.value)} />

      {/* Style binding */}
      <div style={{ color: 'red', fontSize: '14px' }}>Styled</div>

      {/* Class binding */}
      <div className={\`card \${isActive ? 'active' : ''}\`}>...</div>

      {/* Ref binding */}
      <input ref={inputRef} />
    </form>
  );
}`;

  readonly angularEventBinding = `// Angular — template syntax for bindings
@Component({
  template: \`
    <form (ngSubmit)="handleSubmit()">
      <!-- Two-way binding with [(ngModel)] or signal -->
      <input [value]="name()" (input)="updateName($event)" />

      <!-- Style binding with [style] -->
      <div [style.color]="'red'" [style.fontSize.px]="14">Styled</div>

      <!-- Class binding with [class] -->
      <div class="card" [class.active]="isActive()">...</div>

      <!-- Multiple classes -->
      <div [ngClass]="{ 'card': true, 'active': isActive(), 'disabled': !isEnabled() }">

      <!-- Ref binding with #template variable -->
      <input #nameInput />
      <button (click)="nameInput.focus()">Focus</button>
    </form>
  \`
})
export class FormComponent {
  name = signal('');
  isActive = signal(false);
  updateName(e: Event) {
    this.name.set((e.target as HTMLInputElement).value);
  }
}`;

  readonly deferAngular = `// Angular @defer — lazy-load template blocks (NO React equivalent!)
@Component({
  template: \`
    <!-- Load heavy component only when visible in viewport -->
    @defer (on viewport) {
      <app-heavy-chart [data]="chartData()" />
    } @placeholder {
      <div class="skeleton">Chart loading area...</div>
    } @loading (minimum 500ms) {
      <app-spinner />
    } @error {
      <p>Failed to load chart</p>
    }

    <!-- Load on interaction -->
    @defer (on interaction) {
      <app-comments [postId]="postId()" />
    } @placeholder {
      <button>Click to load comments</button>
    }

    <!-- Load on timer -->
    @defer (on timer(3s)) {
      <app-recommendations />
    }

    <!-- Load when condition is true -->
    @defer (when isLoggedIn()) {
      <app-dashboard />
    }
  \`
})
// React has NO equivalent! Closest is React.lazy + IntersectionObserver
// but Angular @defer handles loading/error/placeholder states built-in.`;
}
