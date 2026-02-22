import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable, catchError, of, startWith, switchMap, BehaviorSubject } from 'rxjs';
import { SectionPageComponent } from '@shared/section-page/section-page.component';
import { ComparisonCardComponent } from '@shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '@shared/code-block/code-block.component';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-data-fetching',
  imports: [
    CommonModule,
    AsyncPipe,
    SectionPageComponent,
    ComparisonCardComponent,
    CodeBlockComponent,
  ],
  templateUrl: './data-fetching.component.html',
  styleUrl: '../sections.shared.css',
})
export class DataFetchingComponent implements OnInit {
  private readonly http = inject(HttpClient);

  // Signal-based fetch state
  readonly postState = signal<FetchState<Post[]>>({ data: null, loading: false, error: null });
  readonly selectedPostId = signal(1);

  // Observable-based approach with AsyncPipe
  private readonly postId$ = new BehaviorSubject<number>(1);
  readonly post$: Observable<FetchState<Post>> = this.postId$.pipe(
    switchMap((id) =>
      this.http.get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`).pipe(
        switchMap((data) => of({ data, loading: false, error: null })),
        startWith({ data: null, loading: true, error: null }),
        catchError((err) => of({ data: null, loading: false, error: err.message })),
      ),
    ),
  );

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.postState.set({ data: null, loading: true, error: null });
    this.http
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .pipe(catchError(() => of(null)))
      .subscribe({
        next: (data) => this.postState.set({ data, loading: false, error: null }),
        error: (err) => this.postState.set({ data: null, loading: false, error: err.message }),
      });
  }

  changePost(delta: number): void {
    const next = Math.max(1, Math.min(100, this.selectedPostId() + delta));
    this.selectedPostId.set(next);
    this.postId$.next(next);
  }

  // ===== CODE SNIPPETS =====
  readonly reactFetch = `// React — standard fetch / axios
import { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}`;

  readonly angularHttpClient = `// Angular — HttpClient (built-in, no axios needed)
import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
  template: \`
    @if (postState().loading) { <p>Loading...</p> }
    @if (postState().error) { <p>Error: {{ postState().error }}</p> }
    @if (postState().data) {
      @for (post of postState().data; track post.id) {
        <div>{{ post.title }}</div>
      }
    }
  \`
})
export class PostListComponent implements OnInit {
  private http = inject(HttpClient);
  postState = signal({ data: null, loading: false, error: null });

  ngOnInit() { this.fetchPosts(); }

  fetchPosts() {
    this.postState.set({ data: null, loading: true, error: null });
    this.http.get<Post[]>('/api/posts').pipe(
      catchError(err => of(null))
    ).subscribe({
      next: data => this.postState.set({ data, loading: false, error: null }),
      error: err => this.postState.set({ data: null, loading: false, error: err.message }),
    });
  }
}`;

  readonly tanstackQueryReact = `// React — TanStack Query (server-state management)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function PostList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const queryClient = useQueryClient();
  const createPost = useMutation({
    mutationFn: (data) => fetch('/api/posts', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return <ul>{data.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}`;

  readonly angularObservable = `// Angular — Observable + AsyncPipe (auto-subscribes and unsubscribes)
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, startWith, catchError, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Component({
  imports: [AsyncPipe, CommonModule],
  template: \`
    @if (post$ | async; as state) {
      @if (state.loading) { <p>Loading...</p> }
      @if (state.data) { <p>{{ state.data.title }}</p> }
    }
    <!-- AsyncPipe auto-unsubscribes on destroy! -->
  \`
})
export class PostComponent {
  private http = inject(HttpClient);
  private id$ = new BehaviorSubject<number>(1);

  // Observable pipeline — like TanStack Query but with RxJS
  post$ = this.id$.pipe(
    switchMap(id =>
      this.http.get<Post>(\`/api/posts/\${id}\`).pipe(
        switchMap(data => of({ data, loading: false, error: null })),
        startWith({ data: null, loading: true, error: null }),
        catchError(err => of({ data: null, loading: false, error: err.message })),
      )
    )
  );

  changeId(id: number) { this.id$.next(id); }
}`;

  readonly httpServicePattern = `// Angular — Best practice: HTTP Service + component
// services/post.service.ts
@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private baseUrl = '/api/posts';

  // Returns Observable<Post[]> — lazy, only fetches when subscribed
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(\`\${this.baseUrl}/\${id}\`);
  }

  createPost(body: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>(this.baseUrl, body);
  }

  updatePost(id: number, body: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(\`\${this.baseUrl}/\${id}\`, body);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.baseUrl}/\${id}\`);
  }
}`;
}
