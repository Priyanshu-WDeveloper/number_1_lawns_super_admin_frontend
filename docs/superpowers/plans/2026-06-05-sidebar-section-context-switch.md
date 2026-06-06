# Sidebar Section Context Switch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure sidebar so clicking "Web Handling" navigates to a new hub page and switches the sidebar context to show only web-handling sub-items (Services, Reviews, Gallery, etc.)

**Architecture:** The sidebar component detects the current section via `useLocation()` path prefix matching. When on any `/super-admin/new-lawns/*` path, it renders a "web handling" view with a back button and the 6 sub-items. When on any other path, it renders the main view (Dashboard, Admins, Billing, Web Handling). A new hub landing page is created at `/super-admin/new-lawns` with navigation cards.

**Tech Stack:** React + TypeScript + shadcn sidebar + Lucide icons + react-router-dom v6

**Files to create/modify:**
- Create: `src/pages/new-lawns/index.tsx` — hub landing page
- Create: `src/constants/routes.ts` (check if exists) — update route constant
- Modify: `src/components/layout/super-admin-sidebar.tsx` — add context-switching logic
- Modify: `src/routes/new-lawns-routes.tsx` — add hub route, fix index route
- Modify: `src/constants/new-lawns-routes.ts` — add hub route constant

---

### Task 1: Add hub route constant

**Files:**
- Modify: `src/constants/new-lawns-routes.ts:1-20`

- [ ] **Step 1: Add hub route to constants**

```typescript
export const NEW_LAWNS_ROUTES = {
  HUB: '/super-admin/new-lawns',
  SERVICES: '/super-admin/new-lawns/services',
  SERVICES_CREATE: '/super-admin/new-lawns/services/create',
  SERVICES_VIEW: '/super-admin/new-lawns/services/:id',
  SERVICES_EDIT: '/super-admin/new-lawns/services/:id/edit',

  REVIEWS: '/super-admin/new-lawns/reviews',
  REVIEWS_CREATE: '/super-admin/new-lawns/reviews/create',

  GALLERY: '/super-admin/new-lawns/gallery',
  GALLERY_CREATE: '/super-admin/new-lawns/gallery/create',

  CONTACTS: '/super-admin/new-lawns/contacts',
  CONTACTS_VIEW: '/super-admin/new-lawns/contacts/:id',

  QUOTES: '/super-admin/new-lawns/quotes',
  QUOTES_VIEW: '/super-admin/new-lawns/quotes/:id',

  WEBSITE_CONFIG: '/super-admin/new-lawns/website-config',
};
```

Change: add `HUB: '/super-admin/new-lawns'` at the top.

---

### Task 2: Create hub landing page

**Files:**
- Create: `src/pages/new-lawns/index.tsx`

- [ ] **Step 1: Create hub page with navigation cards**

```tsx
import { useNavigate } from 'react-router-dom';
import {
  TreePine,
  Star,
  Image,
  MessageSquareText,
  FileText,
  Settings,
} from 'lucide-react';
import SuperAdminLayout from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';

const sections = [
  { title: 'Services', icon: TreePine, url: '/super-admin/new-lawns/services', description: 'Manage lawn care services' },
  { title: 'Reviews', icon: Star, url: '/super-admin/new-lawns/reviews', description: 'Manage customer reviews' },
  { title: 'Gallery', icon: Image, url: '/super-admin/new-lawns/gallery', description: 'Manage photo gallery' },
  { title: 'Contact Inquiries', icon: MessageSquareText, url: '/super-admin/new-lawns/contacts', description: 'View contact form submissions' },
  { title: 'Quote Requests', icon: FileText, url: '/super-admin/new-lawns/quotes', description: 'View quote requests' },
  { title: 'Website Config', icon: Settings, url: '/super-admin/new-lawns/website-config', description: 'Configure website settings' },
];

export default function NewLawnsHubPage() {
  const navigate = useNavigate();

  return (
    <SuperAdminLayout>
      <Navbar title="Web Handling" />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <button
              key={section.title}
              onClick={() => navigate(section.url)}
              className="flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-6 text-left transition-all hover:shadow-md hover:border-[#16a34a]/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#16a34a]/10">
                <section.icon className="h-6 w-6 text-[#16a34a]" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">{section.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{section.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
```

- [ ] **Step 2: Verify file creation**

Run: `ls src/pages/new-lawns/index.tsx`
Expected: file exists

---

### Task 3: Update routes to use new hub page

**Files:**
- Modify: `src/routes/new-lawns-routes.tsx:25-48`

- [ ] **Step 1: Add lazy import for hub page, change index route**

Add import at top (after line 23):
```tsx
const NLHubPage = React.lazy(() => import('../pages/new-lawns'));
```

Change the index route (line 28) from:
```tsx
<Route index element={<SuperAdminRoute><NLServicesPage /></SuperAdminRoute>} />
```
to:
```tsx
<Route index element={<SuperAdminRoute><NLHubPage /></SuperAdminRoute>} />
```

The services route on line 29 already handles `/services`, so no further changes needed.

- [ ] **Step 2: Verify routes**

Run: `grep -n "index\|services" src/routes/new-lawns-routes.tsx`
Expected: index route maps to NLHubPage, services is a separate path

---

### Task 4: Refactor sidebar with context switching

**Files:**
- Modify: `src/components/layout/super-admin-sidebar.tsx`

- [ ] **Step 1: Add the Globe icon import and restructure items**

Replace the import section to add `Globe` and `ArrowLeft`:
```tsx
import {
  LayoutDashboard,
  Users,
  CreditCard,
  TreePine,
  Star,
  Image,
  Settings,
  MessageSquareText,
  FileText,
  Shield,
  KeyRound,
  LogOutIcon,
  PanelLeftIcon,
  Globe,
  ArrowLeft,
} from 'lucide-react';
```

Replace the flat `items` array with two separate arrays:
```tsx
const mainItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/super-admin/dashboard' },
  { title: 'Admins', icon: Users, url: '/super-admin/admins' },
  { title: 'Billing', icon: CreditCard, url: '/super-admin/billing' },
  { type: 'label', label: 'Web Handling' },
  { title: 'Web Handling', icon: Globe, url: '/super-admin/new-lawns' },
];

const webItems = [
  { title: 'Services', icon: TreePine, url: '/super-admin/new-lawns/services' },
  { title: 'Reviews', icon: Star, url: '/super-admin/new-lawns/reviews' },
  { title: 'Gallery', icon: Image, url: '/super-admin/new-lawns/gallery' },
  { title: 'Contact Inquiries', icon: MessageSquareText, url: '/super-admin/new-lawns/contacts' },
  { title: 'Quote Requests', icon: FileText, url: '/super-admin/new-lawns/quotes' },
  { title: 'Website Config', icon: Settings, url: '/super-admin/new-lawns/website-config' },
];
```

- [ ] **Step 2: Add section detection and conditional rendering**

In the component body, after `const dispatch = useDispatch();`, add:
```tsx
const isWebSection = location.pathname.startsWith('/super-admin/new-lawns');
const currentItems = isWebSection ? webItems : mainItems;
```

Replace the items mapping section (lines 140-164) to handle the back button and web items:
```tsx
<SidebarGroup>
  <SidebarMenu className="space-y-2 px-3">
    {isWebSection && (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => navigate('/super-admin/dashboard')}
          className="h-11 rounded-2xl text-base hover:bg-[var(--sidebar-active)]"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )}

    {currentItems.map((item) => {
      if ('type' in item && item.type === 'label') {
        return (
          <div
            key={item.label}
            className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-white/50"
          >
            {item.label}
          </div>
        );
      }
      if (!('url' in item)) return null;
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            onClick={() => navigate(item.url!)}
            isActive={
              item.url === '/super-admin/new-lawns'
                ? location.pathname === '/super-admin/new-lawns'
                : location.pathname.startsWith(item.url)
            }
            className="h-11 rounded-2xl text-base hover:bg-[var(--sidebar-active)] data-[active=true]:bg-[var(--sidebar-active)]"
          >
            {item.icon && <item.icon className="h-5 w-5" />}
            <span>{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    })}
  </SidebarMenu>
</SidebarGroup>
```

Key behavioral changes:
- "Back" button only shows in web section — navigates to dashboard
- Active state uses `startsWith()` for web items so sub-routes like `/services/create` still highlight
- "Web Handling" (hub route) uses exact match (`===`) so it only shows active on the hub page itself
- Main items (Dashboard, Admins, Billing) still use exact match (`===`) as before

- [ ] **Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Self-Review

**Spec coverage:**
1. ✅ New hub page — Task 2 creates it with card navigation
2. ✅ Sidebar context switching — Task 4: path-based detection
3. ✅ Back button — Task 4: "← Back" in web section navigates to dashboard
4. ✅ Active/highlight state — Task 4: `startsWith()` for web sub-items, exact match for hub
5. ✅ Route changes — Task 3: index maps to hub, services is separate path

**Placeholder scan:** All code blocks contain complete, executable code. No TBD, TODO, or placeholder patterns.

**Type consistency:** All types match — `items` array structure preserved, LucideIcon types consistent, URL strings match route constants.

**Test gaps:** No existing test infrastructure detected for this UI. Manual verification steps included.
