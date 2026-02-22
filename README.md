# Angular Master — React to Angular Guide

> A hands-on, interactive learning platform for React developers who want to understand Angular syntax, patterns, and concepts through direct side-by-side comparison.

---

## What is Angular Master?

**Angular Master** is an educational web application built with Angular 21 + SSR, designed specifically for developers coming from a React background. Rather than teaching Angular from scratch, it maps every core concept you already know from React to its Angular equivalent — with live interactive demos, syntax comparisons, and real-world code examples.

If you know React, you already understand _what_ needs to happen. This app shows you _how Angular does it_.

---

## What the App Covers

The platform is organized into **9 learning sections**, each containing:

- ✅ A **live interactive demo** you can interact with directly in the browser
- 📊 **Side-by-side code comparisons** (React on the left, Angular on the right)
- 💡 **Key concept explanations** highlighting the mental model shift
- 📝 **Annotated code snippets** you can copy and use immediately

### Section Overview

| #   | Topic                        | React Concept                                 | Angular Equivalent                                     |
| --- | ---------------------------- | --------------------------------------------- | ------------------------------------------------------ |
| 1   | **State (Signals)**          | `useState`, `useMemo`, `useReducer`           | `signal()`, `computed()`, `linkedSignal()`             |
| 2   | **Side Effects & Lifecycle** | `useEffect`, component lifecycle              | `ngOnInit`, `ngOnDestroy`, `effect()`                  |
| 3   | **Forms**                    | React Hook Form, controlled inputs            | Reactive Forms, `FormBuilder`, validators              |
| 4   | **Performance**              | `React.memo`, `useMemo`, `useCallback`        | OnPush, Pure Pipes, `computed()`, `trackBy`            |
| 5   | **Data Fetching**            | `fetch`, SWR, React Query                     | `HttpClient`, RxJS, `AsyncPipe`                        |
| 6   | **State Management**         | Zustand, Redux Toolkit, Context API           | NgRx, Signal Stores, services with signals             |
| 7   | **Schema Validation**        | Zod, Yup                                      | Angular Reactive Form validators                       |
| 8   | **SSR Comparison**           | Next.js App Router, server components         | Angular SSR, `hydration`, `TransferState`              |
| 9   | **Browser APIs**             | `typeof window`, `useRef`, `useEffect` guards | `PLATFORM_ID`, `isPlatformBrowser`, `inject(DOCUMENT)` |

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

## Additional Resources

- [Angular Official Docs](https://angular.dev)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular SSR Guide](https://angular.dev/guide/ssr)
- [RxJS Documentation](https://rxjs.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
