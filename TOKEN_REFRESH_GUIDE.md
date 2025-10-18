# Hệ Thống Tự Động Refresh Token

## Tổng Quan

Hệ thống tự động làm mới (refresh) JWT token khi sắp hết hạn hoặc đã hết hạn, tránh việc người dùng bị đăng xuất đột ngột.

## Các Thành Phần

### 1. **Middleware Tự Động Refresh** (`src/middleware.ts`)
- Kiểm tra access token trước mỗi request
- Nếu token hết hạn hoặc sắp hết hạn (< 5 phút), tự động dùng refresh token để tạo access token mới
- Tự động set cookie mới mà không cần redirect

### 2. **JWT Utilities** (`src/lib/jwt.ts`)
- `isTokenExpiringSoon()`: Kiểm tra token sắp hết hạn
- `getTokenTimeRemaining()`: Lấy thời gian còn lại của token

### 3. **Fetch Wrapper** (`src/lib/fetch-with-refresh.ts`)
Sử dụng khi gọi API từ client:

```typescript
import { fetchWithRefresh, fetchJSON } from "@/lib/fetch-with-refresh";

// Cách 1: Fetch thông thường với auto-refresh
const response = await fetchWithRefresh("/api/documents");

// Cách 2: Fetch JSON trực tiếp
const data = await fetchJSON("/api/documents");
```

### 4. **React Hook** (`src/hooks/use-token-refresh.ts`)
Tự động refresh token định kỳ (mặc định 10 phút):

```typescript
import { useTokenRefresh } from "@/hooks/use-token-refresh";

function MyApp() {
    useTokenRefresh(10); // Refresh mỗi 10 phút
    return <div>...</div>;
}
```

### 5. **Provider Component** (`src/components/token-refresh-provider.tsx`)
Đã được tích hợp trong `layout.tsx` để tự động refresh cho toàn bộ app.

## Luồng Hoạt Động

### Server-side (Middleware)
```
Request → Middleware → Kiểm tra access token
                      ↓
                   Hết hạn?
                      ↓
                    Yes → Kiểm tra refresh token → Tạo access token mới → Continue
                      ↓
                    No → Continue
```

### Client-side (Fetch)
```
API Call → Nhận 401 → Gọi /api/refresh → Retry request ban đầu
                                        ↓
                                   Thất bại → Redirect /sign-in
```

### Background (Hook)
```
Page Load → Start interval (10 phút) → Gọi /api/refresh định kỳ
```

## Cấu Hình

### Thay đổi thời gian refresh tự động
Trong `layout.tsx` hoặc component của bạn:

```tsx
<TokenRefreshProvider intervalMinutes={15}> {/* 15 phút */}
```

### Thay đổi ngưỡng "sắp hết hạn"
Trong `middleware.ts`:

```typescript
const expiringSoon = await isTokenExpiringSoon(access, 600); // 10 phút
```

### Thay đổi thời hạn token
Trong các endpoint login/register:

```typescript
const accessToken = await signToken({ id: user.id }, "30m"); // 30 phút
const refreshToken = await signToken({ id: user.id }, "7d"); // 7 ngày
```

## API Endpoints

### POST `/api/refresh`
Làm mới access token bằng refresh token.

**Request:** Không cần body, tự động lấy refresh_token từ cookie

**Response:**
```json
{
    "accessToken": "new.jwt.token"
}
```

**Cookie được set:** `access_token`

## Lưu Ý

1. **HttpOnly Cookies**: Access token và refresh token được lưu trong httpOnly cookies → an toàn hơn localStorage
2. **Tự động ở nhiều lớp**: 
   - Middleware tự động refresh trên mỗi page navigation
   - Hook tự động refresh định kỳ khi user đang dùng app
   - Fetch wrapper tự động refresh khi gọi API bị 401
3. **Không cần can thiệp**: Developer không cần lo về refresh token trong code thông thường

## Ví Dụ Sử Dụng

### Gọi API với auto-refresh
```typescript
// Thay vì dùng fetch thông thường
const response = await fetch("/api/documents");

// Dùng wrapper có auto-refresh
import { fetchJSON } from "@/lib/fetch-with-refresh";
const documents = await fetchJSON<Document[]>("/api/documents");
```

### Sử dụng trong component
```tsx
"use client";

import { fetchJSON } from "@/lib/fetch-with-refresh";
import { useEffect, useState } from "react";

export function DocumentList() {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        fetchJSON("/api/documents")
            .then(setDocs)
            .catch(err => console.error(err));
    }, []);

    return <div>{/* Render docs */}</div>;
}
```

## Troubleshooting

- **Token vẫn hết hạn**: Kiểm tra refresh token có còn hợp lệ không (default 7 days)
- **Redirect liên tục**: Kiểm tra endpoint `/api/refresh` có hoạt động đúng không
- **Performance**: Nếu app chậm, tăng interval refresh lên (20-30 phút)
