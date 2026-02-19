# Coding Conventions

**Analysis Date:** 2026-02-19

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `ContactForm.tsx`, `ErrorBoundary.tsx`)
- Utility/data files: camelCase (e.g., `validate.ts`, `schema.ts`, `rate-limit.ts`)
- Data/type definition files: camelCase (e.g., `site.ts`, `conditions/types.ts`)
- Page components: PascalCase in `src/pages/` (e.g., `Home.tsx`, `Contact.tsx`)
- Subdirectories: kebab-case (e.g., `src/components/conditions/`, `src/data/conditions/`)

**Functions:**
- Component functions: PascalCase (exported default)
- Utility/helper functions: camelCase (e.g., `validateContactForm`, `getGroupedConditions`, `organizationSchema`)
- Action/handler functions: camelCase with `handle` prefix (e.g., `handleSubmit`, `handleRefresh`)

**Variables:**
- State: camelCase with descriptive names (e.g., `isMenuOpen`, `hasError`, `loading`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_MESSAGE_LENGTH`, `SITE_URL`, `RATE_LIMIT_WINDOW`)
- CSS classes from Tailwind: kebab-case in className attributes
- React refs: camelCase with `Ref` suffix (e.g., `conditionsRef`, `conditionsButtonRef`)

**Types:**
- Interfaces: PascalCase with `Props` suffix for component props (e.g., `HeroProps`, `ContactFormData`)
- Discriminated union types: PascalCase (e.g., `ConditionCategory`)
- Type enums: UPPER_SNAKE_CASE keys (e.g., `CATEGORY_LABELS`, `CATEGORY_ORDER`)

## Code Style

**Formatting:**
- No explicit formatter configured (no .prettierrc file detected)
- ESLint is configured with TypeScript ESLint and React plugins
- Follows standard ES2020+ conventions
- Consistent 2-space indentation (inferred from project structure)

**Linting:**
- Tool: ESLint 9.9.1 with TypeScript ESLint
- Config: `eslint.config.js` uses flat config format
- Key rules:
  - React Hooks: `eslint-plugin-react-hooks` recommended rules enabled
  - React Refresh: `react-refresh/only-export-components` set to warn (allows constant exports)
  - No custom rule overrides beyond React plugin defaults

## Import Organization

**Order:**
1. External packages (React, React Router, third-party libraries)
2. Internal utilities and data (from `../data/`, `../lib/`, `../hooks/`)
3. Internal components (from `../components/`)
4. Type imports (from local types or `../data/conditions/types.ts`)

**Examples:**
```typescript
// Order 1: External packages
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Order 2: Internal data/utilities
import { SITE } from '../data/site';
import { validateContactForm } from '../lib/validate';

// Order 3: Internal components
import Header from './Header';
```

**Path Aliases:**
- No path aliases configured (uses relative paths throughout)
- Absolute imports not used

**Barrel Files:**
- Minimal barrel file usage
- Each component/utility imported individually, not from index files

## Error Handling

**Patterns:**
- Try-catch blocks for async operations (forms, API calls)
- Validation: Custom `validateContactForm()` function in `src/lib/validate.ts` returns `ValidationResult` interface with `ok` boolean
- Server-side validation: Cloudflare Pages Functions validate email, name, message length with specific error messages
- Client-side error display: Error state in component `useState` with fallback messages
- HTML escaping in email templates: `escapeHtml()` function in `form-handler.ts` to prevent injection

**Examples:**
```typescript
// Form validation
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    const response = await fetch('/api/form-handler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    navigate('/thanks');
  } catch (err) {
    console.error('Contact form error:', err);
    setError('Failed to send. Please check your connection or call us directly.');
    setLoading(false);
  }
};

// Server-side validation (form-handler.ts)
if (!emailRegex.test(email)) {
  return new Response(JSON.stringify({ error: 'Invalid email format' }), {
    status: 400,
    headers,
  });
}
```

## Logging

**Framework:** `console` API (no logging library)

**Patterns:**
- Error logging: `console.error()` in catch blocks, `logError()` utility
- Info logging: `console.log()` for debug info, `logInfo()` utility
- Sanitization: Custom `logError()` and `logInfo()` utilities in `src/lib/log.ts` scrub PII (email, phone, message, name) before logging
- Server-side logging: Console output in Cloudflare Pages Functions for errors only

**Examples:**
```typescript
// From src/lib/log.ts - sanitizes PII before logging
export function logError(err: Error, context: Record<string, any> = {}) {
  const safe = { ...context };
  delete safe.email;
  delete safe.phone;
  delete safe.message;
  delete safe.name;
  console.error(err, safe);
}

// Usage
console.error('Contact form error:', err);
logError(error, { userId, timestamp });
```

## Comments

**When to Comment:**
- JSDoc comments on utility functions and schema generators
- Inline comments for business logic quirks (e.g., form submission flow, condition filtering)
- Header comments for files with complex logic (e.g., schema.ts, form-handler.ts marked with "Schema.org structured data generators")

**JSDoc/TSDoc:**
- Limited JSDoc usage; primarily on schema generators and utility functions
- Pattern: `/** Description */` for functions
- Interface documentation: Minimal; types are self-documenting
- Example from `src/lib/schema.ts`:
  ```typescript
  /**
   * Schema.org structured data generators
   * All values are derived from the SITE config - no hardcoded office-specific data
   */
  ```

## Function Design

**Size:**
- Most functions are 10-50 lines (validation functions ~25 lines, component handlers ~35 lines)
- Complex generators (e.g., `organizationSchema()`) can be 50+ lines but follow clear structure

**Parameters:**
- Props passed as single object parameter: `function Hero({ title, subtitle, ctaText, ctaLink, backgroundImage }: HeroProps)`
- Destructuring used for clarity
- Optional parameters marked in interfaces: `ctaText?: string`
- No optional function parameters; use interfaces instead

**Return Values:**
- React components: Return JSX
- Utilities: Return typed objects (e.g., `ValidationResult`, schema objects)
- Generators: Return structured objects matching Schema.org standard or custom types
- Handlers: Return JSON responses from Cloudflare Pages Functions

**Example:**
```typescript
// Well-defined parameter structure
export default function Hero({ title, subtitle, ctaText, ctaLink, backgroundImage }: HeroProps) {
  return (
    <section className={...}>
      {/* JSX content */}
    </section>
  );
}

// Validation returns typed result
export function validateContactForm(data: ContactFormData): ValidationResult {
  if (!data.name) {
    return { ok: false, error: 'Name is required.' };
  }
  return { ok: true };
}
```

## Module Design

**Exports:**
- Component files: Default export of component function
- Utility files: Named exports for functions
- Data files: Named exports for constants (e.g., `export const SITE = {...}`)
- Type files: Named exports for types and type enums

**Examples:**
```typescript
// src/components/Hero.tsx - default export
export default function Hero({ ... }: HeroProps) { ... }

// src/lib/validate.ts - named exports
export interface ContactFormData { ... }
export interface ValidationResult { ... }
export function validateContactForm(data: ContactFormData): ValidationResult { ... }

// src/data/site.ts - named export of constant
export const SITE = { ... }
```

**Barrel Files:**
- Not used systematically; each component/utility imported individually
- Condition components are organized in subdirectories but not re-exported via index

## Specific Patterns

**State Management:**
- React `useState()` for local component state
- No Redux, Zustand, or other state management libraries
- Form state: Input values read directly from FormData on submit
- Navigation state: useLocation hook from React Router

**Conditional Rendering:**
- Ternary operators for simple conditions
- Logical AND operators for conditional display: `{isOpen && <Content />}`
- Error state display: Check state and render alert div with accessibility attributes

**Accessibility:**
- Semantic HTML: `<main>`, `<header>`, `<nav>`, `<section>`, `<article>`
- Form labels paired with inputs using `htmlFor`
- ARIA attributes: `role="alert"`, `aria-live="assertive"` on error messages
- Skip link: `<a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>`
- Focus management: `tabIndex={-1}` on main element, restored focus after navigation

**Forms:**
- Client-side validation before submit
- Server-side validation re-checks everything
- Honeypot field: `company` field in form data (if filled, validation passes; if empty, real validation runs)
- Input constraints: `maxLength`, `minLength`, `required` attributes
- Form data collected via `new FormData()` API, not controlled inputs

**Data Centralization:**
- `src/data/site.ts`: Single source of truth for all business info, hours, contacts, doctor info
- Schema generators: All driven from SITE constant, no hardcoded data
- Page components: Import SITE and use its data directly
- Condition pages: Each condition has its own `.ts` file in `src/data/conditions/` with `ConditionPageData` structure

---

*Convention analysis: 2026-02-19*
