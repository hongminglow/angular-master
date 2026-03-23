import { Component, signal, computed, Pipe, PipeTransform } from '@angular/core';
import {
  CommonModule,
  DatePipe,
  CurrencyPipe,
  UpperCasePipe,
  SlicePipe,
  JsonPipe,
  PercentPipe,
} from '@angular/common';
import { SectionPageComponent } from '@shared/section-page/section-page.component';
import { ComparisonCardComponent } from '@shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '@shared/code-block/code-block.component';

// Custom pipe defined in the same file for demo
@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date | string): string {
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDay}d ago`;
  }
}

@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  transform(bytes: number, decimals = 1): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  }
}

@Component({
  selector: 'app-pipes',
  imports: [
    CommonModule,
    SectionPageComponent,
    ComparisonCardComponent,
    CodeBlockComponent,
    DatePipe,
    CurrencyPipe,
    UpperCasePipe,
    SlicePipe,
    JsonPipe,
    PercentPipe,
    FileSizePipe,
  ],
  templateUrl: './pipes.component.html',
  styleUrl: '../sections.shared.css',
})
export class PipesComponent {
  readonly now = signal(new Date());
  readonly price = signal(1299.5);
  readonly ratio = signal(0.847);
  readonly longText = signal(
    'Angular pipes transform data directly in templates — no helper functions needed!',
  );
  readonly fileBytes = signal(2548576);
  readonly sampleObject = signal({ name: 'Angular', version: 21, signals: true });

  // ===== CODE SNIPPETS =====
  readonly reactInlineFormat = `// React — formatting done inline or via helper functions
import dayjs from 'dayjs'; // or date-fns, etc.

function Dashboard({ user, price, ratio, createdAt }) {
  // Every formatting operation is a manual JS call
  return (
    <div>
      {/* Date formatting — needs library */}
      <span>{dayjs(createdAt).format('MMM D, YYYY')}</span>
      <span>{dayjs(createdAt).fromNow()}</span>

      {/* Currency — manual Intl API */}
      <span>{new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
      }).format(price)}</span>

      {/* Percent */}
      <span>{(ratio * 100).toFixed(1)}%</span>

      {/* Uppercase */}
      <span>{user.name.toUpperCase()}</span>

      {/* Truncate */}
      <span>{text.slice(0, 50)}...</span>

      {/* JSON debug */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}`;

  readonly angularBuiltinPipes = `// Angular — built-in pipes transform data in templates
@Component({
  imports: [DatePipe, CurrencyPipe, UpperCasePipe, SlicePipe,
            JsonPipe, DecimalPipe, PercentPipe],
  template: \`
    <!-- Date — no extra library needed! -->
    <span>{{ createdAt | date:'mediumDate' }}</span>
    <span>{{ createdAt | date:'shortTime' }}</span>

    <!-- Currency — built-in formatting -->
    <span>{{ price | currency:'USD' }}</span>

    <!-- Percent -->
    <span>{{ ratio | percent:'1.1-1' }}</span>

    <!-- Uppercase -->
    <span>{{ user.name | uppercase }}</span>

    <!-- Truncate with slice -->
    <span>{{ text | slice:0:50 }}...</span>

    <!-- JSON debug — incredibly useful! -->
    <pre>{{ data | json }}</pre>

    <!-- Chain multiple pipes! -->
    <span>{{ title | uppercase | slice:0:20 }}</span>
  \`
})`;

  readonly reactCustomFormat = `// React — custom formatting as utility functions
// utils/formatters.ts
export function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return \`\${mins}m ago\`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return \`\${hrs}h ago\`;
  return \`\${Math.floor(hrs / 24)}d ago\`;
}

export function fileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

// Component — call functions inline
function FileInfo({ file }) {
  return (
    <div>
      <span>{fileSize(file.size)}</span>
      <span>{relativeTime(file.updatedAt)}</span>
    </div>
  );
}`;

  readonly angularCustomPipes = `// Angular — custom pipes are reusable & memoized
import { Pipe, PipeTransform } from '@angular/core';

// Custom Pipe — like a reusable, memoized template function
@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date): string {
    const diff = Date.now() - new Date(value).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return \`\${mins}m ago\`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return \`\${hrs}h ago\`;
    return \`\${Math.floor(hrs / 24)}d ago\`;
  }
}

@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  transform(bytes: number, decimals = 1): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(decimals) + ' ' + sizes[i];
  }
}

// Usage — pipe syntax in template:
// <span>{{ file.size | fileSize }}</span>
// <span>{{ file.updatedAt | relativeTime }}</span>
//
// KEY ADVANTAGE: Pure pipes are MEMOIZED by default!
// Angular only re-runs the transform when the input changes.
// React helper functions run on EVERY render.`;

  readonly asyncPipeAngular = `// Angular — async pipe for Observables + Promises (MOST POWERFUL pipe)
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [AsyncPipe],
  template: \`
    <!-- async pipe subscribes AND unsubscribes automatically! -->
    @if (users$ | async; as users) {
      @for (user of users; track user.id) {
        <div>{{ user.name }}</div>
      }
    }

    <!-- Combine with other pipes -->
    <span>{{ (lastUpdated$ | async) | date:'short' }}</span>
  \`
})
export class UserListComponent {
  private http = inject(HttpClient);

  // Observable — async pipe handles subscription lifecycle
  users$ = this.http.get<User[]>('/api/users');
  lastUpdated$ = this.http.get<Date>('/api/last-updated');

  // React equivalent needs MORE code:
  // const [users, setUsers] = useState([]);
  // useEffect(() => {
  //   fetch('/api/users').then(r => r.json()).then(setUsers);
  //   return () => { /* cleanup */ };
  // }, []);
}`;
}
