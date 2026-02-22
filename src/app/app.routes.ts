import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'state',
        loadComponent: () =>
          import('./pages/sections/state/state.component').then((m) => m.StateComponent),
      },
      {
        path: 'side-effects',
        loadComponent: () =>
          import('./pages/sections/side-effects/side-effects.component').then(
            (m) => m.SideEffectsComponent,
          ),
      },
      {
        path: 'ssr-comparison',
        loadComponent: () =>
          import('./pages/sections/ssr-comparison/ssr-comparison.component').then(
            (m) => m.SsrComparisonComponent,
          ),
      },
      {
        path: 'forms',
        loadComponent: () =>
          import('./pages/sections/forms/forms.component').then((m) => m.FormsComponent),
      },
      {
        path: 'state-management',
        loadComponent: () =>
          import('./pages/sections/state-management/state-management.component').then(
            (m) => m.StateManagementComponent,
          ),
      },
      {
        path: 'schema-validation',
        loadComponent: () =>
          import('./pages/sections/schema-validation/schema-validation.component').then(
            (m) => m.SchemaValidationComponent,
          ),
      },
      {
        path: 'performance',
        loadComponent: () =>
          import('./pages/sections/performance/performance.component').then(
            (m) => m.PerformanceComponent,
          ),
      },
      {
        path: 'data-fetching',
        loadComponent: () =>
          import('./pages/sections/data-fetching/data-fetching.component').then(
            (m) => m.DataFetchingComponent,
          ),
      },
      {
        path: 'browser-apis',
        loadComponent: () =>
          import('./pages/sections/browser-apis/browser-apis.component').then(
            (m) => m.BrowserApisComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
