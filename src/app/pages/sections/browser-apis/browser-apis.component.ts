import { Component, signal, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { SectionPageComponent } from '../../../shared/section-page/section-page.component';
import { ComparisonCardComponent } from '../../../shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

interface StorageItem {
  key: string;
  value: string;
  timestamp: string;
}

@Component({
  selector: 'app-browser-apis',
  imports: [CommonModule, SectionPageComponent, ComparisonCardComponent, CodeBlockComponent],
  templateUrl: './browser-apis.component.html',
  styleUrl: '../sections.shared.css',
})
export class BrowserApisComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  // LocalStorage demo
  readonly storageItems = signal<StorageItem[]>([]);
  readonly newKey = signal('');
  readonly newValue = signal('');

  // Window info
  readonly windowInfo = signal({
    width: 0,
    height: 0,
    userAgent: '',
    online: true,
  });

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadStorageItems();
      this.updateWindowInfo();
    }
  }

  updateWindowInfo(): void {
    if (!this.isBrowser) return;
    this.windowInfo.set({
      width: window.innerWidth,
      height: window.innerHeight,
      userAgent: navigator.userAgent.slice(0, 80) + '...',
      online: navigator.onLine,
    });
  }

  loadStorageItems(): void {
    if (!this.isBrowser) return;
    const items: StorageItem[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('ng_demo_')) {
        items.push({
          key: key.replace('ng_demo_', ''),
          value: localStorage.getItem(key) ?? '',
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    }
    this.storageItems.set(items);
  }

  setItem(): void {
    if (!this.isBrowser || !this.newKey().trim()) return;
    localStorage.setItem(`ng_demo_${this.newKey()}`, this.newValue());
    this.loadStorageItems();
    this.newKey.set('');
    this.newValue.set('');
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(`ng_demo_${key}`);
    this.loadStorageItems();
  }

  updateKey(event: Event): void {
    this.newKey.set((event.target as HTMLInputElement).value);
  }

  updateValue(event: Event): void {
    this.newValue.set((event.target as HTMLInputElement).value);
  }

  // ===== CODE SNIPPETS =====
  readonly reactLocalStorage = `// React — localStorage with SSR safety
import { useState, useEffect } from 'react';

// Custom hook for SSR-safe localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    // Guard: window doesn't exist on server
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStored(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [stored, setValue] as const;
}

// Usage:
const [theme, setTheme] = useLocalStorage('theme', 'dark');`;

  readonly angularLocalStorage = `// Angular — localStorage with PLATFORM_ID (SSR-safe)
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private platformId = inject(PLATFORM_ID);

  // isPlatformBrowser() = typeof window !== 'undefined' in React
  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getItem<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser) return defaultValue; // SSR: return default
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  }

  setItem(key: string, value: unknown): void {
    if (!this.isBrowser) return; // Skip on server
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(key);
  }
}

// Usage in component:
@Component({ ... })
export class MyComponent {
  private storage = inject(StorageService);
  theme = signal(this.storage.getItem('theme', 'dark'));

  toggleTheme() {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.storage.setItem('theme', next);
  }
}`;

  readonly reactWindowApi = `// React — window/document access patterns
import { useState, useEffect, useRef } from 'react';

// Window size hook (SSR-safe):
function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler); // Cleanup
  }, []);

  return size;
}

// Scroll position:
function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return scrollY;
}`;

  readonly angularWindowApi = `// Angular — window/document API access
import { Injectable, inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { fromEvent, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WindowService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT); // Inject DOCUMENT (works in SSR too!)

  // Window resize as Observable
  get resize$(): Observable<Event> {
    if (!isPlatformBrowser(this.platformId)) return EMPTY;
    return fromEvent(window, 'resize'); // RxJS fromEvent wraps addEventListener
  }

  // Document title
  setTitle(title: string) {
    this.document.title = title; // Use injected DOCUMENT, not global document
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

// Usage in component:
@Component({ ... })
export class MyComponent implements OnInit {
  private window = inject(WindowService);

  ngOnInit() {
    this.window.resize$.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(100),
    ).subscribe(() => { /* handle resize */ });
  }
}`;

  readonly angularTitleMeta = `// Angular — Title and Meta services (SEO)
// React equivalent: next/head or react-helmet
import { Title, Meta } from '@angular/platform-browser';

@Component({ ... })
export class ProductPageComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);

  ngOnInit() {
    this.title.setTitle('Product Name — My Shop');

    this.meta.updateTag({ name: 'description', content: 'Product description here' });
    this.meta.updateTag({ property: 'og:title', content: 'Product Name' });
    this.meta.updateTag({ property: 'og:image', content: '/product.jpg' });

    // React (Next.js equivalent):
    // export const metadata = { title: 'Product Name', description: '...' };
  }
}`;
}
