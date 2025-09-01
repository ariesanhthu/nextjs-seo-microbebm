# Section About Feature

Feature quản lý các section trong trang About với 3 style khác nhau.

## Cấu trúc thư mục

```
src/features/section-about/
├── components/
│   ├── index.ts                    # Export tất cả components
│   ├── layout-editor.tsx          # Component chính để chỉnh sửa layout
│   ├── layout-preview.tsx         # Component preview layout
│   ├── section-form.tsx           # Form chỉnh sửa section
│   ├── style-preview.tsx          # Preview các style
│   ├── subsection-editor.tsx      # Editor cho subsection
│   └── section-style/             # Các components cho từng style
│       ├── index.ts
│       ├── section-header.tsx     # Component header chung
│       ├── style0-no-image.tsx    # Style 0: Không có hình ảnh
│       ├── style1-one-image.tsx   # Style 1: 1 hình ảnh
│       └── style2-four-image.tsx  # Style 2: 4 hình ảnh
├── hooks/
│   ├── index.ts
│   └── useSectionStyle.tsx        # Custom hook quản lý logic chung
├── index.ts                       # Export chính của feature
└── README.md                      # Tài liệu này
```

## Các Style

### Style 0 - No Image

- Không có hình ảnh
- Title/subtitle ở giữa
- Danh sách subsections dọc

### Style 1 - One Image

- Có 1 hình ảnh ở section level
- Layout 2 cột: ảnh bên trái, subsections bên phải
- Subsections không có phần chọn ảnh

### Style 2 - Four Images

- Có tối đa 4 hình ảnh ở subsection level
- Title/subtitle ở trên
- Grid 2x2 cho subsections

## Custom Hook: useSectionStyle

Hook quản lý tất cả logic chung cho các style components:

```typescript
const {
  // State
  section,

  // Actions
  updateSection,
  updateSubsection,
  addSubsection,
  removeSubsection,

  // Computed values
  canAddImage,
  shouldShowImageInSubsection,
  maxImages,
  canAddSubsection,

  // Style specific helpers
  isStyle0,
  isStyle1,
  isStyle2,
} = useSectionStyle({ section, onUpdate });
```

## Cách sử dụng

```typescript
import {
  LayoutEditor,
  StylePreview,
  useSectionStyle,
  EStyleSection
} from '@/features/section-about'

// Sử dụng LayoutEditor
<LayoutEditor initialData={data} aboutId={id} />

// Sử dụng StylePreview
<StylePreview section={section} onUpdate={onUpdate} onDelete={onDelete} />

// Sử dụng hook
const sectionLogic = useSectionStyle({ section, onUpdate })
```