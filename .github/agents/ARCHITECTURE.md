# 🏗️ Agent Architecture — Visual Guide

## Agent Hierarchy

```mermaid
graph TD
    A[🏛️ Architect Agent<br/>System Design Authority] --> B[🗄️ Database Agent<br/>MongoDB Data Layer]
    A --> C[🔧 Backend Agent<br/>API & Business Logic]
    A --> D[🎨 Frontend Agent<br/>UI & Client-Side]
    
    B --> C
    C --> D
    
    style A fill:#e1f5ff,stroke:#01579b,stroke-width:3px
    style B fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style C fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style D fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
```

## Feature Development Flow

```mermaid
sequenceDiagram
    participant User
    participant Architect
    participant Database
    participant Backend
    participant Frontend
    
    User->>Architect: Request new feature
    Architect->>Architect: Design system architecture
    Architect->>Architect: Define data model & API contract
    Architect->>Database: Schema & repository design
    Database->>Database: Implement collections & indexes
    Database->>Database: Create repositories & migrations
    Database-->>Backend: Data layer ready ✅
    
    Backend->>Backend: Implement API routes
    Backend->>Backend: Create service layer
    Backend->>Backend: Add validation & auth
    Backend->>Backend: Write tests
    Backend-->>Frontend: API endpoints ready ✅
    
    Frontend->>Frontend: Build UI components
    Frontend->>Frontend: Create pages & forms
    Frontend->>Frontend: Integrate with API
    Frontend->>Frontend: Style with Tailwind
    Frontend-->>User: Feature complete ✅
```

## Technology Stack Mapping

```mermaid
graph LR
    subgraph "🏛️ Architect"
        A1[Architecture Decisions]
        A2[Mermaid Diagrams]
        A3[API Contracts]
        A4[Schema Design]
    end
    
    subgraph "🗄️ Database"
        D1[MongoDB Collections]
        D2[Prisma Schema]
        D3[Repositories]
        D4[Indexes & Migrations]
    end
    
    subgraph "🔧 Backend"
        B1[Next.js API Routes]
        B2[Service Layer]
        B3[NextAuth.js]
        B4[Zod Validation]
    end
    
    subgraph "🎨 Frontend"
        F1[React Components]
        F2[Next.js Pages]
        F3[Tailwind CSS]
        F4[React Hook Form]
    end
    
    A1 --> D1
    A3 --> B1
    A4 --> D2
    
    D3 --> B2
    B1 --> F2
    
    style A1 fill:#e1f5ff
    style A2 fill:#e1f5ff
    style A3 fill:#e1f5ff
    style A4 fill:#e1f5ff
    
    style D1 fill:#fff3e0
    style D2 fill:#fff3e0
    style D3 fill:#fff3e0
    style D4 fill:#fff3e0
    
    style B1 fill:#f3e5f5
    style B2 fill:#f3e5f5
    style B3 fill:#f3e5f5
    style B4 fill:#f3e5f5
    
    style F1 fill:#e8f5e9
    style F2 fill:#e8f5e9
    style F3 fill:#e8f5e9
    style F4 fill:#e8f5e9
```

## Responsibility Matrix

| Task | Architect | Database | Backend | Frontend |
|------|-----------|----------|---------|----------|
| **Design Phase** |
| System architecture | ✅ | ❌ | ❌ | ❌ |
| Data model design | ✅ | 🤝 | ❌ | ❌ |
| API contracts | ✅ | ❌ | 🤝 | ❌ |
| Sequence diagrams | ✅ | ❌ | ❌ | ❌ |
| **Database Layer** |
| MongoDB schema | ❌ | ✅ | ❌ | ❌ |
| Indexes | ❌ | ✅ | ❌ | ❌ |
| Repositories | ❌ | ✅ | ❌ | ❌ |
| Migrations | ❌ | ✅ | ❌ | ❌ |
| Transactions | ❌ | ✅ | 🤝 | ❌ |
| **Backend Layer** |
| API routes | ❌ | ❌ | ✅ | ❌ |
| Business logic | ❌ | ❌ | ✅ | ❌ |
| Auth & authz | ❌ | ❌ | ✅ | ❌ |
| Validation schemas | ❌ | ❌ | ✅ | ❌ |
| Backend tests | ❌ | ❌ | ✅ | ❌ |
| **Frontend Layer** |
| UI components | ❌ | ❌ | ❌ | ✅ |
| Pages & layouts | ❌ | ❌ | ❌ | ✅ |
| Forms | ❌ | ❌ | ❌ | ✅ |
| Styling | ❌ | ❌ | ❌ | ✅ |
| Client-side logic | ❌ | ❌ | ❌ | ✅ |

**Legend:**
- ✅ Primary responsibility
- 🤝 Collaborative responsibility
- ❌ Not responsible

## File Organization by Agent

```
Gen-AI-Kata/
├── .github/agents/          # Agent definitions
│   ├── architect.md         # 🏛️
│   ├── database.agent.md    # 🗄️
│   ├── backend.agent.md     # 🔧
│   ├── frontend.agent.md    # 🎨
│   └── README.md
│
├── prisma/
│   ├── schema.prisma        # 🗄️ Database
│   └── seed.ts              # 🗄️ Database
│
├── src/
│   ├── app/
│   │   ├── api/             # 🔧 Backend
│   │   │   └── **/route.ts
│   │   ├── dashboard/       # 🎨 Frontend
│   │   │   ├── admin/
│   │   │   └── employee/
│   │   ├── layout.tsx       # 🎨 Frontend
│   │   └── page.tsx         # 🎨 Frontend
│   │
│   ├── components/          # 🎨 Frontend
│   │   ├── ui/
│   │   ├── forms/
│   │   └── features/
│   │
│   ├── lib/
│   │   ├── db/              # 🗄️ Database
│   │   │   ├── client.ts
│   │   │   └── repositories/
│   │   ├── services/        # 🔧 Backend
│   │   ├── auth.ts          # 🔧 Backend
│   │   ├── validators.ts    # 🔧 Backend
│   │   ├── types.ts         # 🔧 Backend + 🗄️ Database
│   │   └── constants.ts     # 🔧 Backend
│   │
│   ├── hooks/               # 🎨 Frontend
│   └── middleware.ts        # 🔧 Backend
│
├── __tests__/               # 🔧 Backend + 🎨 Frontend
└── docs/                    # 🏛️ Architect
```

## Common Workflows

### 1. New Feature (Full Stack)

```bash
Step 1: @architect design [feature] with data model and API contract
Step 2: @database implement collections and repositories
Step 3: @backend implement API routes and services
Step 4: @frontend build UI pages and components
```

### 2. Database Schema Change

```bash
Step 1: @architect review schema change impact
Step 2: @database plan migration for [change]
Step 3: @database implement migration script
Step 4: @backend update services to use new schema
Step 5: @frontend update components if needed
```

### 3. New API Endpoint

```bash
Step 1: @architect define API contract for [endpoint]
Step 2: @backend implement api [resource]
Step 3: @backend add validation and tests
Step 4: @frontend integrate with new endpoint
```

### 4. UI Enhancement

```bash
Step 1: @architect review if API changes needed
Step 2: @frontend implement component [name]
Step 3: @frontend style with Tailwind
Step 4: @frontend test responsive behavior
```

---

**Quick Reference Card**

| Need | Agent | Command Example |
|------|-------|-----------------|
| System design | 🏛️ | `@architect design approval workflow` |
| Database work | 🗄️ | `@database add indexes for requests` |
| API endpoint | 🔧 | `@backend implement api requests` |
| UI component | 🎨 | `@frontend create request form` |
| Diagram | 🏛️ | `@architect sequence diagram for login` |
| Migration | 🗄️ | `@database migration add field` |
| Auth/Security | 🔧 | `@backend harden auth` |
| Styling | 🎨 | `@frontend style navbar` |
