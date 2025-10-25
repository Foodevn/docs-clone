# Document Actions Guide

## 📚 File: `actions.ts`

Server actions cho document collaboration features.

## 🔄 So sánh với code cũ

### ❌ Code cũ (Clerk)
```typescript
- Dùng Clerk authentication
- Dùng clerkClient để get users
- Get users by organizationId từ Clerk
```

### ✅ Code mới (JWT + Postgres)
```typescript
✅ Dùng JWT authentication (cookies)
✅ Query Postgres database (Drizzle ORM)
✅ Get users from document's organization
```

## 🎯 Function: `getUser(documentId?)`

Lấy tất cả users trong organization của document để hiển thị trong mentions và collaboration features.

### Parameters
- `documentId` (optional): Document ID để lấy users từ organization của document đó
  - Nếu có: Lấy users từ organization của document
  - Nếu không: Lấy users từ organization đầu tiên của user

### Returns
```typescript
Array<{
  id: string;        // User UUID
  name: string;      // User name or email
  avatar: string;    // Avatar URL (generated from name)
}>
```

### Example Usage
```typescript
// In room.tsx
const users = await getUser(documentId);

// Without documentId (fallback to user's first org)
const users = await getUser();
```

## 🔐 Authentication Flow

```
1. Get JWT token from cookies
   ↓
2. Verify token and extract userId
   ↓
3. If documentId provided:
   - Get document's organizationId
   Else:
   - Get user's first organization
   ↓
4. Query all users in that organization
   ↓
5. Format and return user list
```

## 🗄️ Database Queries

### With documentId
```sql
-- 1. Get organization from document
SELECT organizationId FROM documents WHERE id = documentId;

-- 2. Get all users in organization
SELECT users.id, users.name, users.email
FROM users
INNER JOIN user_organizations ON users.id = user_organizations.userId
WHERE user_organizations.organizationId = organizationId;
```

### Without documentId
```sql
-- 1. Get user's first organization
SELECT organizationId FROM user_organizations 
WHERE userId = currentUserId LIMIT 1;

-- 2. Get all users in organization (same as above)
```

## 🎨 Avatar Generation

Sử dụng DiceBear API để generate avatar từ tên:
```typescript
avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
```

**Styles available:**
- `initials` - Hiển thị initials (đang dùng)
- `avataaars` - Cartoon avatars
- `bottts` - Robot avatars
- `identicon` - Geometric patterns

## 💡 Use Cases

### 1. **Mentions trong Editor**
```tsx
<LiveblocksProvider
  resolveMentionSuggestions={({ text }) => {
    return users.filter(user => 
      user.name.toLowerCase().includes(text.toLowerCase())
    );
  }}
>
```

### 2. **Show Collaborators**
```tsx
<LiveblocksProvider
  resolveUsers={({ userIds }) => {
    return userIds.map(userId => 
      users.find(user => user.id === userId)
    );
  }}
>
```

### 3. **Share Dialog**
Display list of users to share document with.

## 🔒 Security

1. **JWT Verification**: Chỉ authenticated users mới access được
2. **Organization Scoped**: Chỉ lấy users trong cùng organization
3. **No Sensitive Data**: Chỉ return id, name, email (không có password, tokens, etc.)

## 🚀 Usage in Components

### Client Component (room.tsx)
```tsx
const [users, setUser] = useState<User[]>([]);

const fetchUser = useMemo(
  () => async () => {
    try {
      const list = await getUser(documentId);
      setUser(list);
    } catch {
      toast.error("Failed to fetch users");
    }
  },
  [documentId]
);

useEffect(() => {
  fetchUser();
}, [fetchUser]);
```

## 📝 Response Format

```typescript
[
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=John%20Doe"
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "jane@example.com",  // Fallback to email if no name
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=jane%40example.com"
  }
]
```

## ⚠️ Error Handling

```typescript
try {
  const users = await getUser(documentId);
  // Success
} catch (error) {
  console.error("Error getting users:", error);
  return []; // Return empty array on error
}
```

**Errors returned as empty array:**
- No token
- Invalid token
- User not found
- No organization
- Database error

## 🔄 Future Improvements

1. **Caching**
   ```typescript
   // Cache users per organization
   const cache = new Map<string, User[]>();
   ```

2. **Pagination**
   ```typescript
   getUser(documentId, { limit: 50, offset: 0 })
   ```

3. **Search/Filter**
   ```typescript
   getUser(documentId, { search: "john" })
   ```

4. **Role Information**
   ```typescript
   {
     id: "...",
     name: "...",
     avatar: "...",
     role: "admin" // Add role from userOrganizations
   }
   ```

5. **Real Avatars**
   - Add `avatar` field to users table
   - Upload and store user avatars
   - Fallback to DiceBear if no avatar

## 📊 Performance

- **Single Query**: Uses JOIN to get users in one query
- **No N+1**: Avoids multiple queries
- **Lightweight**: Only returns necessary fields

## 🧪 Testing

```typescript
// Test with documentId
const users = await getUser("doc-id-123");
expect(users).toHaveLength(3);

// Test without documentId
const users = await getUser();
expect(users).toHaveLength(3);

// Test unauthorized
cookies().delete("access_token");
const users = await getUser();
expect(users).toEqual([]);
```
