# 📝 Docs Clone - Collaborative Document Editor

> Ứng dụng soạn thảo tài liệu trực tuyến hỗ trợ cộng tác theo thời gian thực, tương tự Google Docs.

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)](https://www.postgresql.org/)
[![Liveblocks](https://img.shields.io/badge/Liveblocks-2.12-orange)](https://liveblocks.io/)

---

## 🎯 Mô Tả Dự Án

**Docs Clone** là một nền tảng soạn thảo tài liệu đám mây cho phép nhiều người dùng cùng chỉnh sửa tài liệu đồng thời. Hệ thống hỗ trợ quản lý tổ chức (organizations), phân quyền người dùng, và đồng bộ hóa nội dung theo thời gian thực.

### ✨ Tính Năng Chính

- **🔐 Xác thực & Phân quyền**
  - Đăng ký/đăng nhập với JWT (Access Token + Refresh Token)
  - Quản lý phiên đăng nhập (session tracking)
  - Tự động làm mới token qua middleware
  - Hỗ trợ reset mật khẩu và xác thực email

- **📄 Quản Lý Tài Liệu**
  - Tạo, chỉnh sửa, xóa, đổi tên tài liệu
  - Rich text editor với TipTap (hỗ trợ bảng, hình ảnh, links, tasks, v.v.)
  - Templates có sẵn (Business Letter, Resume, Project Proposal, v.v.)
  - Tìm kiếm và lọc tài liệu

- **👥 Cộng Tác Thời Gian Thực**
  - Nhiều người dùng chỉnh sửa cùng lúc
  - Hiển thị con trỏ (cursor) của người khác
  - Đồng bộ hóa tức thì với Liveblocks + Y.js protocol
  - Xem danh sách người đang online

- **🏢 Quản Lý Tổ Chức**
  - Tạo và quản lý nhiều organizations
  - Phân quyền thành viên (owner, admin, member)
  - Chia sẻ tài liệu trong organization
  - Chuyển đổi giữa các tổ chức

- **📊 Báo Cáo & Thống Kê**
  - Theo dõi hoạt động người dùng
  - Lịch sử chỉnh sửa tài liệu
  - Dashboard thống kê

### 📸 Ảnh Chụp Màn Hình

<!-- TODO: Thêm screenshots -->

#### 1. Trang Chủ - Danh Sách Tài Liệu

<img src="img/{9E33C43B-D94A-4584-B5ED-3222721935F3}.png" alt="Mô tả">

#### 2. Trình Soạn Thảo - Real-time Collaboration
<img src="img/{3EB0F388-AC40-4F84-ABB6-F18AF766C538}.png" alt="Mô tả">


#### 3. Templates Gallery
<img src="img/{E7A29043-3687-4E89-BF7D-54FADC8235C3}.png" alt="Mô tả" >


#### 4. Organization Switcher
<img src="img/{5826468C-1E5A-4B27-8151-421030AD532F}.png" alt="Mô tả" >


---

## 🏗️ Kiến Trúc Hệ Thống

### Sơ Đồ Kiến Trúc Tổng Thể

```mermaid
flowchart TB
    subgraph Client["🖥️ CLIENT LAYER (Presentation)"]
        UI["React UI Components\n(Radix + Tailwind)"]
        Editor["TipTap Rich Text Editor"]
        LiveClient["Liveblocks Client\n(Real-time Sync)"]
        State["State Management\n(Zustand + React Query)"]
    end

    subgraph Server["⚙️ SERVER LAYER (Application/Business Logic)"]
        Middleware["Middleware\n(JWT Auth + Auto Refresh)"]
        API["API Routes\n(Next.js)"]
        AuthService["Auth Service\n(Login/Register/Refresh)"]
        DocService["Document Service\n(CRUD Operations)"]
        LiveAuth["Liveblocks Auth\n(Room Access Control)"]
    end

    subgraph Data["💾 DATA LAYER (Persistence)"]
        DB[(PostgreSQL\nDrizzle ORM)]
        LiveBlocks[("Liveblocks Cloud\n(Y.js Storage)")]
    end

    UI --> Middleware
    Editor --> LiveClient
    State --> API
    
    Middleware --> API
    API --> AuthService
    API --> DocService
    API --> LiveAuth
    
    AuthService --> DB
    DocService --> DB
    LiveAuth --> LiveBlocks
    LiveClient --> LiveBlocks

    style Client fill:#e3f2fd
    style Server fill:#fff3e0
    style Data fill:#f3e5f5
```

### Luồng Xác Thực & Làm Mới Token

```mermaid
flowchart LR
    User["👤 User"] -->|"1. Credentials"| Login["POST /api/login"]
    Login -->|"2. Verify"| DB[("PostgreSQL")]
    DB -->|"3. User data"| Login
    Login -->|"4. Create JWT"| JWT["JWT Service"]
    JWT -->|"5. Access Token (15m)"| Cookies["🍪 HTTP-only Cookies"]
    JWT -->|"6. Refresh Token (7d)"| DB
    Cookies -->|"7. Response"| User
    
    User -->|"8. Request"| Protected["Protected Route"]
    Protected -->|"9. Check token"| MW["Middleware"]
    MW -->|"10a. Valid"| Allow["✅ Allow"]
    MW -->|"10b. Expired"| Refresh["Auto Refresh"]
    Refresh -->|"11. New token"| Cookies
    Refresh -->|"12. Continue"| Allow
    MW -->|"10c. Invalid"| Reject["❌ Redirect /sign-in"]

    style Login fill:#4caf50
    style MW fill:#ff9800
    style Cookies fill:#fff3bf
    style DB fill:#f9f
```

### Tech Stack

#### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.4 | Full-stack React framework với App Router |
| **React** | 19.1 | UI library |
| **TypeScript** | 5.x | Type safety |
| **TipTap** | 2.10 | Rich text editor (ProseMirror based) |
| **Liveblocks** | 2.12 | Real-time collaboration infrastructure |
| **TailwindCSS** | 3.x | Utility-first CSS framework |
| **Radix UI** | Latest | Accessible component primitives |
| **shadcn/ui** | Latest | Pre-built component library |
| **Zustand** | Latest | Lightweight state management |
| **TanStack Query** | 5.90 | Data fetching & caching |

#### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 15.4 | RESTful API endpoints |
| **Jose** | 6.1 | JWT signing & verification |
| **bcryptjs** | 3.0 | Password hashing |
| **Drizzle ORM** | 0.44 | Type-safe SQL query builder |
| **PostgreSQL** | Latest | Relational database |
| **Y.js** | Latest | CRDT for collaborative editing |

#### **DevOps & Tools**
- **Drizzle Kit**: Database migrations
- **ESLint**: Code linting
- **Git**: Version control
- **npm**: Package manager

### 🤔 Lý Do Chọn Công Nghệ

#### **1. Next.js 15 (App Router)**
- ✅ Server Components giảm bundle size
- ✅ File-based routing đơn giản
- ✅ API routes tích hợp sẵn
- ✅ Middleware mạnh mẽ cho authentication
- ✅ Deploy dễ dàng (Vercel, Docker)

#### **2. TipTap + Liveblocks**
- ✅ TipTap: Mở rộng dễ dàng, ProseMirror battle-tested
- ✅ Liveblocks: Managed infrastructure cho real-time, không cần tự quản WebSocket
- ✅ Y.js: CRDT algorithm đảm bảo eventual consistency

#### **3. PostgreSQL + Drizzle ORM**
- ✅ Postgres: ACID compliance, relationships mạnh
- ✅ Drizzle: Type-safe, lightweight, migrations tự động
- ✅ Không có magic như TypeORM, performance tốt hơn Prisma

#### **4. JWT với Cookie-based Auth**
- ✅ HTTP-only cookies chống XSS
- ✅ Refresh token pattern cho UX tốt
- ✅ Stateless, dễ scale horizontally

---

## 🚀 Hướng Dẫn Chạy Dự Án

### Prerequisites

- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **PostgreSQL**: >= 14.x
- **Git**: Latest

### 📋 Biến Môi Trường

Tạo file `.env.local` ở thư mục root:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/docs_clone"

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_ACCESS_SECRET="your-access-token-secret-here"
JWT_REFRESH_SECRET="your-refresh-token-secret-here"

# Liveblocks (https://liveblocks.io/dashboard)
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY="pk_dev_xxxxx"
LIVEBLOCKS_SECRET_KEY="sk_dev_xxxxx"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Email service (for password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 🖥️ Chạy Local (Development)

#### **Bước 1: Clone & Install**

```bash
# Clone repository
git clone <repository-url>
cd docs-clone

# Install dependencies
npm install --legacy-peer-deps
```

#### **Bước 2: Setup Database**

```bash
# Tạo database
createdb docs_clone

# Generate migrations
npm run dbgen

# Push schema to database
npm run dbpush

# (Optional) Seed data mẫu
npm run seed
```

#### **Bước 3: Chạy Development Server**

```bash
npm run dev
```

Mở trình duyệt: [http://localhost:3000](http://localhost:3000)

### 🐳 Chạy với Docker

#### **Bước 1: Tạo Docker Compose**

Tạo file `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: docs_clone_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: docs_clone
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    container_name: docs_clone_app
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/docs_clone
      JWT_ACCESS_SECRET: your-access-secret
      JWT_REFRESH_SECRET: your-refresh-secret
      NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY: ${NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY}
      LIVEBLOCKS_SECRET_KEY: ${LIVEBLOCKS_SECRET_KEY}
    depends_on:
      - postgres

volumes:
  postgres_data:
```

#### **Bước 2: Tạo Dockerfile**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### **Bước 3: Run Docker**

```bash
docker-compose up -d
```

### 🌱 Seeding Database

Tạo file `src/db/seed.ts` (nếu chưa có) hoặc chạy:

```bash
node --loader ts-node/esm src/db/seed.ts
```

Script seed mẫu:

```typescript
import { db } from './index';
import { users, organizations, userOrganizations, documents } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const [user1] = await db.insert(users).values({
    email: 'admin@example.com',
    passwordHash: hashedPassword,
    name: 'Admin User',
    role: 'admin'
  }).returning();

  const [user2] = await db.insert(users).values({
    email: 'user@example.com',
    passwordHash: hashedPassword,
    name: 'Regular User',
    role: 'user'
  }).returning();

  // Create organizations
  const [org] = await db.insert(organizations).values({
    name: 'Demo Organization',
    description: 'Organization for demo purposes'
  }).returning();

  // Link users to org
  await db.insert(userOrganizations).values([
    { userId: user1.id, organizationId: org.id, role: 'owner' },
    { userId: user2.id, organizationId: org.id, role: 'member' }
  ]);

  // Create sample documents
  await db.insert(documents).values([
    {
      organizationId: org.id,
      title: 'Welcome Document',
      initialContent: '<h1>Welcome to Docs Clone!</h1><p>Start editing...</p>'
    },
    {
      organizationId: org.id,
      title: 'Project Proposal',
      initialContent: '<h1>Project Proposal</h1><p>Draft your proposal here...</p>'
    }
  ]);

  console.log('✅ Seeding completed!');
}

seed().catch(console.error);
```

---

## 👥 Tài Khoản Demo

### Tài Khoản Đã Seed

| Email | Password | Role | Quyền |
|-------|----------|------|-------|
| `admin@example.com` | `password123` | Admin | Full access, quản lý tổ chức |
| `user@example.com` | `password123` | User | Xem và chỉnh sửa documents |

### API Documentation

- **Swagger UI**: (Coming soon)
- **Postman Collection**: (Coming soon)

### Live Demo

- **Website**: (Chừa khoản trống - sẽ deploy sau)
- **Admin Panel**: (Chừa khoản trống)

---

## 📁 Cấu Trúc Thư Mục

```
docs-clone/
├── public/                      # Static assets
│   ├── logo.svg
│   ├── templates/              # Document template icons
│   └── ...
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (sign-in, sign-up)
│   │   ├── (home)/            # Home page & components
│   │   ├── api/               # API endpoints
│   │   │   ├── auth/          # Auth endpoints
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── refresh/
│   │   │   ├── logout/
│   │   │   ├── liveblocks-auth/
│   │   │   └── reports/
│   │   ├── documents/         # Document pages
│   │   │   └── [documentId]/  # Dynamic document editor
│   │   ├── profile/
│   │   ├── reports/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/             # Reusable components
│   │   ├── ui/                # Radix/shadcn components
│   │   ├── create-dialog.tsx
│   │   ├── rename-dialog.tsx
│   │   ├── remove-dialog.tsx
│   │   └── ...
│   ├── constants/              # App constants
│   │   ├── templates.ts
│   │   └── margins.ts
│   ├── contexts/               # React contexts
│   │   └── organization-context.tsx
│   ├── db/                     # Database layer
│   │   ├── index.ts           # DB connection
│   │   ├── schema.ts          # Drizzle schema
│   │   ├── seed.ts            # Seed script
│   │   └── migrations/        # SQL migrations
│   ├── extensions/             # TipTap extensions
│   │   ├── font-size.ts
│   │   └── line-height.ts
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-debounce.ts
│   │   ├── use-organization.ts
│   │   └── ...
│   ├── lib/                    # Utilities
│   │   ├── jwt.ts             # JWT helpers
│   │   └── utils.ts           # General utilities
│   ├── store/                  # Zustand stores
│   │   └── use-editor-store.ts
│   └── middleware.ts           # Next.js middleware (auth)
├── components.json             # shadcn config
├── drizzle.config.ts          # Drizzle config
├── liveblocks.config.ts       # Liveblocks types
├── next.config.ts             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
├── package.json
└── README.md
```

### Giải Thích Các Thư Mục Chính

- **`src/app/`**: Next.js App Router - mỗi folder là một route
- **`src/components/`**: Shared components, UI primitives
- **`src/db/`**: Database schema, queries, migrations
- **`src/hooks/`**: Custom hooks cho logic tái sử dụng
- **`src/lib/`**: Helper functions, utilities
- **`middleware.ts`**: Chạy trước mọi request, xử lý auth

---

## 📐 Conventions & Best Practices

### 🎨 Coding Style

#### **TypeScript**
- Strict mode enabled
- No `any` type (sử dụng `unknown` nếu cần)
- Prefer interfaces over types cho object shapes
- Use explicit return types cho functions

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
}

function getUser(id: string): Promise<User | null> {
  // ...
}

// ❌ Bad
function getUser(id: any) {
  // ...
}
```

#### **React Components**
- Functional components only
- Use named exports
- Props interface đặt tên với suffix `Props`

```typescript
// ✅ Good
interface DocumentCardProps {
  title: string;
  onDelete: () => void;
}

export function DocumentCard({ title, onDelete }: DocumentCardProps) {
  return <div>...</div>;
}
```

#### **File Naming**
- Components: `PascalCase.tsx` (ví dụ: `DocumentCard.tsx`)
- Utilities/hooks: `kebab-case.ts` (ví dụ: `use-debounce.ts`)
- API routes: `route.ts` (Next.js convention)

### 📝 Commit Messages

Tuân theo [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]
```

**Types:**
- `feat`: Tính năng mới
- `fix`: Sửa bug
- `docs`: Thay đổi documentation
- `style`: Code formatting (không ảnh hưởng logic)
- `refactor`: Refactor code
- `test`: Thêm/sửa tests
- `chore`: Cập nhật build, dependencies

**Examples:**
```bash
feat(auth): add password reset functionality
fix(editor): resolve cursor position sync issue
docs(readme): update installation instructions
refactor(api): simplify user query logic
```

### 🌿 Git Branching Strategy

```
main (production)
  ├── develop (staging)
  │   ├── feature/auth-system
  │   ├── feature/document-editor
  │   ├── bugfix/token-refresh
  │   └── hotfix/critical-bug
```

**Rules:**
1. `main`: Luôn production-ready
2. `develop`: Integration branch
3. `feature/*`: New features (branch from `develop`)
4. `bugfix/*`: Bug fixes (branch from `develop`)
5. `hotfix/*`: Critical fixes (branch from `main`)

**Workflow:**
```bash
# Tạo feature branch
git checkout develop
git pull
git checkout -b feature/new-feature

# Làm việc và commit
git add .
git commit -m "feat: implement new feature"

# Push và tạo Pull Request
git push -u origin feature/new-feature

# Sau khi review → merge vào develop
# Sau khi test → merge develop vào main
```

### 🔍 Code Review Checklist

- [ ] Code follows style guide
- [ ] TypeScript types are correct
- [ ] No console.logs in production code
- [ ] Error handling implemented
- [ ] Components are accessible (a11y)
- [ ] Performance considerations (memo, useMemo if needed)
- [ ] Tests added/updated (if applicable)

---

## 🎬 Kịch Bản Demo

### Use Case 1: Đăng Ký & Đăng Nhập

#### **UI Flow:**
1. Truy cập `/sign-up`
2. Nhập email, password, name
3. Submit → Redirect `/sign-in`
4. Đăng nhập → Redirect `/` (Home)

#### **API Calls:**
```bash
# Đăng ký
POST /api/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "New User"
}

# Đăng nhập
POST /api/login
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securepassword"
}

# Response: Sets HTTP-only cookies
Set-Cookie: access_token=...
Set-Cookie: refresh_token=...
```

---

### Use Case 2: Tạo & Chỉnh Sửa Document

#### **UI Flow:**
1. Tại trang chủ `/`, click "New Document"
2. Chọn template hoặc "Blank Document"
3. Editor mở tại `/documents/[id]`
4. Chỉnh sửa nội dung (real-time save)
5. Đổi tên document (click vào title)

#### **API Calls:**
```bash
# Tạo document mới
POST /api/documents
Content-Type: application/json
Cookie: access_token=...

{
  "title": "My New Document",
  "organizationId": "uuid-here",
  "templateId": "blank" // optional
}

# Lấy document
GET /api/documents/{documentId}
Cookie: access_token=...

# Đổi tên
PATCH /api/documents/{documentId}
Content-Type: application/json
Cookie: access_token=...

{
  "title": "Renamed Document"
}

# Xóa document
DELETE /api/documents/{documentId}
Cookie: access_token=...
```

---

### Use Case 3: Real-time Collaboration

#### **UI Flow:**
1. User A mở document `/documents/abc-123`
2. User B mở cùng document
3. User A gõ text → User B thấy ngay lập tức
4. Hiển thị cursor & selection của nhau
5. Tự động sync khi có conflict

#### **Technical Flow:**
```mermaid
sequenceDiagram
    participant A as User A (Browser)
    participant B as User B (Browser)
    participant LB as Liveblocks Server
    
    A->>LB: Connect to room "doc-abc-123"
    B->>LB: Connect to room "doc-abc-123"
    LB->>A: Room state + User B presence
    LB->>B: Room state + User A presence
    
    A->>LB: Text change: "Hello"
    LB->>B: Broadcast change
    B->>B: Apply Y.js update
    
    B->>LB: Text change: " World"
    LB->>A: Broadcast change
    A->>A: Apply Y.js update
    
    Note over A,B: Both see "Hello World"
```

---

### Use Case 4: Quản Lý Organization

#### **UI Flow:**
1. Click "Organization Switcher" (navbar)
2. Chọn "Create Organization"
3. Nhập tên organization
4. Mời thành viên qua email
5. Phân quyền: Owner/Admin/Member

#### **API Calls:**
```bash
# Tạo organization
POST /api/organizations
Content-Type: application/json
Cookie: access_token=...

{
  "name": "My Company",
  "description": "Our workspace"
}

# Mời thành viên
POST /api/organizations/{orgId}/invite
Content-Type: application/json
Cookie: access_token=...

{
  "email": "teammate@example.com",
  "role": "member"
}

# Lấy danh sách organizations
GET /api/organizations
Cookie: access_token=...
```

---

### Use Case 5: Tìm Kiếm Document

#### **UI Flow:**
1. Tại trang chủ, sử dụng search bar
2. Gõ keyword (debounced)
3. Kết quả filter real-time
4. Click để mở document

#### **API Calls:**
```bash
# Tìm kiếm
GET /api/documents?search=keyword&organizationId=uuid
Cookie: access_token=...

# Response
{
  "documents": [
    {
      "id": "uuid-1",
      "title": "Keyword in title",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-02T00:00:00Z"
    }
  ],
  "total": 1
}
```

---

## 📊 Database Schema

### ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    users ||--o{ refresh_tokens : has
    users ||--o{ user_sessions : has
    users ||--o{ email_verifications : has
    users ||--o{ password_resets : has
    users ||--o{ user_organizations : belongs_to
    organizations ||--o{ user_organizations : has
    organizations ||--o{ documents : owns

    users {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar name
        varchar role
        varchar imageUrl
        timestamp created_at
        timestamp updated_at
    }

    organizations {
        uuid id PK
        varchar name
        text description
        timestamp created_at
        timestamp updated_at
    }

    user_organizations {
        uuid user_id FK
        uuid organization_id FK
        varchar role
        timestamp joined_at
    }

    documents {
        uuid id PK
        uuid organization_id FK
        varchar title
        text initial_content
        timestamp created_at
        timestamp updated_at
    }

    refresh_tokens {
        uuid id PK
        uuid user_id FK
        varchar token
        timestamp expires_at
        boolean revoked
        timestamp created_at
    }

    user_sessions {
        uuid id PK
        uuid user_id FK
        varchar ip_address
        varchar user_agent
        timestamp login_time
        timestamp logout_time
    }

    email_verifications {
        uuid id PK
        uuid user_id FK
        varchar token
        timestamp expires_at
    }

    password_resets {
        uuid id PK
        uuid user_id FK
        varchar reset_token
        timestamp expires_at
    }
```

---

## 🧪 Testing (Coming Soon)

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test:coverage
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy!

### Docker Production

```bash
docker build -t docs-clone .
docker run -p 3000:3000 --env-file .env.production docs-clone
```

### Environment Variables for Production

```bash
NODE_ENV=production
DATABASE_URL=postgresql://... # Production DB
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=...
LIVEBLOCKS_SECRET_KEY=...
```

---

## 🤝 Contributing

Contributions are welcome! Please follow:

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Authors

- **Your Team Name** - [GitHub](https://github.com/yourteam)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Liveblocks](https://liveblocks.io/)
- [TipTap](https://tiptap.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)

---

## 📞 Support

Có vấn đề? Tạo [Issue](https://github.com/yourrepo/issues) hoặc liên hệ qua email.

---

**⭐ Nếu dự án hữu ích, hãy cho một star trên GitHub!**
