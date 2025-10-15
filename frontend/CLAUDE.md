# Frontend Development Instructions for Next.js Applications

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Mobile-First)
- **i18n**: next-intl

---

## Mobile-First Design Principles

### Core Approach

**Always design and develop for mobile first, then progressively enhance for larger screens.**

### Responsive Breakpoints
```
Mobile:    < 640px  (sm)  - Base/default styles
Tablet:    640-1024px (md-lg) - Enhanced layout
Desktop:   > 1024px (xl+) - Full features
```

### Mobile-First Rules

1. **Start with mobile layout** - All components default to mobile
2. **Touch-friendly targets** - Min 44x44px tap targets
3. **Readable text** - Min 16px base font size
4. **Optimized images** - Responsive images with proper srcset
5. **Stack by default** - Single column, stack elements vertically
6. **Progressive disclosure** - Show essential info first, expand on larger screens
7. **Performance** - Lazy load, optimize bundles, reduce payload

### Layout Patterns

```css
/* Mobile-first grid example */
.grid {
  grid-template-columns: 1fr;           /* Mobile: single column */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
  }
}
```

### Component Design

- **Cards**: Full width on mobile, grid on tablet+
- **Navigation**: Hamburger menu on mobile, full nav on desktop
- **Forms**: Single column on mobile, multi-column on desktop
- **Tables**: Horizontal scroll or card view on mobile
- **Modals**: Full-screen on mobile, centered on desktop

### Typography Scale

```
Mobile:
- h1: text-2xl (24px)
- h2: text-xl (20px)
- h3: text-lg (18px)
- body: text-base (16px)

Desktop:
- h1: text-4xl (36px)
- h2: text-3xl (30px)
- h3: text-2xl (24px)
- body: text-base (16px)
```

### Spacing

```
Mobile:   px-4, py-4  (16px padding)
Tablet:   px-6, py-6  (24px padding)
Desktop:  px-8, py-8  (32px padding)
```

### Testing

- Test on real devices when possible
- Use Chrome DevTools device emulation
- Test touch interactions, not just hover
- Verify performance on 3G networks

---

## File Structure

```
my-app/
├── app/
│   └── [locale]/                    # i18n wrapper
│       ├── layout.tsx
│       ├── page.tsx
│       └── dashboard/
│           ├── page.tsx
│           └── DashboardStats.tsx   # Page-specific (colocated)
│
├── components/
│   ├── ui/                          # Generic UI (Button, Modal)
│   ├── layout/                      # Header, Footer
│   └── features/                    # Reusable 2+ pages
│       ├── auth/
│       │   └── LoginForm.tsx
│       └── products/
│           └── ProductCard.tsx
│
├── lib/
│   ├── api/
│   │   ├── client.ts                # Base API client
│   │   ├── mock/
│   │   │   ├── users.ts             # Mock user data
│   │   │   ├── products.ts
│   │   │   └── auth.ts
│   │   ├── users.ts                 # User endpoints
│   │   ├── products.ts
│   │   └── auth.ts
│   │
│   ├── hooks/                       # useAuth, useUser
│   └── utils/
│
├── types/
│   ├── api.ts                       # Generic API types
│   ├── user.ts                      # User entity + DTOs
│   ├── product.ts
│   └── auth.ts
│
├── contexts/
│   └── AuthContext.tsx
│
├── messages/                        # i18n translations
│   ├── en.json
│   ├── ru.json
│   └── kk.json
│
├── config/
│   ├── api.ts
│   └── i18n.ts
│
├── middleware.ts                    # i18n routing
└── .env.local
```

---

## Core Principles

### 1. Component Colocation

**Rule**: Keep page-specific components WITH the page, not in `/components`.

Move to `/components/features` ONLY when used in 2+ pages.

```
✅ app/dashboard/page.tsx + DashboardStats.tsx
❌ components/DashboardStats.tsx
```

### 2. Server vs Client Components

**Default**: Server Components (no 'use client')

**Use 'use client' only for:**
- React hooks (useState, useEffect, useContext)
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)

**Prefer server-side data fetching** when possible (faster, better SEO).

### 3. Hybrid Pattern

- **Server components**: Initial data fetch, static content
- **Client components**: Interactivity, user actions

---

## Mock Data System

Mock data is **page-specific**, not globally toggled.

### Mock Structure

```
lib/api/mock/
  users.ts          # Mock users array + functions
  products.ts       # Mock products array + functions
  auth.ts           # Mock auth responses
```

### Mock Implementation

In page components, choose mock or real API:

```tsx
// app/[locale]/products/page.tsx
import { getProducts } from '@/lib/api/products';
import { getProducts as getMockProducts } from '@/lib/api/mock/products';

const USE_MOCK = true; // Toggle per page

async function ProductsPage() {
  const products = USE_MOCK
    ? await getMockProducts()
    : await getProducts();

  return <div>{/* render products */}</div>;
}
```

Mock data files export same structure as real API:

```ts
// lib/api/mock/users.ts
import { User } from '@/types/user';

export const mockUsers: User[] = [
  { id: '1', email: 'user@test.com', name: 'Test User', ... },
  // ... more mock users
];

export async function getUser(id: string): Promise<User> {
  await delay(500); // Simulate network
  const user = mockUsers.find(u => u.id === id);
  if (!user) throw new Error('User not found');
  return user;
}

export async function getUsers(): Promise<User[]> {
  await delay(500);
  return mockUsers;
}

// Helper
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Mock Principles

- Mock data must match TypeScript types exactly
- Simulate network delay (300-800ms)
- Include error scenarios (not found, validation errors)
- Same function signatures as real API

---

## API Client

### lib/api/client.ts

Contains:

- Base URL from env
- Auth token injection (localStorage)
- Error handling (401 → redirect to login)
- HTTP helpers: `api.get()`, `api.post()`, `api.put()`, `api.patch()`, `api.delete()`
- Custom `APIError` class
- Token management: `getAuthToken()`, `setAuthToken()`, `clearAuthToken()`

### lib/api/[resource].ts

Each resource (users, products, auth) gets own file:

- Import types from `types/`
- Export typed functions for each endpoint
- Handle query params, pagination, filters

**No mock logic here** - mock is handled at page level.

---

## TypeScript Types & DTOs

### Structure per Resource

```ts
// types/user.ts

// Entity (what backend returns)
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Create DTO (only required fields, no id/timestamps)
export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
}

// Update DTO (only editable fields, all optional)
export interface UpdateUserDTO {
  name?: string;
  avatar?: string;
}

// With relations (for includes)
export interface UserWithRelations {
  id: string;
  email: string;
  name: string;
  profile?: UserProfile;
  stats?: UserStats;
}
```

### Key Rules

1. **Send only required data** - Don't send entire objects
2. **Separate Request/Response types** - CreateDTO vs Entity
3. **UpdateDTO = all optional** - Only send changed fields
4. **Use `?` for relations** - Optional includes

---

## Internationalization (i18n)

### Setup

**Supported languages**: en (default), ru, kk

**Structure:**

```
messages/
  en.json
  ru.json
  kk.json

app/
  [locale]/          # Dynamic locale segment
```

### Translation Files

Organize by feature:

```json
{
  "common": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel"
    }
  },
  "auth": {
    "login": "Login",
    "email": "Email"
  },
  "dashboard": {
    "welcome": "Welcome, {name}"
  }
}
```

### Usage

- **Server Components**: `getTranslations()` or `useTranslations()`
- **Client Components**: `useTranslations()` hook
- **Access**: `t('auth.login')`
- **Dynamic values**: `t('dashboard.welcome', { name: userName })`

### Best Practices

- Use nested keys (auth.login, not authLogin)
- Handle pluralization
- Locale-aware date/number formatting
- Implement language switcher component

---

## Best Practices

### ✅ DO:
- Colocate page-specific components
- Use Server Components by default
- Send only required/changed data to API
- Create separate DTOs per action
- Toggle mock per page, not globally
- Use translations for all strings
- Handle loading and error states

### ❌ DON'T:
- Put page-specific components in `/components`
- Use 'use client' everywhere
- Send entire objects when updating
- Include read-only fields in DTOs (id, createdAt)
- Hardcode strings

---

## Decision Trees

### Component location:
```
Used in 2+ pages? → /components/features
Used in 1 page? → Colocate with page
```

### Server or Client:
```
Need hooks/events/browser APIs? → 'use client'
Otherwise → Server Component
```

### API data:
```
Create → Send all required (CreateDTO)
Update → Send only changed (UpdateDTO)
```

---

## Quick Start

1. ✅ Set up file structure
2. ✅ Configure next-intl, create translation files
3. ✅ Create `.env.local` with `NEXT_PUBLIC_API_URL`
4. ✅ Set up `lib/api/client.ts`
5. ✅ Create types in `types/`
6. ✅ Create mock data in `lib/api/mock/`
7. ✅ Create API functions in `lib/api/[resource].ts`
8. ✅ Build pages with mock data (toggle per page)
9. ✅ Switch to real API when backend ready

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.yourbackend.com
```

---

## Remember

**Start simple. Colocate components. Mock first, integrate later. Always use translations.**
