# Testing Patterns

**Analysis Date:** 2026-02-19

## Test Framework

**Status:** Not detected

**Current State:**
- No test framework configured (no jest.config.*, vitest.config.*, or test scripts in package.json)
- No test files present in source code (no `*.test.ts`, `*.spec.ts` files)
- No testing dependencies listed (no `jest`, `vitest`, `@testing-library/*`, etc.)

**Recommendation:**
If testing is needed, consider:
- **Unit/Component Testing:** Vitest + React Testing Library (lightweight, Vite-native)
- **E2E Testing:** Playwright or Cypress (already has form handlers and chat endpoints to test)
- **Serverless Function Testing:** Direct HTTP requests to Cloudflare Pages Functions

## Test File Organization

**Location:** Not applicable (no tests present)

**Suggested Structure (if implementing):**
```
src/
├── components/
│   ├── ContactForm.tsx
│   └── ContactForm.test.tsx          # Co-located with component
├── lib/
│   ├── validate.ts
│   └── validate.test.ts              # Co-located with utility
└── data/
    └── site.ts                        # Data files may not need tests
functions/
├── api/
│   ├── form-handler.ts
│   └── form-handler.test.ts           # Co-located serverless test
```

**Pattern:** Co-located tests next to implementation files (easier to maintain together)

## Test Structure (Recommended Pattern)

If implementing tests, follow this structure:

### Unit Tests (for utilities like validation)

```typescript
// src/lib/validate.test.ts
import { describe, it, expect } from 'vitest';
import { validateContactForm } from './validate';

describe('validateContactForm', () => {
  it('should validate a proper contact form submission', () => {
    const result = validateContactForm({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message',
    });
    expect(result.ok).toBe(true);
  });

  it('should reject missing required fields', () => {
    const result = validateContactForm({
      name: '',
      email: 'john@example.com',
      message: 'Test',
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Name');
  });

  it('should reject invalid email format', () => {
    const result = validateContactForm({
      name: 'John Doe',
      email: 'not-an-email',
      message: 'Test message',
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain('email');
  });

  it('should enforce message length limits', () => {
    const result = validateContactForm({
      name: 'John',
      email: 'john@test.com',
      message: 'a'.repeat(2001), // exceeds MAX_MESSAGE_LENGTH
    });
    expect(result.ok).toBe(false);
  });

  it('should pass honeypot validation when company field is filled', () => {
    const result = validateContactForm({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test',
      company: 'Some Company',
    });
    expect(result.ok).toBe(true);
  });
});
```

### Component Tests (React Testing Library pattern)

```typescript
// src/components/ContactForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContactForm from './ContactForm';

describe('ContactForm Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ContactForm />
      </BrowserRouter>
    );
  };

  it('should render form fields', () => {
    renderComponent();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('should display validation error when submission fails', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Network error'))));
    renderComponent();

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('should show loading state while submitting', async () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/sending/i)).toBeInTheDocument();
    });
  });
});
```

### Serverless Function Tests (integration pattern)

```typescript
// functions/api/form-handler.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Form Handler Function', () => {
  it('should reject requests with invalid email', async () => {
    const env = {
      RESEND_API_KEY: 'test-key',
      NOTIFICATION_EMAIL: 'test@example.com',
    };

    const request = new Request('https://example.com/api/form-handler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'not-an-email',
        message: 'Test',
      }),
    });

    const context = { request, env };
    const response = await onRequestPost(context);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Invalid email');
  });

  it('should rate limit requests', async () => {
    const env = {
      RESEND_API_KEY: 'test-key',
      NOTIFICATION_EMAIL: 'test@example.com',
    };

    const makeRequest = () =>
      new Request('https://example.com/api/form-handler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John',
          email: 'john@example.com',
          message: 'Test message',
        }),
      });

    // Make more than MAX_REQUESTS in RATE_LIMIT_WINDOW
    for (let i = 0; i < 15; i++) {
      const context = { request: makeRequest(), env };
      const response = await onRequestPost(context);

      if (i >= 10) {
        expect(response.status).toBe(429);
      }
    }
  });

  it('should send notification email to owner', async () => {
    const sendEmailMock = vi.fn().mockResolvedValue({ id: 'email-123' });

    const env = {
      RESEND_API_KEY: 'test-key',
      NOTIFICATION_EMAIL: 'owner@example.com',
    };

    const request = new Request('https://example.com/api/form-handler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _formType: 'contact',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'I have a question',
      }),
    });

    vi.mock('resend', () => ({
      Resend: vi.fn(() => ({
        emails: { send: sendEmailMock },
      })),
    }));

    // Note: This is a simplified example; actual testing would require
    // mocking the Resend SDK or using a test environment
  });
});
```

## Mocking

**Framework:** Not configured, but if implementing, use Vitest's `vi` object

**Patterns:**

### Mocking Fetch (most common need)

```typescript
import { vi } from 'vitest';

// Mock successful response
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve(
    new Response(JSON.stringify({ success: true }), { status: 200 })
  )
));

// Mock error response
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.reject(new Error('Network error'))
));

// Reset after test
vi.unstubAllGlobals();
```

### Mocking React Router

```typescript
import { useNavigate } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// In test
const mockNavigate = vi.fn();
(useNavigate as any).mockReturnValue(mockNavigate);
```

### Mocking Cloudflare Env

```typescript
// For testing Cloudflare Pages Functions
const mockEnv: Env = {
  RESEND_API_KEY: 'test-key',
  NOTIFICATION_EMAIL: 'test@example.com',
  BREVO_API_KEY: 'brevo-key',
};

const mockContext = {
  request: new Request('...'),
  env: mockEnv,
};
```

**What to Mock:**
- External APIs (Resend, Brevo, OpenAI)
- Fetch calls
- Browser APIs (localStorage, window, etc.)
- React Router navigation

**What NOT to Mock:**
- Validation functions (test the real logic)
- Local utilities (test the real implementation)
- React hooks like useState (test via component behavior)

## Fixtures and Factories

**Test Data:**

### Valid Form Data Factory

```typescript
// tests/factories.ts
export const createValidContactForm = (overrides = {}) => ({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '(555) 555-5555',
  message: 'This is a valid test message',
  ...overrides,
});

export const createValidGuideForm = (overrides = {}) => ({
  firstName: 'Jane',
  email: 'jane@example.com',
  _guideId: 'rhkn-guide',
  _formType: 'guide',
  ...overrides,
});
```

### Environment Fixtures

```typescript
// tests/fixtures/env.ts
export const mockEnv = {
  RESEND_API_KEY: 'test-key-resend',
  NOTIFICATION_EMAIL: 'owner@example.com',
  BREVO_API_KEY: 'test-key-brevo',
  OPENAI_API_KEY: 'test-key-openai',
};
```

**Location:** Suggested at `tests/` directory (not currently present)

## Coverage

**Requirements:** Not enforced

**Recommended Targets (if implementing):**
- Utility functions: 80%+ coverage
- Components: 60%+ coverage (easier to test user interactions)
- Serverless functions: 90%+ coverage (critical for form/API endpoints)
- Overall: 70%+ for critical paths

**View Coverage:**
```bash
npm run test:coverage    # Command would need to be added to package.json
```

## Test Types

**Unit Tests:**
- Scope: Individual functions (validation, utilities, helpers)
- Approach: Test inputs and outputs, edge cases, error conditions
- Framework: Vitest
- Example: `validateContactForm()` with various input combinations

**Integration Tests:**
- Scope: Cloudflare Pages Functions, form submission flow, API interactions
- Approach: Mock external APIs (Resend, Brevo) but test the full handler logic
- Framework: Vitest + custom request/response mocks
- Example: Form submission → validation → email sending

**E2E Tests:**
- Scope: Full user workflows (fill form → submit → see thank you page)
- Framework: Not currently implemented; suggest Playwright
- Example: Navigate to contact page → fill form → submit → verify redirect to /thanks

**API Route Tests:**
- Scope: Cloudflare Pages Functions endpoints
- Approach: Direct request/response testing
- Example: POST /api/form-handler with various payloads

## Common Patterns

**Async Testing:**

```typescript
// Using async/await
it('should handle async form submission', async () => {
  vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve(new Response(JSON.stringify({ success: true })))
  ));

  const form = screen.getByRole('button', { name: /send/i });
  fireEvent.click(form);

  await waitFor(() => {
    expect(screen.getByText(/thank you/i)).toBeInTheDocument();
  });
});

// Using `.then()`
it('should send email on successful submission', () => {
  const sendMock = vi.fn().mockResolvedValue({ id: 'email-123' });

  return sendMock()
    .then(result => {
      expect(result.id).toBe('email-123');
    });
});
```

**Error Testing:**

```typescript
it('should handle validation errors gracefully', () => {
  const result = validateContactForm({
    name: '',
    email: 'test@example.com',
    message: 'Message',
  });

  expect(result.ok).toBe(false);
  expect(result.error).toBeDefined();
  expect(result.error).toMatch(/name/i);
});

it('should display error alert when API fails', async () => {
  vi.stubGlobal('fetch', vi.fn(() =>
    Promise.reject(new Error('Server error'))
  ));

  renderComponent();
  fireEvent.click(screen.getByRole('button', { name: /send/i }));

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(/failed to send/i);
  });
});

it('should handle rate limiting (429 response)', async () => {
  vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 })
    )
  ));

  // Test that component handles 429 gracefully
});
```

**Form Testing:**

```typescript
it('should collect form data correctly', () => {
  const form = screen.getByRole('form') as HTMLFormElement;
  const formData = new FormData(form);

  expect(formData.get('name')).toBe('John Doe');
  expect(formData.get('email')).toBe('john@example.com');
});

it('should enforce input constraints', () => {
  const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
  expect(nameInput.maxLength).toBe(120);

  const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;
  expect(messageInput.minLength).toBe(10);
  expect(messageInput.maxLength).toBe(2000);
});
```

---

*Testing analysis: 2026-02-19*

## Implementation Recommendation

Currently, this project has **zero test coverage**. Before writing tests, prioritize:

1. **Critical Path (Immediate):**
   - `src/lib/validate.ts` - Form validation logic
   - `functions/api/form-handler.ts` - Email submission and Resend/Brevo integration
   - `functions/api/chat.ts` - Rate limiting and OpenAI chatbot logic

2. **High Value (Medium Priority):**
   - `src/components/ContactForm.tsx` - User-facing form submission
   - `src/components/GuideForm.tsx` - Guide download flow
   - Core component rendering

3. **Nice to Have (Lower Priority):**
   - Page components (lower risk, mostly composition)
   - Utility functions like `getGroupedConditions()`
   - Schema generators (low change frequency)

**Quick Start (if implementing):**

```bash
# Install Vitest + React Testing Library
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom

# Add to package.json scripts
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage"

# Create first test
npm run test
```
