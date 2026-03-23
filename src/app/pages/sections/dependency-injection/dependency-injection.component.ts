import { Component, signal, inject, InjectionToken, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionPageComponent } from '@shared/section-page/section-page.component';
import { ComparisonCardComponent } from '@shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '@shared/code-block/code-block.component';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-dependency-injection',
  imports: [CommonModule, SectionPageComponent, ComparisonCardComponent, CodeBlockComponent],
  templateUrl: './dependency-injection.component.html',
  styleUrl: '../sections.shared.css',
})
export class DependencyInjectionComponent {
  // Live demo — showing DI in action
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.user;
  readonly isLoggedIn = this.authService.isLoggedIn;

  readonly injectedServices = signal([
    { name: 'AuthService', scope: 'root', method: 'inject(AuthService)', status: 'active' },
    { name: 'HttpClient', scope: 'root', method: 'inject(HttpClient)', status: 'active' },
    { name: 'Router', scope: 'root', method: 'inject(Router)', status: 'active' },
    {
      name: 'ActivatedRoute',
      scope: 'component',
      method: 'inject(ActivatedRoute)',
      status: 'active',
    },
  ]);

  // ===== CODE SNIPPETS =====
  readonly reactContextApi = `// React — sharing state via Context API
import { createContext, useContext, useState } from 'react';

// 1. Create context
const AuthContext = createContext(null);

// 2. Create provider component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (email) => setUser({ email });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Create custom hook
function useAuth() {
  return useContext(AuthContext);
}

// 4. Wrap app in provider
<AuthProvider>
  <App />
</AuthProvider>

// 5. Use in any component
function Dashboard() {
  const { user, logout } = useAuth();
  return <button onClick={logout}>Logout {user.email}</button>;
}`;

  readonly angularDI = `// Angular — Dependency Injection (built-in, no boilerplate)
import { Injectable, signal, computed, inject } from '@angular/core';

// 1. Create service (auto-singleton with providedIn: 'root')
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  login(email: string) { this._user.set({ email }); }
  logout() { this._user.set(null); }
}

// 2. Use ANYWHERE with inject() — no Provider wrapping, no hook
@Component({ ... })
export class DashboardComponent {
  private auth = inject(AuthService); // That's it!
  user = this.auth.user;

  logout() { this.auth.logout(); }
}

// No AuthProvider wrapper needed!
// No createContext, no useContext, no custom hooks!
// Angular's DI system handles everything automatically.`;

  readonly reactCustomHooks = `// React — custom hooks for reusable logic
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handler = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
}`;

  readonly angularServices = `// Angular — services = custom hooks (but injectable & singleton)
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private platform = inject(PLATFORM_ID);

  get<T>(key: string, fallback: T): T {
    if (!isPlatformBrowser(this.platform)) return fallback;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  }

  set(key: string, value: any): void {
    if (isPlatformBrowser(this.platform)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}

@Injectable({ providedIn: 'root' })
export class WindowSizeService {
  readonly width = signal(0);
  readonly height = signal(0);

  constructor() {
    if (typeof window !== 'undefined') {
      this.width.set(window.innerWidth);
      this.height.set(window.innerHeight);
      window.addEventListener('resize', () => {
        this.width.set(window.innerWidth);
        this.height.set(window.innerHeight);
      });
    }
  }
}

// Use anywhere: inject(WindowSizeService).width()`;

  readonly injectionTokenAngular = `// Angular — InjectionToken for configuration & interfaces
import { InjectionToken, inject } from '@angular/core';

// Define a token (like React Context but typed & tree-shakable)
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('FEATURE_FLAGS');

// Provide values in app.config.ts:
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_BASE_URL, useValue: 'https://api.example.com' },
    { provide: FEATURE_FLAGS, useValue: { darkMode: true, beta: false } },
  ],
};

// Inject anywhere — fully typed!
@Component({ ... })
export class ApiComponent {
  private apiUrl = inject(API_BASE_URL);    // string
  private flags = inject(FEATURE_FLAGS);    // FeatureFlags

  // React equivalent would be:
  // const apiUrl = useContext(ApiUrlContext);
  // const flags = useContext(FeatureFlagsContext);
}`;

  readonly hierarchicalDI = `// Angular — Hierarchical Injectors (no React equivalent!)
// Services can be scoped to different levels:

// LEVEL 1: Root (singleton for entire app)
@Injectable({ providedIn: 'root' })
export class GlobalService { /* shared everywhere */ }

// LEVEL 2: Component-level (new instance per component)
@Component({
  selector: 'app-editor',
  providers: [EditorStateService],  // New instance for each <app-editor>
  template: \`
    <!-- All children share THIS instance of EditorStateService -->
    <app-toolbar />
    <app-canvas />
    <app-sidebar />
  \`
})
export class EditorComponent {
  state = inject(EditorStateService); // Component-scoped
}

// Example: Two <app-editor> components on the page
//   → Each gets its OWN EditorStateService instance
//   → Children within each editor share their parent's instance
//
// React would need TWO separate Context providers for this!`;
}
