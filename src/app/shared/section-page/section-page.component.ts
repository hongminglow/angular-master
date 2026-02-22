import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-page',
  template: `
    <div class="section-page">
      <div class="section-hero">
        <div class="section-icon">{{ icon() }}</div>
        <div>
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
        max-width: 1100px;
        margin: 0 auto;
        padding: 2rem 1.5rem;
      }
      .section-hero {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        margin-bottom: 2.5rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(99, 102, 241, 0.2);
      }
      .section-icon {
        font-size: 3rem;
        flex-shrink: 0;
      }
      .section-title {
        font-size: clamp(1.5rem, 3vw, 2.25rem);
        font-weight: 800;
        background: linear-gradient(135deg, #a5b4fc, #818cf8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 0.25rem;
      }
      .section-subtitle {
        color: #64748b;
        font-size: 1rem;
        margin: 0;
      }
      @media (max-width: 600px) {
        .section-hero {
          flex-direction: column;
          align-items: flex-start;
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
