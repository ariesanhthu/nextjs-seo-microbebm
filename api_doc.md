# API Documentation

## Overview

This document provides comprehensive API documentation for all schemas, DTOs, and endpoints in the NextJS SEO Microbebm application. The application uses Zod for schema validation and TypeScript for type safety.

## Base Schema

### GeneralSchema
All entities extend from this base schema:

```typescript
{
  id: string                    // Unique identifier
  created_at: Timestamp        // Creation timestamp
  updated_at: Timestamp        // Last update timestamp
}
```

## API Endpoints

All endpoints follow RESTful conventions and return structured responses:

```typescript
// Success Response
{
  success: true,
  data: T,
  message?: string
}

// Error Response
{
  success: false,
  error: string,
  message: string,
  details?: ValidationError[]  // For validation errors
}

// Paginated Response
{
  success: true,
  data: T[],
  nextCursor: string | null,
  hasNextPage: boolean,
  count: number
}
```

## Entities

---

## 1. Category

### Endpoints
- `GET /api/category` - Get all categories (paginated)
- `POST /api/category` - Create new category
- `GET /api/category/[id]` - Get category by ID
- `PUT /api/category/[id]` - Update category
- `DELETE /api/category/[id]` - Delete category

### Schema Fields
```typescript
{
  ...GeneralSchema,
  name: string,           // 1-100 chars, required
  slug: string            // 1-100 chars, auto-generated from name
}
```

### Create DTO
```typescript
{
  name: string            // Category name (required)
}
```

### Update DTO
```typescript
{
  name?: string           // Category name (optional)
}
```

### Response DTO
```typescript
{
  id: string,
  name: string,
  slug: string,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

## 2. Tag

### Endpoints
- `GET /api/tag` - Get all tags (paginated)
- `POST /api/tag` - Create new tag
- `GET /api/tag/[id]` - Get tag by ID
- `PUT /api/tag/[id]` - Update tag
- `DELETE /api/tag/[id]` - Delete tag

### Schema Fields
```typescript
{
  ...GeneralSchema,
  name: string,           // 1-100 chars, required
  slug: string            // 1-100 chars, auto-generated from name
}
```

### Create DTO
```typescript
{
  name: string            // Tag name (required)
}
```

### Update DTO
```typescript
{
  name?: string           // Tag name (optional)
}
```

### Response DTO
```typescript
{
  id: string,
  name: string,
  slug: string,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

## 3. Product

### Endpoints
- `GET /api/product` - Get all products (paginated)
- `POST /api/product` - Create new product
- `GET /api/product/[id]` - Get product by ID
- `PUT /api/product/[id]` - Update product
- `DELETE /api/product/[id]` - Delete product

### Schema Fields
```typescript
{
  ...GeneralSchema,
  name: string,                    // 1-100 chars, required
  slug: string,                    // 1-100 chars, auto-generated from name
  description: string,             // Product description (default: "")
  main_img: string,               // Main image URL (default: "")
  sub_img: string[],              // Array of sub-image URLs (default: [])
  content: string,                // Product content/details (default: "")
  category_refs: DocumentReference[] // Internal: Firestore references to categories
}
```

### Create DTO
```typescript
{
  name: string,           // Product name (required)
  description?: string,   // Product description
  main_img?: string,      // Main image URL
  sub_img?: string[],     // Sub-image URLs
  category_ids?: string[] // Array of category IDs to associate
}
```

### Update DTO
```typescript
{
  name?: string,          // Product name
  description?: string,   // Product description
  main_img?: string,      // Main image URL
  sub_img?: string[],     // Sub-image URLs
  category_ids?: string[] // Array of category IDs to associate
}
```

### Response DTO
```typescript
{
  id: string,
  name: string,
  slug: string,
  description: string,
  main_img: string,
  sub_img: string[],
  content: string,
  categories: {           // Populated category data
    id: string,
    name: string,
    slug: string
  }[],
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

## 4. Blog

### Endpoints
- `GET /api/blog` - Get all blogs (paginated)
- `POST /api/blog` - Create new blog
- `GET /api/blog/[id]` - Get blog by ID
- `PUT /api/blog/[id]` - Update blog
- `DELETE /api/blog/[id]` - Delete blog

### Schema Fields
```typescript
{
  ...GeneralSchema,
  title: string,                   // 1-100 chars, required
  slug: string,                    // 1-100 chars, auto-generated from title
  content: string,                 // Blog content (default: "")
  tag_refs: DocumentReference[]    // Internal: Firestore references to tags
}
```

### Create DTO
```typescript
{
  title: string,          // Blog title (required)
  content?: string,       // Blog content
  tag_ids?: string[]      // Array of tag IDs to associate
}
```

### Update DTO
```typescript
{
  title?: string,         // Blog title
  content?: string,       // Blog content
  tag_ids?: string[]      // Array of tag IDs to associate
}
```

### Response DTO
```typescript
{
  id: string,
  title: string,
  slug: string,
  content: string,
  tags: {                 // Populated tag data
    id: string,
    name: string,
    slug: string
  }[],
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

## 5. Contact

### Endpoints
- `GET /api/contact` - Get all contacts (paginated)
- `POST /api/contact` - Create new contact
- `GET /api/contact/[id]` - Get contact by ID
- `PUT /api/contact/[id]` - Update contact
- `DELETE /api/contact/[id]` - Delete contact

### Schema Fields
```typescript
{
  ...GeneralSchema,
  name: string,           // 1-100 chars, required
  email: string | null,   // Valid email format, nullable
  phone: string | null,   // Exactly 10 digits, nullable
  description: string,    // Max 1000 chars (default: "")
  is_check: boolean       // Contact status (default: false)
}
```

### Validation Rules
- Either `email` or `phone` must be provided (not both null)
- Phone must be exactly 10 digits if provided
- Email must be valid format if provided

### Create DTO
```typescript
{
  name: string,           // Contact name (required)
  email?: string | null,  // Email address
  phone?: string | null,  // Phone number (10 digits)
  description?: string    // Contact description
}
```

### Update DTO
```typescript
{
  name?: string,          // Contact name
  email?: string | null,  // Email address
  phone?: string | null,  // Phone number (10 digits)
  description?: string,   // Contact description
  is_check?: boolean      // Contact check status
}
```

### Response DTO
```typescript
{
  id: string,
  name: string,
  email: string | null,
  phone: string | null,
  description: string,
  is_check: boolean,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

## 6. Homepage

### Endpoints
- `GET /api/homepage` - Get all homepage configs
- `POST /api/homepage` - Create new homepage config
- `GET /api/homepage/[id]` - Get homepage config by ID
- `PUT /api/homepage/[id]` - Update homepage config
- `DELETE /api/homepage/[id]` - Delete homepage config

### Schema Fields
```typescript
{
  ...GeneralSchema,
  navigation_bar: {       // Navigation menu items
    title: string,
    url: string
  }[],
  footer: {              // Footer information
    vi_name: string,     // Vietnamese company name
    en_name: string,     // English company name
    tax_code: string,    // Tax identification number
    short_name: string,  // Company short name
    owner: string,       // Company owner
    address: string,     // Company address
    email: string,       // Contact email
    phone: string,       // Contact phone
    working_time: string, // Working hours
    fanpage: string,     // Facebook page URL
    address_link: string // Google Maps link
  },
  slider: string[],      // Array of slider image URLs
  products: ProductResponseDto[] // Featured products
}
```

### Create DTO
```typescript
{
  navigation_bar?: {
    title: string,
    url: string
  }[],
  footer?: {
    vi_name?: string,
    en_name?: string,
    tax_code?: string,
    short_name?: string,
    owner?: string,
    address?: string,
    email?: string,
    phone?: string,
    working_time?: string,
    fanpage?: string,
    address_link?: string
  },
  slider?: string[],
  product_ids?: string[] // Array of product IDs to feature
}
```

### Update DTO
```typescript
{
  navigation_bar?: {
    title: string,
    url: string
  }[],
  footer?: {
    vi_name?: string,
    en_name?: string,
    tax_code?: string,
    short_name?: string,
    owner?: string,
    address?: string,
    email?: string,
    phone?: string,
    working_time?: string,
    fanpage?: string,
    address_link?: string
  },
  slider?: string[],
  product_ids?: string[] // Array of product IDs to feature
}
```

### Response DTO
```typescript
{
  id: string,
  navigation_bar: {
    title: string,
    url: string
  }[],
  footer: {
    vi_name: string,
    en_name: string,
    tax_code: string,
    short_name: string,
    owner: string,
    address: string,
    email: string,
    phone: string,
    working_time: string,
    fanpage: string,
    address_link: string
  },
  slider: string[],
  products: ProductResponseDto[], // Populated product data
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

## 7. Common Information

### Schema Fields
```typescript
{
  ...GeneralSchema,
  facebook: string,       // Facebook URL/username
  zalo: string,          // Zalo contact info
  gmail: string,         // Gmail address (valid email)
  phone: string | null   // Phone number (exactly 10 digits)
}
```

### Create DTO
```typescript
{
  facebook: string,       // Facebook URL/username (required)
  zalo: string,          // Zalo contact info (required)
  gmail: string,         // Gmail address (required, valid email)
  phone: string | null   // Phone number (10 digits)
}
```

### Update DTO
```typescript
{
  facebook?: string,      // Facebook URL/username
  zalo?: string,         // Zalo contact info
  gmail?: string,        // Gmail address (valid email)
  phone?: string         // Phone number (10 digits)
}
```

### Response DTO
```typescript
{
  id: string,
  facebook: string,
  zalo: string,
  gmail: string,
  phone: string | null,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

## 8. Image Metadata

### Schema Fields
```typescript
{
  ...GeneralSchema,
  public_id: string,      // Cloudinary public ID
  url: string,           // Valid image URL
  width: number,         // Image width in pixels
  height: number         // Image height in pixels
}
```

### Create DTO
```typescript
{
  public_id: string,      // Cloudinary public ID (required)
  url: string,           // Image URL (required, valid URL)
  width: number,         // Image width (required)
  height: number         // Image height (required)
}
```

### Update DTO
```typescript
{
  public_id?: string,     // Cloudinary public ID
  url?: string,          // Image URL (valid URL)
  width?: number,        // Image width
  height?: number        // Image height
}
```

### Response DTO
```typescript
{
  id: string,
  public_id: string,
  url: string,
  width: number,
  height: number,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

## Pagination

### Query Parameters
```typescript
{
  cursor?: string,        // Cursor for pagination (document ID)
  limit?: number,        // Number of items per page (default: 10)
  sort?: "ASC" | "DESC"  // Sort order (default: "DESC")
}
```

### Pagination Response
```typescript
{
  success: true,
  data: T[],             // Array of items
  nextCursor: string | null, // Cursor for next page
  hasNextPage: boolean,  // Whether more pages exist
  count: number          // Number of items in current page
}
```

---

## Error Handling

### Validation Errors (400)
```typescript
{
  success: false,
  error: "Validation failed",
  message: "Detailed error message",
  details: [
    {
      field: "fieldName",
      message: "Specific field error"
    }
  ]
}
```

### Not Found Errors (404)
```typescript
{
  success: false,
  error: "Not found",
  message: "Resource with ID 'xxx' not found"
}
```

### Server Errors (500)
```typescript
{
  success: false,
  error: "Internal server error",
  message: "Detailed error message"
}
```

---

## Features

### Auto-Generated Fields
- **Slugs**: Automatically generated from `name` or `title` fields with Vietnamese character support
- **Timestamps**: `created_at` and `updated_at` are automatically managed
- **IDs**: Document IDs are auto-generated by Firestore

### Reference Population
- **Products**: Category references are automatically populated in responses
- **Blogs**: Tag references are automatically populated in responses  
- **Homepage**: Product references are automatically populated in responses

### Validation Features
- **Comprehensive field validation** with detailed error messages
- **Vietnamese text support** for slug generation
- **Email and phone number validation**
- **File upload validation** for images
- **Reference integrity** validation for related entities

### Security Features
- **Input sanitization** through Zod schemas
- **Type safety** with TypeScript
- **Structured error responses** to prevent information leakage
- **Firestore security rules** integration
