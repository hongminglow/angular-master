import {
  Component,
  signal,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionPageComponent } from '@shared/section-page/section-page.component';
import { ComparisonCardComponent } from '@shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '@shared/code-block/code-block.component';

// Live demo directive — highlight on hover
@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private el = inject(ElementRef);
  color = input('rgba(99, 102, 241, 0.15)', { alias: 'appHighlight' });
  private originalBg = '';

  constructor() {
    this.originalBg = this.el.nativeElement.style.backgroundColor;
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.el.nativeElement.style.backgroundColor = this.color();
    this.el.nativeElement.style.transition = 'background-color 0.2s';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.backgroundColor = this.originalBg;
  }
}

@Component({
  selector: 'app-directives',
  imports: [
    CommonModule,
    SectionPageComponent,
    ComparisonCardComponent,
    CodeBlockComponent,
    HighlightDirective,
  ],
  templateUrl: './directives.component.html',
  styleUrl: '../sections.shared.css',
})
export class DirectivesComponent {
  readonly highlightColor = signal('rgba(99, 102, 241, 0.15)');
  readonly colors = [
    { label: 'Indigo', value: 'rgba(99, 102, 241, 0.15)' },
    { label: 'Green', value: 'rgba(74, 222, 128, 0.15)' },
    { label: 'Orange', value: 'rgba(251, 146, 60, 0.15)' },
    { label: 'Pink', value: 'rgba(236, 72, 153, 0.15)' },
  ];

  setColor(color: string): void {
    this.highlightColor.set(color);
  }

  // ===== CODE SNIPPETS =====
  readonly reactNoDirectives = `// React — no "directives" concept. Uses:
// 1. Custom hooks for reusable behavior
// 2. Higher-Order Components (HOCs)
// 3. Render props / wrapper components

// Approach 1: Custom hook (most common)
function useClickOutside(ref, callback) {
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [ref, callback]);
}

// Usage — hook is "invisible behavior" attached to a ref
function Dropdown() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  useClickOutside(ref, () => setOpen(false));

  return <div ref={ref}>{open && <Menu />}</div>;
}

// Approach 2: HOC / wrapper component
function WithTooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && <span className="tooltip">{text}</span>}
    </div>
  );
}`;

  readonly angularAttributeDirective = `// Angular — attribute directives attach behavior to ANY element
import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  private el = inject(ElementRef);
  color = input('yellow', { alias: 'appHighlight' }); // Configurable

  @HostListener('mouseenter')
  onEnter() { this.el.nativeElement.style.backgroundColor = this.color(); }

  @HostListener('mouseleave')
  onLeave() { this.el.nativeElement.style.backgroundColor = ''; }
}

// Usage — just add the attribute to ANY element!
// <p appHighlight>Hover me — I'll turn yellow!</p>
// <button [appHighlight]="'lightblue'">Custom color</button>
// <div [appHighlight]="userPreferredColor()">Dynamic!</div>

// KEY ADVANTAGE:
// - Directives are DECLARATIVE — add behavior via HTML attributes
// - Works on ANY element without wrapping
// - React hooks need a ref + component coupling`;

  readonly reactWrapperPatterns = `// React — tooltip/click-outside as wrapper components
function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <div
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {show && <span className="tooltip-popup">{text}</span>}
    </div>
  );
}

// Usage — wraps the element (extra DOM node!)
<Tooltip text="Click to save">
  <button>Save</button>
</Tooltip>

// Click-outside as custom hook:
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current?.contains(e.target)) handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}`;

  readonly angularCommonDirectives = `// Angular — common directive patterns
// 1. Click-outside directive
@Directive({ selector: '[appClickOutside]' })
export class ClickOutsideDirective {
  private el = inject(ElementRef);
  clickOutside = output<void>();

  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLElement) {
    if (!this.el.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }
}
// Usage: <div (appClickOutside)="closeMenu()">...</div>

// 2. Tooltip directive
@Directive({ selector: '[appTooltip]' })
export class TooltipDirective {
  text = input.required<string>({ alias: 'appTooltip' });
  private tooltip: HTMLElement | null = null;

  @HostListener('mouseenter') show() {
    this.tooltip = document.createElement('span');
    this.tooltip.textContent = this.text();
    this.tooltip.className = 'tooltip-popup';
    this.el.nativeElement.appendChild(this.tooltip);
  }

  @HostListener('mouseleave') hide() {
    this.tooltip?.remove();
  }
}
// Usage: <button appTooltip="Click to save">Save</button>
// No wrapper element needed! Attaches directly to the button.

// 3. Auto-focus directive
@Directive({ selector: '[appAutoFocus]' })
export class AutoFocusDirective {
  private el = inject(ElementRef);
  ngAfterViewInit() { this.el.nativeElement.focus(); }
}
// Usage: <input appAutoFocus />`;

  readonly hostDirectiveAngular = `// Angular 15+ — Host Directives (compose behaviors)
// Compose multiple directives into a single component

@Directive({ selector: '[appDraggable]' })
export class DraggableDirective { /* drag behavior */ }

@Directive({ selector: '[appResizable]' })
export class ResizableDirective { /* resize behavior */ }

@Component({
  selector: 'app-widget',
  // Host directives = compose behaviors without template changes
  hostDirectives: [
    { directive: DraggableDirective, inputs: ['dragAxis'] },
    { directive: ResizableDirective, outputs: ['resized'] },
  ],
  template: \`<div class="widget"><ng-content /></div>\`
})
export class WidgetComponent {
  // This widget is now draggable AND resizable
  // without ANY code in this component!
}

// Usage:
// <app-widget dragAxis="both" (resized)="onResize($event)">
//   Content
// </app-widget>

// React equivalent would need:
// const DraggableResizableWidget = withDraggable(withResizable(Widget));
// Or: hooks + refs + multiple useEffect calls`;
}
