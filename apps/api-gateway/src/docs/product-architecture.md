# Product Backend Clean Architecture

## 🏗️ Architecture Overview

Product backend menggunakan clean architecture pattern yang sama dengan categories:

```
src/
├── routes/
│   └── product.ts          # HTTP Controllers
├── services/
│   └── productService.ts   # Business Logic
└── repositories/
    └── productRepository.ts # Data Access Layer
```

## 📋 Layer Responsibilities

### **1. Routes (Controller Layer)**

- Handle HTTP requests/responses
- Extract parameters from request
- Call appropriate services
- Return formatted responses

### **2. Services (Business Logic Layer)**

- Validate input data
- Apply business rules
- Handle errors with user-friendly messages
- Coordinate between multiple repositories if needed

### **3. Repositories (Data Access Layer)**

- Direct database operations
- Query construction
- Data transformation
- Return raw database results

## 🚀 Benefits

1. **Separation of Concerns** - Each layer has single responsibility
2. **Testability** - Easy to unit test each layer separately
3. **Maintainability** - Changes isolated to specific layers
4. **Scalability** - Easy to add new features following same pattern
5. **Consistency** - Same pattern across all features (products, categories)

## 📝 API Endpoints

### GET /products

- **Purpose**: Get products with pagination and search
- **Auth**: Required (JWT + store_id)
- **Query**: page, limit, search
- **Response**: Products list with metadata

### POST /products

- **Purpose**: Create new product
- **Auth**: Required (JWT + store_id)
- **Body**: name, category_id, price_sell, price_base, stock, unit
- **Response**: Created product data

### PUT /products/:id

- **Purpose**: Update existing product
- **Auth**: Required (JWT + store_id)
- **Params**: id
- **Body**: Product fields to update
- **Response**: Updated product data

### DELETE /products/:id

- **Purpose**: Delete product
- **Auth**: Required (JWT + store_id)
- **Params**: id
- **Response**: Success message

## 🔒 Security Features

1. **Multi-tenant isolation** - All operations filtered by store_id from JWT
2. **Input validation** - Required fields validation in service layer
3. **Error handling** - User-friendly error messages
4. **Duplicate prevention** - Handle unique constraint violations
5. **Access control** - JWT authentication required for all operations

## 🎯 Error Handling

The service layer provides consistent error messages:

- **Validation errors**: "Field X is required"
- **Duplicate errors**: "Product name already exists in your store"
- **Not found errors**: "Product not found or access denied"
- **Database errors**: Transformed to user-friendly messages

## 📊 Data Flow

```
Request → Routes → Services → Repositories → Database
                     ↓
Response ← Routes ← Services ← Repositories ← Database
```

Each layer adds value and maintains clean separation of concerns.
