# JWT Token Structure Guide

## 🔑 Token Payload Format

### Access Token (15m)
```typescript
{
  id: string,        // User ID (UUID)
  email: string,     // User email
  iat: number,       // Issued at
  exp: number,       // Expires at
  nbf: number        // Not before
}
```

### Refresh Token (7d)
```typescript
{
  id: string,        // User ID (UUID)
  iat: number,       // Issued at
  exp: number,       // Expires at
  nbf: number        // Not before
}
```

## 📝 Usage in APIs

### ✅ Correct Usage (Consistent)
```typescript
const payload = await verifyToken(token);
const userId = payload.id;  // ✅ Use 'id'
```

### ⚠️ Liveblocks Auth (Special Case)
```typescript
// Support both for backward compatibility
const userId = (payload?.userId || payload?.id) as string;
```

## 🔄 Token Creation

### Login API
```typescript
// src/app/api/login/route.ts
const accessToken = await signToken({ 
  id: user.id,        // ✅ User ID
  email: user.email   // ✅ Email
}, "15m");

const refreshToken = await signToken({ 
  id: user.id         // ✅ User ID only
}, "7d");
```

### Refresh API
```typescript
// src/app/api/refresh/route.ts
const newAccess = await signToken({ 
  id: payload.id      // ✅ User ID from old token
}, "15m");
```

## 📋 Verification Examples

### Standard API
```typescript
const cookieStore = await cookies();
const token = cookieStore.get("access_token")?.value;

const payload = await verifyToken(token);
if (!payload || !payload.id) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const userId = payload.id;  // ✅ Always use 'id'
```

### With Email
```typescript
const payload = await verifyToken(token);
const userId = payload.id;
const userEmail = payload.email;
```

## 🛡️ Security Notes

1. **Access Token**: Short-lived (15m), contains user info
2. **Refresh Token**: Long-lived (7d), minimal info
3. **HttpOnly Cookies**: Prevent XSS attacks
4. **Path**: Refresh token only on `/` path

## 🔧 Environment Variables

```env
JWT_SECRET=your-secret-key  # Required, minimum 32 characters
```

## 📊 Token Lifecycle

```
1. Login
   ↓
2. Create access_token (15m) + refresh_token (7d)
   ↓
3. Set httpOnly cookies
   ↓
4. Use access_token for API calls
   ↓
5. When access_token expires (< 15m left)
   ↓
6. Use refresh_token to get new access_token
   ↓
7. Repeat step 4
```

## ⚠️ Common Mistakes

### ❌ Wrong Field Name
```typescript
const userId = payload.userId;  // ❌ Field doesn't exist!
```

### ✅ Correct
```typescript
const userId = payload.id;      // ✅ Correct field name
```

### ❌ Missing Verification
```typescript
const userId = payload.id;      // ❌ What if payload is null?
```

### ✅ Correct
```typescript
if (!payload || !payload.id) {
  return error;
}
const userId = payload.id;      // ✅ Safe access
```

## 📦 All Files Using JWT

- `src/app/api/login/route.ts` - Create tokens
- `src/app/api/refresh/route.ts` - Refresh access token
- `src/app/api/auth/me/route.ts` - Get current user
- `src/app/api/db/organization/route.ts` - Organization CRUD
- `src/app/api/db/document/route.ts` - Document CRUD
- `src/app/api/liveblocks-auth/route.ts` - Liveblocks auth

## 🎯 Consistency Rules

1. **Always** use `payload.id` for user ID
2. **Never** use `payload.userId` (doesn't exist)
3. **Always** verify token before accessing payload
4. **Always** check if payload and required fields exist
5. **Use** `httpOnly: true` for cookies
