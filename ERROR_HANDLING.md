# Error Handling Best Practices

## Masalah dengan Empty Catch Blocks

**❌ Jangan seperti ini:**

```tsx
try {
  await someApiCall();
} catch (err) {
  // Silent error handling
}
```

**❌ Atau bahkan yang lebih buruk:**

```tsx
try {
  await someApiCall();
} catch (err) {
  // TODO: Handle error
}
```

## ✅ Solusi yang Lebih Baik

### 1. Log Error untuk Development

```tsx
import { handleError } from "@/utils/logger";

try {
  const result = await someApiCall();
  return result;
} catch (err) {
  handleError(err, "someApiCall context", () => {
    // Fallback action jika diperlukan
    setDefaultValue();
  });
}
```

### 2. Dengan Toast Notification

```tsx
try {
  await updateProduct(data);
  toast.success("Produk berhasil diperbarui!");
} catch (err) {
  const message = getErrorMessage(err, "Gagal memperbarui produk");
  toast.error(message);
}
```

### 3. Dengan State Management

```tsx
try {
  setLoading(true);
  const data = await fetchData();
  setData(data);
} catch (err) {
  handleError(err, "fetchData");
  setError("Gagal memuat data");
} finally {
  setLoading(false);
}
```

### 4. Untuk Non-Critical Operations

```tsx
try {
  const categories = await fetchCategories();
  setCategories(categories);
} catch (err) {
  // Log error tapi jangan break UI
  handleError(err, "fetchCategories", () => {
    setCategories([]); // Set default empty array
  });
}
```

## Keuntungan Pendekatan Ini

1. **Development**: Error ter-log dengan jelas untuk debugging
2. **Production**: Log disabled otomatis untuk performa
3. **User Experience**: UI tidak break, ada fallback values
4. **Maintainability**: Consistent error handling pattern
5. **Debugging**: Context yang jelas untuk setiap error

## Environment Detection

Logger utility menggunakan `NODE_ENV` untuk mendeteksi environment:

- **Development**: Semua log ditampilkan
- **Production**: Log disabled otomatis

Ini memberikan balance antara developer experience dan production performance.
