import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SectionPageComponent } from '@shared/section-page/section-page.component';
import { ComparisonCardComponent } from '@shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '@shared/code-block/code-block.component';

@Component({
  selector: 'app-routing',
  imports: [
    CommonModule,
    RouterLink,
    SectionPageComponent,
    ComparisonCardComponent,
    CodeBlockComponent,
  ],
  templateUrl: './routing.component.html',
  styleUrl: '../sections.shared.css',
})
export class RoutingComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Live demo state
  readonly currentUrl = signal(this.router.url);
  readonly queryParam = signal('');
  readonly demoRoutes = signal([
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/state', label: 'State', icon: '⚡' },
    { path: '/forms', label: 'Forms', icon: '📝' },
    { path: '/data-fetching', label: 'Data Fetching', icon: '🌐' },
  ]);

  navigateDemo(path: string): void {
    this.currentUrl.set(path);
  }

  // ===== CODE SNIPPETS =====
  readonly reactRouterSetup = `// React Router — routes defined as JSX components
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="home" element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}`;

  readonly angularRouterSetup = `// Angular Router — routes defined as config array
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell.component')
      .then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./pages/home.component')
          .then(m => m.HomeComponent),
      },
      {
        path: 'users/:id',
        loadComponent: () => import('./pages/user-detail.component')
          .then(m => m.UserDetailComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' }, // Wildcard fallback
];`;

  readonly reactNavigation = `// React Router — navigation hooks
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';

function UserList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') ?? '1';

  return (
    <div>
      {/* Declarative link (like <a>) */}
      <Link to="/users/42">User 42</Link>

      {/* Programmatic navigation */}
      <button onClick={() => navigate('/users/42')}>Go to User 42</button>
      <button onClick={() => navigate(-1)}>Go Back</button>

      {/* Query params */}
      <button onClick={() => setSearchParams({ page: '2' })}>Page 2</button>
    </div>
  );
}

function UserDetail() {
  const { id } = useParams(); // Route params
  return <h1>User {id}</h1>;
}`;

  readonly angularNavigation = `// Angular Router — navigation patterns
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  template: \`
    <!-- Declarative link (like <Link>) -->
    <a [routerLink]="['/users', 42]">User 42</a>

    <!-- Programmatic navigation -->
    <button (click)="goToUser(42)">Go to User 42</button>
    <button (click)="goBack()">Go Back</button>

    <!-- Query params -->
    <a [routerLink]="['/users']" [queryParams]="{ page: 2 }">
      Page 2
    </a>
  \`
})
export class UserListComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  goToUser(id: number) {
    this.router.navigate(['/users', id]);
  }

  goBack() {
    history.back(); // or use Location service
  }
}

// Reading route params:
@Component({ ... })
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  // Signal-based param access (Angular 18+):
  id = input.required<string>(); // via withComponentInputBinding()

  // Or Observable-based:
  ngOnInit() {
    this.route.params.subscribe(p => console.log(p['id']));
  }
}`;

  readonly reactGuards = `// React Router — no built-in guards, use wrapper components
function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Usage in route config:
<Route
  path="dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>`;

  readonly angularGuards = `// Angular — built-in route guards (first-class feature)
// guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Functional guard (Angular 15+) — just a function!
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login']); // Redirect
};

// Apply to routes:
{
  path: 'dashboard',
  loadComponent: () => import('./dashboard.component'),
  canActivate: [authGuard],  // Built-in guard support
}

// Other guard types:
// canDeactivate — confirm before leaving (unsaved changes)
// canMatch     — conditionally load routes
// resolve      — pre-fetch data before navigation`;

  readonly lazyLoadingAngular = `// Angular — lazy loading is built into the router
// Each route loads its component only when visited
export const routes: Routes = [
  {
    path: 'dashboard',
    // loadComponent() = React.lazy() + Suspense
    loadComponent: () => import('./dashboard.component')
      .then(m => m.DashboardComponent),
  },
  {
    path: 'admin',
    // loadChildren() = lazy-load an entire route group
    loadChildren: () => import('./admin/admin.routes')
      .then(m => m.adminRoutes),
  },
];

// React equivalent:
// const Dashboard = React.lazy(() => import('./Dashboard'));
// <Suspense fallback={<Loading />}>
//   <Route path="dashboard" element={<Dashboard />} />
// </Suspense>`;
}
