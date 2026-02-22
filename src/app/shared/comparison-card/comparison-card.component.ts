import { Component, input } from '@angular/core';
import { CodeBlockComponent } from '@shared/code-block/code-block.component';

@Component({
  selector: 'app-comparison-card',
  imports: [CodeBlockComponent],
  template: `
    <div class="comparison-card">
      <div class="comparison-header">
        <span class="react-label">⚛️ React</span>
        <div class="vs-badge">VS</div>
        <span class="angular-label">🅰️ Angular</span>
      </div>
      <div class="comparison-body">
        <div class="code-side">
          <app-code-block [code]="reactCode()" language="tsx" [label]="reactLabel()" />
        </div>
        <div class="code-side">
          <app-code-block [code]="angularCode()" language="angular-ts" [label]="angularLabel()" />
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .comparison-card {
        border-radius: 1rem;
        overflow: hidden;
        border: 1px solid rgba(99, 102, 241, 0.25);
        background: rgba(15, 15, 26, 0.8);
        margin-bottom: 1.5rem;
      }
      .comparison-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1.5rem;
        background: linear-gradient(90deg, rgba(97, 218, 251, 0.08), rgba(221, 0, 49, 0.08));
        border-bottom: 1px solid rgba(99, 102, 241, 0.15);
      }
      .react-label {
        font-size: 0.875rem;
        font-weight: 700;
        color: #61dafb;
      }
      .angular-label {
        font-size: 0.875rem;
        font-weight: 700;
        color: #ff6b8a;
      }
      .vs-badge {
        font-size: 0.7rem;
        font-weight: 800;
        color: #a5b4fc;
        background: rgba(99, 102, 241, 0.2);
        padding: 0.15rem 0.5rem;
        border-radius: 999px;
        letter-spacing: 0.1em;
      }
      .comparison-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
      }
      .code-side {
        padding: 1rem;
        border-right: 1px solid rgba(99, 102, 241, 0.15);
      }
      .code-side:last-child {
        border-right: none;
      }
      @media (max-width: 900px) {
        .comparison-body {
          grid-template-columns: 1fr;
        }
        .code-side {
          border-right: none;
          border-bottom: 1px solid rgba(99, 102, 241, 0.15);
        }
        .code-side:last-child {
          border-bottom: none;
        }
      }
    `,
  ],
})
export class ComparisonCardComponent {
  reactCode = input.required<string>();
  angularCode = input.required<string>();
  reactLabel = input<string>('');
  angularLabel = input<string>('');
}
