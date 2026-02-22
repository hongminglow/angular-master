import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  category?: string;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.authService.user;
  readonly sidebarOpen = signal(true);
  readonly currentPageTitle = signal('Home');

  constructor() {
    // Track route changes to update breadcrumb title & scroll main content to top
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      const url = this.router.url.split('?')[0].split('/').pop() ?? '';
      const matched = this.navItems.find((item) => item.path === `/${url}`);
      this.currentPageTitle.set(matched?.label ?? 'Angular Master');

      // Scroll main content area to top on route change
      const mainContent = document.querySelector('.main-content');
      if (mainContent) mainContent.scrollTop = 0;
    });
  }

  readonly navItems: NavItem[] = [
    { path: '/home', label: 'Home', icon: '🏠', category: 'Overview' },
    {
      path: '/state',
      label: 'State (Signals)',
      icon: '⚡',
      category: 'Core Concepts',
    },
    {
      path: '/side-effects',
      label: 'Side Effects',
      icon: '🔄',
      category: 'Core Concepts',
    },
    {
      path: '/forms',
      label: 'Forms',
      icon: '📝',
      category: 'Core Concepts',
    },
    {
      path: '/performance',
      label: 'Performance',
      icon: '🚀',
      category: 'Optimization',
    },
    {
      path: '/data-fetching',
      label: 'Data Fetching',
      icon: '🌐',
      category: 'Data & APIs',
    },
    {
      path: '/state-management',
      label: 'State Management',
      icon: '🗄️',
      category: 'Data & APIs',
    },
    {
      path: '/schema-validation',
      label: 'Schema Validation',
      icon: '✅',
      category: 'Data & APIs',
    },
    {
      path: '/ssr-comparison',
      label: 'SSR Comparison',
      icon: '🖥️',
      category: 'Advanced',
    },
    {
      path: '/browser-apis',
      label: 'Browser APIs',
      icon: '🔧',
      category: 'Advanced',
    },
  ];

  get categories(): string[] {
    return [...new Set(this.navItems.map((item) => item.category ?? ''))];
  }

  getItemsByCategory(category: string): NavItem[] {
    return this.navItems.filter((item) => item.category === category);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
