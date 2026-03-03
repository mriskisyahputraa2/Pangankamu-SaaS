# 📱 Categories Page Responsive Design

## 🎯 Overview

Halaman Categories telah dibuat responsive untuk semua device menggunakan Tailwind CSS breakpoints dan component adaptations.

## 📏 Breakpoints Used

- **Mobile**: `< 640px` (default)
- **Tablet**: `sm: 640px+` (Small screens and up)
- **Desktop**: `md: 768px+` (Medium screens and up)

## 🔧 Responsive Implementations

### 1. **Main Page Layout** (`page.tsx`)

```tsx
// Responsive container
<div className="w-full space-y-4 md:space-y-6 font-jakarta px-4 md:px-0">

// Responsive header
<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
  <div className="flex-1">
    <h1 className="text-xl md:text-2xl font-bold text-slate-900">Kategori Produk</h1>
    <p className="text-xs md:text-sm text-slate-500 mt-1">...</p>
  </div>
  <div className="shrink-0">
    <AddCategoryModal onSuccess={refreshAndResetPage} />
  </div>
</div>
```

**Features:**

- 📱 Mobile: Stacked layout, smaller text, padding adjustment
- 💻 Desktop: Horizontal layout, larger text, no side padding

### 2. **Search & Filters** (`CategoryFilters.tsx`)

```tsx
// Responsive filter layout
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
  <div className="relative flex-1">// Search input takes full width</div>
  <Select value={limit} onValueChange={onLimitChange}>
    <SelectTrigger className="w-full sm:w-32.5 h-11 rounded-xl">
      // Full width on mobile, fixed width on larger screens
    </SelectTrigger>
  </Select>
</div>
```

**Features:**

- 📱 Mobile: Stacked filters, full width select
- 💻 Desktop: Horizontal layout, fixed width select

### 3. **Data Table** (`CategoryTable.tsx`)

#### **Desktop View (768px+)**

- Traditional table layout with columns
- Icon-only action buttons
- Compact spacing

#### **Mobile View (<768px)**

- Card-based layout instead of table
- Larger touch targets
- Better readability

```tsx
// Mobile Card Component
function CategoryCard({
  category,
  index,
  currentPage,
  limit,
  onEdit,
  onRefresh,
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">
              #{(currentPage - 1) * limit + index + 1}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base mt-2">
            {category.name}
          </h3>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
        // Action buttons with text labels
      </div>
    </div>
  );
}
```

**Features:**

- 📱 Mobile: Card layout with clear visual hierarchy
- 💻 Desktop: Traditional table with compact design

### 4. **Pagination** (`CategoryPagination.tsx`)

#### **Desktop View**

```tsx
<div className="hidden md:flex items-center justify-between p-4">
  <p className="text-xs text-slate-500">
    Menampilkan <span className="font-bold">{displayedCount}</span> dari{" "}
    <span className="font-bold">{totalData}</span> data
  </p>
  <div className="flex items-center gap-2">// Compact navigation buttons</div>
</div>
```

#### **Mobile View**

```tsx
<div className="md:hidden p-4 space-y-3">
  <div className="text-center">// Centered data info</div>
  <div className="flex items-center justify-center gap-3">
    // Full-width navigation buttons
  </div>
</div>
```

**Features:**

- 📱 Mobile: Centered layout, full-width buttons, stacked info
- 💻 Desktop: Horizontal layout, compact buttons

### 5. **Modals Responsive**

#### **Add/Edit/Delete Modals**

```tsx
<DialogContent className="w-[95vw] max-w-md mx-auto">
  // Responsive modal width

<div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
  // Stacked buttons on mobile, horizontal on desktop
  <Button className="w-full sm:w-auto">...</Button>
</div>
```

**Features:**

- 📱 Mobile: 95% viewport width, stacked buttons
- 💻 Desktop: Fixed max-width, horizontal buttons

## 🎨 Design Principles

### **Mobile-First Approach**

- Base styles target mobile devices
- Progressive enhancement for larger screens
- Touch-friendly interface elements

### **Content Adaptation**

- Text sizes scale appropriately
- Button labels adapt (icon-only vs. text+icon)
- Layout changes from vertical to horizontal

### **Visual Hierarchy**

- Clear spacing and typography scales
- Consistent color schemes across devices
- Proper focus states for accessibility

## 📱 Device Testing Guidelines

### **Mobile (320px - 639px)**

- [ ] Header stacks properly
- [ ] Filters stack vertically
- [ ] Cards display correctly
- [ ] Pagination is touch-friendly
- [ ] Modals are easily readable

### **Tablet (640px - 767px)**

- [ ] Header becomes horizontal
- [ ] Filters remain horizontal
- [ ] Cards still used (better for touch)
- [ ] Pagination transitions to desktop style

### **Desktop (768px+)**

- [ ] Full table layout
- [ ] Compact pagination
- [ ] Hover states work properly
- [ ] All text is readable

## 🚀 Performance Considerations

- **CSS Classes**: Using Tailwind's responsive prefixes
- **Component Splitting**: Separate mobile/desktop components where needed
- **Conditional Rendering**: Show/hide elements based on screen size
- **Touch Targets**: Minimum 44px tap targets on mobile

## 🔧 Customization

To modify responsive behavior:

1. **Breakpoints**: Adjust `sm:` and `md:` classes
2. **Spacing**: Modify `space-y-4 md:space-y-6` patterns
3. **Typography**: Update `text-xl md:text-2xl` scales
4. **Layout**: Change `flex-col sm:flex-row` orientations

This responsive design ensures optimal user experience across all devices while maintaining the clean architecture and functionality of the Categories page.
