import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-page',
  template: `
    <div class="section-page">
      <div class="section-hero">
        <div class="section-icon-wrap">
          <span class="section-icon">{{ icon() }}</span>
        </div>
        <div class="section-hero-text">
          <h1 class="section-title">{{ title() }}</h1>
          <p class="section-subtitle">{{ subtitle() }}</p>
        </div>
      </div>
      <ng-content />
    </div>
  `,
  styles: [
    `
      .section-page {
        max-width: 1140px;
        margin: 0 auto;
        padding: 2.5rem 2rem 4rem;
      }

      .section-hero {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 3rem;
        padding-bottom: 2.25rem;
        border-bottom: 1px solid rgba(99, 102, 241, 0.18);
        position: relative;
      }

      /* Subtle glow behind the icon */
      .section-icon-wrap {
        position: relative;
        flex-shrink: 0;
      }
      .section-icon-wrap::before {
        content: '';
        position: absolute;
        inset: -8px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
      }

      .section-icon {
        font-size: 3.25rem;
        line-height: 1;
        display: block;
        position: relative;
      }

      .section-hero-text {
        min-width: 0;
      }

      .section-title {
        font-size: clamp(1.6rem, 3.5vw, 2.4rem);
        font-weight: 800;
        background: linear-gradient(135deg, #c4b5fd 0%, #818cf8 50%, #6366f1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 0.5rem;
        letter-spacing: -0.03em;
        line-height: 1.15;
      }

      .section-subtitle {
        color: #94a3b8;
        font-size: 0.975rem;
        margin: 0;
        line-height: 1.65;
        max-width: 680px;
      }

      @media (max-width: 640px) {
        .section-page {
          padding: 1.5rem 1rem 3rem;
        }
        .section-hero {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .section-icon {
          font-size: 2.5rem;
        }
        .section-title {
          font-size: 1.5rem;
        }
        .section-subtitle {
          font-size: 0.875rem;
        }
      }
    `,
  ],
})
export class SectionPageComponent {
  title = input.required<string>();
  subtitle = input.required<string>();
  icon = input<string>('📄');
}
