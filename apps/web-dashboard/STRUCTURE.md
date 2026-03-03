# Frontend Structure Documentation

## 🏗️ New Feature-Based Architecture

This project now follows a **Feature-Based Architecture** for better scalability and maintainability.

### 📁 Directory Structure

```
src/
├── app/                          # Next.js 13+ App Router
│   ├── (auth)/                   # Authentication routes
│   └── (dashboard)/              # Protected dashboard routes
│
├── features/                     # 🚀 Feature-based modules
│   ├── auth/
│   │   ├── components/           # Auth-specific components
│   │   ├── hooks/                # Auth-specific hooks
│   │   ├── services/             # Auth API services
│   │   ├── types/                # Auth TypeScript types
│   │   └── index.ts              # Feature exports
│   │
│   ├── categories/
│   │   ├── components/modals/    # Category modal components
│   │   ├── hooks/                # Category-specific hooks
│   │   ├── services/             # Category API services
│   │   ├── types/                # Category TypeScript types
│   │   └── index.ts              # Feature exports
│   │
│   └── products/
│       ├── components/           # Product components
│       ├── hooks/                # Product-specific hooks
│       ├── services/             # Product API services
│       ├── types/                # Product TypeScript types
│       └── index.ts              # Feature exports
│
├── components/                   # Shared/Reusable components
│   ├── ui/                       # Shadcn/UI components
│   ├── layout/                   # Layout components (Sidebar, Header)
│   └── shared/                   # Common business components
│
├── hooks/                        # Global custom hooks
├── lib/                          # Core utilities & configurations
├── types/                        # Global TypeScript types
└── utils/                        # Helper functions
```

## 🔄 Migration Summary

### ✅ What was moved:

1. **Categories Feature**:
   - `components/categories/*` → `features/categories/components/modals/`
   - `services/category-service.ts` → `features/categories/services/categoryService.ts`
   - Created `features/categories/types/category.types.ts`

2. **Products Feature**:
   - `components/products/*` → `features/products/components/`
   - `services/product-service.ts` → `features/products/services/productService.ts`

3. **Auth Feature**:
   - `components/AuthGuard.tsx` → `features/auth/components/`
   - `services/auth-service.ts` → `features/auth/services/authService.ts`
   - Created `features/auth/types/auth.types.ts`

### 🔧 Updated Imports:

```typescript
// Before
import { categoryService } from "@/services/category-service";
import { Category } from "@/types";

// After
import { categoryService } from "@/features/categories/services/categoryService";
import { Category } from "@/features/categories/types/category.types";

// Or using feature index
import { categoryService, Category } from "@/features/categories";
```

## 🎯 Benefits

1. **Feature Isolation** - Each feature is self-contained
2. **Scalability** - Easy to add new features
3. **Team Collaboration** - Multiple developers can work on different features
4. **Maintainability** - Bug fixes and updates are localized
5. **Code Discovery** - Easier to find and understand code organization

## 🚀 Usage Examples

### Importing from Categories Feature:

```typescript
import {
  categoryService,
  Category,
  AddCategoryModal,
} from "@/features/categories";
```

### Importing from Auth Feature:

```typescript
import { authService, User, AuthState } from "@/features/auth";
```

### Importing Shared Components:

```typescript
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/Sidebar";
```

## 🔮 Future Additions

When adding new features (e.g., Orders, Analytics), follow this pattern:

```bash
mkdir -p src/features/orders/{components,hooks,services,types}
# Then create components, services, and types following the same pattern
```
