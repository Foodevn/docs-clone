# Liveblocks Authentication Guide

## 📚 Tổng quan

File `liveblocks-auth/route.ts` xử lý authentication cho Liveblocks collaborative editing.

## 🔄 So sánh với code cũ

### ❌ Code cũ (Clerk + Convex)
```typescript
- Dùng Clerk authentication (@clerk/nextjs)
- Dùng Convex database
- Check ownership hoặc organization membership
```

### ✅ Code mới (JWT + Postgres)
```typescript
✅ Dùng JWT authentication (cookies)
✅ Dùng Postgres database (Drizzle ORM)
✅ Check membership trong organization
```

## 🔐 Flow Authentication

```
1. Client request access to document
   ↓
2. Server verify JWT token từ cookies
   ↓
3. Get user từ database
   ↓
4. Get document từ database
   ↓
5. Check user có phải member của organization không
   ↓
6. Create Liveblocks session với userInfo
   ↓
7. Grant FULL_ACCESS cho room (document)
   ↓
8. Return authorized session
```

## 📋 Request/Response

### Request
```typescript
POST /api/liveblocks-auth
Cookie: access_token=xxx

Body:
{
  "room": "document-id-uuid"
}
```

### Response Success (200)
```typescript
{
  // Liveblocks session data
  token: "...",
  ...
}
```

### Response Errors
- **401 Unauthorized**: No token, invalid token, user not found
- **403 Forbidden**: User not member of organization
- **404 Not Found**: Document not found
- **400 Bad Request**: Missing room ID
- **500 Internal Server Error**: Server error

## 🔑 Security Checks

1. **JWT Token Validation**
   - Token phải có trong cookies
   - Token phải valid và chưa expired
   - Token phải chứa `userId`

2. **User Validation**
   - User phải tồn tại trong database

3. **Document Access**
   - Document phải tồn tại
   - User phải là member của organization owns document

## 🗄️ Database Queries

```typescript
// 1. Get user
SELECT * FROM users WHERE id = userId

// 2. Get document
SELECT * FROM documents WHERE id = room

// 3. Check membership
SELECT * FROM user_organizations 
WHERE userId = userId 
  AND organizationId = document.organizationId
```

## 🎯 Liveblocks Session

```typescript
session.prepareSession(userId, {
  userInfo: {
    name: user.name,        // Display name
    email: user.email,      // User email
    // avatar: user.avatar  // Optional avatar
  }
})

session.allow(room, session.FULL_ACCESS)
```

## 🔧 Environment Variables

```env
LIVEBLOCKS_SECRET_KEY=sk_xxx  # Required
JWT_SECRET=xxx                 # Required
```

## 🚀 Usage trong Client

```typescript
import { LiveblocksProvider } from "@liveblocks/react";

<LiveblocksProvider authEndpoint="/api/liveblocks-auth">
  <YourEditor documentId={documentId} />
</LiveblocksProvider>
```

## 📝 Notes

- **Organization-based access**: Tất cả members của organization đều có quyền access document
- **No owner check**: Không check owner riêng, chỉ check organization membership
- **Full access**: Tất cả members đều có FULL_ACCESS (read + write)

## 🔄 Future Improvements

1. **Role-based permissions**
   ```typescript
   if (membership.role === "owner" || membership.role === "admin") {
     session.allow(room, session.FULL_ACCESS);
   } else {
     session.allow(room, session.READ_ACCESS);
   }
   ```

2. **Avatar support**
   - Add `avatar` field to users table
   - Include in Liveblocks userInfo

3. **Presence tracking**
   - Track who's currently editing
   - Show cursor positions

4. **Rate limiting**
   - Prevent abuse
   - Limit requests per user/IP
