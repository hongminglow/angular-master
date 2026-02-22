import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SectionCard {
  path: string;
  title: string;
  icon: string;
  description: string;
  reactEquivalent: string;
  angularConcept: string;
  color: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly sections: SectionCard[] = [
    {
      path: '/state',
      title: 'State (Signals)',
      icon: '⚡',
      description: 'Angular Signals vs React useState — fine-grained reactivity without VDOM',
      reactEquivalent: 'useState, useReducer',
      angularConcept: 'signal(), computed(), effect()',
      color: '#f59e0b',
    },
    {
      path: '/side-effects',
      title: 'Side Effects',
      icon: '🔄',
      description: 'Lifecycle hooks and effect() vs React useEffect',
      reactEquivalent: 'useEffect, useLayoutEffect',
      angularConcept: 'effect(), ngOnInit, ngOnDestroy',
      color: '#3b82f6',
    },
    {
      path: '/forms',
      title: 'Forms',
      icon: '📝',
      description: 'Angular Reactive Forms vs react-hook-form — type-safe validation',
      reactEquivalent: 'react-hook-form, Formik',
      angularConcept: 'FormBuilder, FormGroup, Validators',
      color: '#10b981',
    },
    {
      path: '/performance',
      title: 'Performance',
      icon: '🚀',
      description: 'useMemo/useCallback vs OnPush, Pure Pipes, trackBy',
      reactEquivalent: 'useMemo, useCallback, React.memo',
      angularConcept: 'OnPush, Pure Pipe, trackBy',
      color: '#ec4899',
    },
    {
      path: '/data-fetching',
      title: 'Data Fetching',
      icon: '🌐',
      description: "HttpClient vs fetch/axios — Angular's built-in HTTP layer",
      reactEquivalent: 'fetch, axios, TanStack Query',
      angularConcept: 'HttpClient, Observable, AsyncPipe',
      color: '#8b5cf6',
    },
    {
      path: '/state-management',
      title: 'State Management',
      icon: '🗄️',
      description: 'NgRx / Angular Services vs Zustand — global reactive stores',
      reactEquivalent: 'Zustand, Redux Toolkit',
      angularConcept: 'Services + Signals, NgRx',
      color: '#06b6d4',
    },
    {
      path: '/schema-validation',
      title: 'Schema Validation',
      icon: '✅',
      description: 'Angular Validators vs Zod/Yup — built-in and custom validation',
      reactEquivalent: 'Zod, Yup',
      angularConcept: 'Validators, AbstractControl, Custom Validators',
      color: '#84cc16',
    },
    {
      path: '/ssr-comparison',
      title: 'SSR Comparison',
      icon: '🖥️',
      description: 'Angular Universal vs Next.js — SSR strategies compared',
      reactEquivalent: 'Next.js (getServerSideProps, RSC)',
      angularConcept: 'Angular Universal, SSR, Hydration',
      color: '#f97316',
    },
    {
      path: '/browser-apis',
      title: 'Browser APIs',
      icon: '🔧',
      description: 'LocalStorage, PLATFORM_ID, SSR-safe browser API usage',
      reactEquivalent: 'useRef, useEffect for SSR guards',
      angularConcept: 'PLATFORM_ID, isPlatformBrowser, Inject',
      color: '#ef4444',
    },
  ];
}
