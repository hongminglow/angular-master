import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  email: string;
  name: string;
}

/**
 * AuthService — a singleton service (Angular's equivalent of a global store for auth state).
 *
 * In React you'd typically use:
 *   const [user, setUser] = useState<User | null>(null);
 *   stored in a Context or Zustand store.
 *
 * In Angular, services decorated with `providedIn: 'root'` are singletons —
 * automatically instantiated once and shared across the entire app.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);

  // Angular Signals — similar to React's useState but reactive everywhere (not just components)
  private readonly _user = signal<User | null>(this.loadUserFromStorage());
  private readonly _isLoggedIn = computed(() => this._user() !== null);

  // Public read-only access
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = this._isLoggedIn;

  login(email: string, password: string): boolean {
    // Mock validation — in a real app you'd call an HTTP service
    if (email && password.length >= 6) {
      const user: User = { email, name: email.split('@')[0] };
      this._user.set(user);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('ng_user', JSON.stringify(user));
      }
      return true;
    }
    return false;
  }

  logout(): void {
    this._user.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('ng_user');
    }
  }

  private loadUserFromStorage(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('ng_user');
      return stored ? (JSON.parse(stored) as User) : null;
    }
    return null;
  }
}
