import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-block',
  imports: [CommonModule],
  template: `
    <div class="code-block-wrapper">
      <div class="code-block-header">
        <div class="flex items-center gap-2">
          <span
            class="lang-badge"
            [class.react-badge]="language() === 'tsx' || language() === 'jsx'"
            [class.angular-badge]="language() === 'typescript' || language() === 'angular-ts'"
          >
            {{ displayLang() }}
          </span>
          @if (label()) {
            <span class="text-slate-400 text-xs">{{ label() }}</span>
          }
        </div>
        <button class="copy-btn" (click)="copyCode()">
          @if (copied()) {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Copied!</span>
          } @else {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path
                d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
              />
            </svg>
            <span>Copy</span>
          }
        </button>
      </div>
      <pre class="code-pre"><code [innerHTML]="highlightedCode()"></code></pre>
    </div>
  `,
  styles: [
    `
      .code-block-wrapper {
        border-radius: 0.75rem;
        overflow: hidden;
        border: 1px solid rgba(99, 102, 241, 0.2);
        background: #0f0f1a;
      }
      .code-block-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 1rem;
        background: rgba(99, 102, 241, 0.1);
        border-bottom: 1px solid rgba(99, 102, 241, 0.15);
      }
      .lang-badge {
        font-size: 0.7rem;
        font-weight: 600;
        padding: 0.15rem 0.5rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.1);
        color: #a5b4fc;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .react-badge {
        background: rgba(97, 218, 251, 0.15);
        color: #61dafb;
      }
      .angular-badge {
        background: rgba(221, 0, 49, 0.15);
        color: #ff6b8a;
      }
      .copy-btn {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.75rem;
        color: #64748b;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
        transition: all 0.15s ease;
      }
      .copy-btn:hover {
        color: #a5b4fc;
        background: rgba(99, 102, 241, 0.1);
      }
      .code-pre {
        margin: 0;
        padding: 1.25rem;
        overflow-x: auto;
        font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
        font-size: 0.8rem;
        line-height: 1.6;
        color: #e2e8f0;
      }
    `,
  ],
})
export class CodeBlockComponent {
  code = input.required<string>();
  language = input<string>('typescript');
  label = input<string>('');
  copied = signal(false);

  displayLang() {
    const lang = this.language();
    const map: Record<string, string> = {
      typescript: 'TypeScript',
      'angular-ts': 'Angular',
      tsx: 'React TSX',
      jsx: 'React JSX',
      html: 'HTML',
      css: 'CSS',
    };
    return map[lang] ?? lang;
  }

  highlightedCode(): string {
    return this.applySyntaxHighlighting(this.code());
  }

  copyCode(): void {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(this.code()).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }

  private applySyntaxHighlighting(code: string): string {
    // Escape HTML entities first
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    // Apply syntax highlighting with CSS classes via inline spans
    // Keywords
    escaped = escaped.replace(
      /\b(import|export|from|const|let|var|function|class|interface|type|return|if|else|for|while|new|async|await|extends|implements|default|readonly|private|public|protected|static|abstract|declare|enum|namespace|module|as|of|in|instanceof|typeof|void|null|undefined|true|false|this|super)\b/g,
      '<span style="color:#c084fc">$1</span>',
    );

    // Decorators
    escaped = escaped.replace(/(@\w+)/g, '<span style="color:#f59e0b">$1</span>');

    // Strings
    escaped = escaped.replace(
      /(&apos;[^&apos;]*&apos;|&quot;[^&quot;]*&quot;|`[^`]*`)/g,
      '<span style="color:#86efac">$&</span>',
    );
    escaped = escaped.replace(/'([^']*)'/g, '<span style="color:#86efac">\'$1\'</span>');

    // Comments
    escaped = escaped.replace(
      /(\/\/[^\n]*)/g,
      '<span style="color:#64748b;font-style:italic">$1</span>',
    );
    escaped = escaped.replace(
      /(\/\*[\s\S]*?\*\/)/g,
      '<span style="color:#64748b;font-style:italic">$1</span>',
    );

    // Numbers
    escaped = escaped.replace(/\b(\d+)\b/g, '<span style="color:#fb923c">$1</span>');

    // Type annotations (words after colon or angle brackets that are capitalized)
    escaped = escaped.replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span style="color:#67e8f9">$1</span>');

    return escaped;
  }
}
