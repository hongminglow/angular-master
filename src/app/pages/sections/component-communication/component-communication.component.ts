import { Component, signal, computed, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionPageComponent } from '@shared/section-page/section-page.component';
import { ComparisonCardComponent } from '@shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '@shared/code-block/code-block.component';

@Component({
  selector: 'app-component-communication',
  imports: [CommonModule, SectionPageComponent, ComparisonCardComponent, CodeBlockComponent],
  templateUrl: './component-communication.component.html',
  styleUrl: '../sections.shared.css',
})
export class ComponentCommunicationComponent {
  // Live demo: Parent state
  readonly parentMessage = signal('Hello from Parent!');
  readonly childMessages = signal<string[]>([]);
  readonly twoWayValue = signal('Edit me!');

  updateParentMessage(event: Event): void {
    this.parentMessage.set((event.target as HTMLInputElement).value);
  }

  onChildEvent(msg: string): void {
    this.childMessages.update((list) => [...list, msg]);
  }

  clearMessages(): void {
    this.childMessages.set([]);
  }

  // ===== CODE SNIPPETS =====
  readonly reactPropsVsInput = `// React — passing data DOWN via props
interface CardProps {
  title: string;
  count: number;
  onDelete?: () => void;
  children: React.ReactNode;  // Slot content
}

function Card({ title, count, onDelete, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <span>{count}</span>
      {onDelete && <button onClick={onDelete}>Delete</button>}
      <div className="content">{children}</div>
    </div>
  );
}

// Usage:
<Card title="My Card" count={42} onDelete={handleDelete}>
  <p>This is slot content (children)</p>
</Card>`;

  readonly angularInputOutput = `// Angular — @input() for data DOWN, @output() for events UP
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-card',
  template: \`
    <div class="card">
      <h2>{{ title() }}</h2>
      <span>{{ count() }}</span>
      @if (onDelete.observed) {
        <button (click)="onDelete.emit()">Delete</button>
      }
      <div class="content">
        <ng-content />  <!-- ≈ React children -->
      </div>
    </div>
  \`
})
export class CardComponent {
  // input() ≈ props (read-only, parent → child)
  title = input.required<string>();
  count = input(0);                    // with default

  // output() ≈ callback prop (child → parent)
  onDelete = output<void>();
}

// Usage:
// <app-card [title]="'My Card'" [count]="42" (onDelete)="handleDelete()">
//   <p>This is slot content (ng-content)</p>
// </app-card>`;

  readonly reactCallbackProps = `// React — child communicates UP via callback props
function SearchInput({ onSearch, onClear }) {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={() => onSearch(query)}>Search</button>
      <button onClick={onClear}>Clear</button>
    </div>
  );
}

// Parent:
function Parent() {
  const handleSearch = (q) => console.log('Searching:', q);
  return <SearchInput onSearch={handleSearch} onClear={() => {}} />;
}`;

  readonly angularOutputEvents = `// Angular — output() sends events UP to parent
import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-search-input',
  template: \`
    <div>
      <input [value]="query()" (input)="updateQuery($event)" />
      <button (click)="onSearch.emit(query())">Search</button>
      <button (click)="onClear.emit()">Clear</button>
    </div>
  \`
})
export class SearchInputComponent {
  query = signal('');

  // output<T>() = typed event emitter (child → parent)
  onSearch = output<string>();
  onClear = output<void>();

  updateQuery(e: Event) {
    this.query.set((e.target as HTMLInputElement).value);
  }
}

// Parent template:
// <app-search-input
//   (onSearch)="handleSearch($event)"
//   (onClear)="handleClear()"
// />`;

  readonly reactChildren = `// React — children prop for content projection
function Modal({ title, children, footer }) {
  return (
    <div className="modal">
      <h2>{title}</h2>
      <div className="body">{children}</div>
      {footer && <div className="footer">{footer}</div>}
    </div>
  );
}

// Usage — children = default slot:
<Modal title="Confirm" footer={<Button>OK</Button>}>
  <p>Are you sure?</p>
</Modal>`;

  readonly angularContentProjection = `// Angular — <ng-content> for content projection (= children)
@Component({
  selector: 'app-modal',
  template: \`
    <div class="modal">
      <h2>{{ title() }}</h2>

      <!-- Default slot (like React children) -->
      <div class="body">
        <ng-content />
      </div>

      <!-- Named slot (like React render prop) -->
      <div class="footer">
        <ng-content select="[slot=footer]" />
      </div>
    </div>
  \`
})
export class ModalComponent {
  title = input.required<string>();
}

// Usage — named slots with selector:
// <app-modal title="Confirm">
//   <p>Are you sure?</p>              <!-- goes to default slot -->
//   <button slot="footer">OK</button> <!-- goes to footer slot -->
// </app-modal>`;

  readonly modelSignalAngular = `// Angular model() — two-way binding signal (Angular 17+)
// No React equivalent! React has no built-in two-way binding.

@Component({
  selector: 'app-toggle',
  template: \`
    <label>
      <input type="checkbox" [checked]="checked()" (change)="checked.set(!checked())" />
      {{ checked() ? 'ON' : 'OFF' }}
    </label>
  \`
})
export class ToggleComponent {
  // model() = writable input — parent and child share the same value
  checked = model(false);
}

// Parent usage — two-way binding with [( )] banana-in-a-box syntax:
// <app-toggle [(checked)]="isEnabled" />
// When child updates checked, parent's isEnabled updates too!

// React would need:
// <Toggle checked={isEnabled} onCheckedChange={setIsEnabled} />`;
}
