import { Component } from '@angular/core';
import { SectionPageComponent } from '@shared/section-page/section-page.component';
import { ComparisonCardComponent } from '@shared/comparison-card/comparison-card.component';

@Component({
  selector: 'app-ssr-comparison',
  imports: [SectionPageComponent, ComparisonCardComponent],
  templateUrl: './ssr-comparison.component.html',
  styleUrl: '../sections.shared.css',
})
export class SsrComparisonComponent {
  readonly nextjsSetup = `// Next.js — file-based routing with SSR
// pages/index.tsx (Pages Router)
export async function getServerSideProps(context) {
  const data = await fetch('https://api.example.com/data');
  return { props: { data } }; // Fetched on the SERVER
}

// OR with App Router (Next.js 13+):
// app/page.tsx — Server Component by default
async function HomePage() {
  const data = await fetch('/api/data'); // Server-only fetch
  return <div>{data.title}</div>;
}

// Client component opt-in:
'use client';
export default function Counter() { /* has state */ }`;

  readonly angularSsrSetup = `// Angular Universal / Angular SSR
// angular.json configures SSR automatically with:
// ng add @angular/ssr

// server.ts — Express server that renders Angular
import { App } from './app';
import { renderApplication } from '@angular/platform-server';

// app.routes.server.ts — server-side routes
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'api/**', renderMode: RenderMode.Server },
  { path: '**',     renderMode: RenderMode.Prerender },
];

// Render modes:
// RenderMode.Server    — SSR on each request (like getServerSideProps)
// RenderMode.Prerender — Static Generation (like getStaticProps)
// RenderMode.Client    — CSR, skip SSR for this route`;

  readonly hydrationNext = `// Next.js Hydration — automatic
// React Server Components: zero JS bundle for server components
// Client components: hydrated automatically

// Streaming with Suspense:
import { Suspense } from 'react';
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  );
}

// Next.js metadata API for SEO:
export const metadata = {
  title: 'My Page',
  description: 'Page description for SEO',
};`;

  readonly hydrationAngular = `// Angular Hydration — withEventReplay()
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()), // Captures events during hydration
    provideRouter(routes),
  ]
};

// SSR-safe code — check platform before using browser APIs
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WindowService {
  private platformId = inject(PLATFORM_ID);

  getWidth(): number {
    // isPlatformBrowser prevents SSR crashes
    return isPlatformBrowser(this.platformId) ? window.innerWidth : 0;
  }
}`;

  readonly nextjsDataFetch = `// Next.js data fetching patterns
// Server-side only (SSR):
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/user');
  const user = await res.json();
  return { props: { user } };
}

// Static Generation (SSG):
export async function getStaticProps() {
  const posts = await getPosts();
  return { props: { posts }, revalidate: 60 }; // ISR
}

// App Router — just async components:
async function UserPage({ params }) {
  const user = await getUser(params.id); // Cached fetch
  return <div>{user.name}</div>;
}`;

  readonly angularSsrDataFetch = `// Angular SSR data fetching with TransferState
import { HttpClient } from '@angular/common/http';
import { makeStateKey, TransferState } from '@angular/core';

const USER_KEY = makeStateKey<User>('user');

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private state = inject(TransferState);

  getUser(id: string): Observable<User> {
    // On server: fetch and cache in TransferState
    // On client: read from TransferState (no double fetch!)
    return this.http.get<User>(\`/api/users/\${id}\`);
    // Angular's withFetch() + TransferState handles deduplication
  }
}

// app.config.ts — enable HTTP transfer cache
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
  ]
};`;
}
