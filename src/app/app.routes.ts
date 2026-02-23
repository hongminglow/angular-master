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
      {
        path: 'routing',
        loadComponent: () =>
          import('./pages/sections/routing/routing.component').then((m) => m.RoutingComponent),
      },
      {
        path: 'component-communication',
        loadComponent: () =>
          import('./pages/sections/component-communication/component-communication.component').then(
            (m) => m.ComponentCommunicationComponent,
          ),
      },
      {
        path: 'template-syntax',
        loadComponent: () =>
          import('./pages/sections/template-syntax/template-syntax.component').then(
            (m) => m.TemplateSyntaxComponent,
          ),
      },
      {
        path: 'dependency-injection',
        loadComponent: () =>
          import('./pages/sections/dependency-injection/dependency-injection.component').then(
            (m) => m.DependencyInjectionComponent,
          ),
      },
      {
        path: 'pipes',
        loadComponent: () =>
          import('./pages/sections/pipes/pipes.component').then((m) => m.PipesComponent),
      },
      {
        path: 'directives',
        loadComponent: () =>
          import('./pages/sections/directives/directives.component').then(
            (m) => m.DirectivesComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
