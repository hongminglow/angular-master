# Angular Master — React to Angular Guide

> A hands-on, interactive learning platform for React developers who want to understand Angular syntax, patterns, and concepts through direct side-by-side comparison.

---

## What is Angular Master?

**Angular Master** is an educational web application built with Angular 21 + SSR, designed specifically for developers coming from a React background. Rather than teaching Angular from scratch, it maps every core concept you already know from React to its Angular equivalent — with live interactive demos, syntax comparisons, and real-world code examples.

If you know React, you already understand _what_ needs to happen. This app shows you _how Angular does it_.

---

## What the App Covers

The platform is organized into **15 learning sections**, each containing:

- ✅ A **live interactive demo** you can interact with directly in the browser
- 📊 **Side-by-side code comparisons** (React on the left, Angular on the right)
- 💡 **Key concept explanations** highlighting the mental model shift
- 📝 **Annotated code snippets** you can copy and use immediately

### Section Overview

| #   | Topic                        | React Concept                                 | Angular Equivalent                                      |
| --- | ---------------------------- | --------------------------------------------- | ------------------------------------------------------- |
| 1   | **State (Signals)**          | `useState`, `useMemo`, `useReducer`           | `signal()`, `computed()`, `linkedSignal()`              |
| 2   | **Side Effects & Lifecycle** | `useEffect`, component lifecycle              | `ngOnInit`, `ngOnDestroy`, `effect()`                   |
| 3   | **Template Syntax**          | JSX ternary, `.map()`, `&&` operator          | `@if`, `@for`, `@switch`, `@defer`, `[class]`           |
| 4   | **Component Communication**  | `props`, `children`, render props             | `input()`, `output()`, `ng-content`, `model()`          |
| 5   | **Forms**                    | React Hook Form, controlled inputs            | Reactive Forms, `FormBuilder`, validators               |
| 6   | **Routing & Navigation**     | React Router, `useNavigate`, `useParams`      | `Router`, `routerLink`, `canActivate`, `loadComponent`  |
| 7   | **Dependency Injection**     | Context API, `useContext`, custom hooks       | `inject()`, `@Injectable`, `InjectionToken`             |
| 8   | **Pipes**                    | Inline JS, dayjs, `Intl` API                  | `DatePipe`, `CurrencyPipe`, `AsyncPipe`, custom `@Pipe` |
| 9   | **Directives**               | Custom hooks, HOCs, wrapper components        | `@Directive`, `@HostListener`, `hostDirectives`         |
| 10  | **Performance**              | `React.memo`, `useMemo`, `useCallback`        | OnPush, Pure Pipes, `computed()`, `trackBy`             |
| 11  | **Data Fetching**            | `fetch`, SWR, React Query                     | `HttpClient`, RxJS, `AsyncPipe`                         |
| 12  | **State Management**         | Zustand, Redux Toolkit, Context API           | NgRx, Signal Stores, services with signals              |
| 13  | **Schema Validation**        | Zod, Yup                                      | Angular Reactive Form validators                        |
| 14  | **SSR Comparison**           | Next.js App Router, server components         | Angular SSR, `hydration`, `TransferState`               |
| 15  | **Browser APIs**             | `typeof window`, `useRef`, `useEffect` guards | `PLATFORM_ID`, `isPlatformBrowser`, `inject(DOCUMENT)`  |

---

## Why This Exists

Angular and React solve the same problems — state, routing, forms, async data, SSR — but with very different philosophies:

- **React** is a library; you compose your own stack (Zustand, React Query, React Hook Form…)
- **Angular** is a framework; batteries included (HttpClient, Forms, Router, DI, SSR are all built-in)

The mental model shift is the hardest part. Angular Master bridges that gap by showing the direct translation of patterns you already use daily.

---

## Tech Stack

| Layer      | Technology                                       |
| ---------- | ------------------------------------------------ |
| Framework  | Angular 21 (Standalone Components)               |
| Reactivity | Angular Signals (`signal`, `computed`, `effect`) |
| Styling    | Tailwind CSS v4 + custom design tokens           |
| Rendering  | Server-Side Rendering (SSR) with `@angular/ssr`  |
| HTTP       | `HttpClient` + RxJS Observables                  |
| Forms      | Angular Reactive Forms                           |
| Auth       | Guard-based authentication with `AuthService`    |
| Fonts      | Inter (UI) + Fira Code (code snippets)           |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd angular-master

# Install dependencies
npm install
```

### Development Server

```bash
ng serve
# or
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser. The app auto-reloads on file changes.

### Production Build (with SSR)

```bash
ng build
```

The SSR-enabled build artifacts are output to `dist/angular-master/`.

### Run Tests

```bash
ng test
```

---

## Project Structure

```
src/app/
├── layout/
│   └── shell/              # App shell: sidebar + topbar layout
├── pages/
│   ├── home/               # Landing/overview page
│   ├── login/              # Authentication page
│   └── sections/           # Learning section pages
│       ├── state/          # Signals vs useState
│       ├── side-effects/   # effect() vs useEffect
│       ├── forms/          # Reactive Forms vs RHF
│       ├── performance/    # OnPush vs React.memo
│       ├── data-fetching/  # HttpClient vs React Query
│       ├── state-management/
│       ├── schema-validation/
│       ├── ssr-comparison/
│       └── browser-apis/
├── shared/
│   ├── section-page/       # Reusable section header wrapper
│   ├── comparison-card/    # Side-by-side code comparison component
│   └── code-block/         # Syntax-highlighted code display
├── services/
│   └── auth.service.ts     # Auth state & guard integration
└── guards/
    └── auth.guard.ts       # Route protection
```

---

## 💡 Side Note: Angular Syntax for React/Vue Developers

If you're coming from **React** or **Vue**, the `@Component` decorator might look like "boilerplate," but it's the core of how Angular works.

### Is the `@Component` decorator necessary?
**Yes.** In Angular, a class is just a class until you "decorate" it. The `@Component` decorator tells Angular: *"This class is a UI component, and here is how to render it."*

### Key Properties Explained:
| Property | What it does | React/Vue Equivalent |
| :--- | :--- | :--- |
| `selector` | The HTML tag name (e.g., `<app-shell>`). | The component name used in JSX/Templates. |
| `imports` | Explicitly lists dependencies (other components, pipes, etc.). | Standard `import` at the top of a React file. |
| `templateUrl` | Links to the HTML file for the UI. | The `render()` function or `<template>` block. |
| `styleUrl` | Links to the CSS file for styling. | Scoped CSS or CSS Modules. |

### "Is it like `defineOptions` in Vue?"
Very similar! In Vue, you might use `defineOptions` to set a component's name or inherit attributes. In Angular, `@Component` is the **single source of truth** for all component metadata. It's not just for dev tools; it serves as the bridge between your TypeScript logic and the HTML/CSS.

### ❓ Frequently Asked Questions

#### 1. Why separate HTML, CSS, and TS files?
*   **Is it a must?** No. You *can* use `template: '...'` and `styles: ['...']` directly in the `@Component` decorator for small components.
*   **Is it the standard?** Yes. For any non-trivial component, separation follows the **"Separation of Concerns"** principle. It keeps your logic (TS) clean and provides better tooling/syntax highlighting for your structure (HTML) and style (CSS).

#### 2. Why do I have to import things twice?
If you see an import at the top *and* in the `imports: []` array, here's why:
*   **Top `import` (TypeScript):** Telling the **editor/compiler** what the class is so it doesn't give you errors in the `.ts` file.
*   **`imports: []` array (Angular):** Telling the **Angular Template** that it has permission to use that component/directive inside its HTML. 
*   *Think of it like this: The top import is for the logic, and the array is for the UI.*

#### 3. Are components "Singletons"?
*   **No.** Every time you use a component's selector (e.g., `<app-card>`) in a template, Angular creates a **new instance** of that component. Each one has its own state, just like a React component instance.
*   **Services**, however, are often singletons (created once and shared) to manage global state or API logic.

#### 4. The "Angular Renaissance": Zone.js vs. Signals
If you see older Angular tutorials, they might look completely different. Here's why:
*   **The "Old" Way (Zone.js):** Angular used a library called Zone.js that watched every single event (clicks, timers, HTTP calls) and re-checked the whole UI tree. It was "automatic" but sometimes slow for large apps.
    *   *Syntax you might see in old tutorials:* `*ngIf`, `*ngFor`, and `NgModule`.
*   **The "New" Way (Signals):** Starting with Angular 16/17, Angular introduced **Signals**. Instead of re-checking everything, Signals allow Angular to know *exactly* which small part of the UI needs to update. It's much faster and more predictable.
    *   *Syntax you see in this app:* `@if`, `@for`, `signal()`, and `effect()`.

---

## Additional Resources

- [Angular Official Docs](https://angular.dev)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular SSR Guide](https://angular.dev/guide/ssr)
- [RxJS Documentation](https://rxjs.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
