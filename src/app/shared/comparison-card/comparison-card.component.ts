import { Component, input } from '@angular/core';
import { CodeBlockComponent } from '@shared/code-block/code-block.component';

@Component({
  selector: 'app-comparison-card',
  imports: [CodeBlockComponent],
  template: `
    <div class="comparison-card">
      <div class="comparison-header">
        <span class="react-label">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="display:inline;vertical-align:middle;margin-right:5px"
          >
            <circle cx="12" cy="12" r="2.5" />
            <path
              d="M12 2C9.5 2 7.3 4.8 6 9c-1.3-1-2.5-1.5-3.3-1.1C1.4 8.6 1.4 11 2.8 13.5 1.4 16 1.4 18.4 2.7 19.1c.8.4 2-.1 3.3-1.1C7.3 19.2 9.5 22 12 22s4.7-2.8 6-7c1.3 1 2.5 1.5 3.3 1.1 1.3-.7 1.3-3.1-.1-5.6 1.4-2.5 1.4-4.9.1-5.6-.8-.4-2 .1-3.3 1.1C16.7 4.8 14.5 2 12 2zm0 2c1.6 0 3.4 2.2 4.5 5.8C14.2 10.6 11.8 11 10 11c-1.1 0-2.1-.1-3-.3L7 11C7 7.2 9 4 12 4zm4.5 5.8L18 11h.1l.5 1c.3.7.5 1.4.5 2s-.2 1.3-.5 2l-.5 1h-.1l-1.5 1.2C15.5 20 13.7 20 12 20c-3 0-5-3.2-5-7 2 .3 3.3-.1 4.8-.8L16.5 9.8zm-9 .4C8.7 10.6 9.8 11 11 11l1 .1c-.7.8-1.4 1.4-2 1.8L7.5 14l-.5-1a5 5 0 0 1 0-4l.5-1 1.5 1.2z"
              fill-rule="evenodd"
              clip-rule="evenodd"
            />
          </svg>
          React
        </span>
        <div class="vs-badge">VS</div>
        <span class="angular-label">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="display:inline;vertical-align:middle;margin-right:5px"
          >
            <path
              d="M12 2L2 6.5l1.5 13L12 22l8.5-2.5L22 6.5 12 2zm0 2.2l6.8 2.8-1.2 10.4L12 19.6l-5.6-2.2L5.2 7 12 4.2zM12 7L8 17h1.5l.8-2h3.4l.8 2H16L12 7zm0 2.5l1.2 3.5h-2.4L12 9.5z"
            />
          </svg>
          Angular
        </span>
      </div>
      <div class="comparison-body">
        <div class="code-side code-side-react">
          <app-code-block [code]="reactCode()" language="tsx" [label]="reactLabel()" />
        </div>
        <div class="code-side code-side-angular">
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
        background: rgba(10, 10, 20, 0.95);
        margin-bottom: 1.5rem;
        box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);
      }
      .comparison-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.625rem 1.25rem;
        background: linear-gradient(
          90deg,
          rgba(97, 218, 251, 0.07) 0%,
          rgba(99, 102, 241, 0.05) 50%,
          rgba(244, 114, 182, 0.07) 100%
        );
        border-bottom: 1px solid rgba(99, 102, 241, 0.15);
      }
      .react-label {
        font-size: 0.8rem;
        font-weight: 700;
        color: #61dafb;
        letter-spacing: 0.02em;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      .angular-label {
        font-size: 0.8rem;
        font-weight: 700;
        color: #f472b6;
        letter-spacing: 0.02em;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      .vs-badge {
        font-size: 0.65rem;
        font-weight: 800;
        color: #a5b4fc;
        background: rgba(99, 102, 241, 0.18);
        border: 1px solid rgba(99, 102, 241, 0.25);
        padding: 0.15rem 0.6rem;
        border-radius: 999px;
        letter-spacing: 0.12em;
      }
      /* KEY FIX: grid with min-width:0 prevents children from blowing out their columns */
      .comparison-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
        min-height: 0;
      }
      .code-side {
        /* min-width: 0 is the critical grid fix — without it child content can overflow grid */
        min-width: 0;
        overflow: hidden;
        border-right: 1px solid rgba(99, 102, 241, 0.15);
        display: flex;
        flex-direction: column;
      }
      .code-side:last-child {
        border-right: none;
      }
      /* Force code-block-wrapper to fill height and scroll independently */
      .code-side :host ::ng-deep .code-block-wrapper,
      .code-side ::ng-deep .code-block-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .code-side ::ng-deep .code-pre {
        overflow-x: auto;
        overflow-y: auto;
        flex: 1;
        /* Constrain max height so side-by-side stays aligned */
        max-height: 480px;
      }
      @media (max-width: 900px) {
        .comparison-body {
          grid-template-columns: 1fr;
        }
        .code-side {
          border-right: none;
          border-bottom: 1px solid rgba(99, 102, 241, 0.12);
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
