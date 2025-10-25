# Giải Pháp: Organization Context

## ❌ Vấn đề ban đầu

Khi `current` thay đổi trong `useOrganizations()`, `useDocuments` không nhận được sự thay đổi vì:

1. **Mỗi component gọi `useOrganizations()` tạo ra instance riêng biệt**
   - `organization-switcher.tsx` có state `current` riêng
   - `useDocuments.ts` có state `current` riêng
   - Khi `setCurrent()` trong switcher → không ảnh hưởng đến documents

2. **State không được share giữa các component**
   ```
   Component A → useOrganizations() → current = org1
   Component B → useOrganizations() → current = undefined ❌
   ```

## ✅ Giải pháp: React Context

Tạo **OrganizationContext** để centralize state:

### 1. Tạo Context (`organization-context.tsx`)
- State `current` được quản lý ở 1 nơi duy nhất
- Tự động select organization đầu tiên
- Chia sẻ state cho toàn bộ app

### 2. Wrap App với Provider (`provider.tsx`)
```tsx
<QueryClientProvider>
  <OrganizationProvider>  ← Bọc toàn bộ app
    {children}
  </OrganizationProvider>
</QueryClientProvider>
```

### 3. Sử dụng Context
- `useCurrentOrganization()` → get/set current organization (shared state)
- `useOrganizations()` → chỉ dùng cho mutations (create, update, delete)

## 🔄 Flow hoạt động mới

```
1. User chọn organization trong OrganizationSwitcher
   ↓
2. setCurrent() được gọi → update Context state
   ↓
3. Tất cả components đang listen Context đều nhận được update
   ↓
4. useDocuments re-render với organizationId mới
   ↓
5. React Query tự động fetch documents của org mới
```

## 📝 Files đã thay đổi

1. ✅ `src/contexts/organization-context.tsx` - Tạo mới
2. ✅ `src/components/provider.tsx` - Thêm OrganizationProvider
3. ✅ `src/hooks/useDocuments.ts` - Dùng useCurrentOrganization() thay vì useOrganizations()
4. ✅ `src/app/(home)/organization-switcher.tsx` - Dùng useCurrentOrganization() để set/get current

## 🎯 Kết quả

- ✅ `current` thay đổi → `useDocuments` nhận được ngay lập tức
- ✅ Documents tự động fetch khi switch organization
- ✅ State được đồng bộ trên toàn bộ app
- ✅ Không cần localStorage hoặc URL params
