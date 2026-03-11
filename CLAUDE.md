# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RadSync is a healthcare radiology management system built as a monorepo with a React frontend (`/client`) and ASP.NET Core backend (`/api`). It covers study management, patient data, PDF report generation, template management, FTP-based medical imaging, and real-time updates. Multi-site deployments are supported under `/sites/` (cebu, ndch, negros).

## Build & Run Commands

### Client (React 17 + TypeScript — `/client`)

```bash
cd client
npm install
npm start          # dev server at http://localhost:3000
npm run build      # production build
npm test           # unit tests
```

- Proxy in dev points to `http://localhost:44341/`
- Build output path configured in `.env`

### API (ASP.NET Core 5.0 — `/api`)

```bash
cd api
dotnet restore
dotnet build
dotnet run         # https://localhost:44341
```

- Swagger UI available at `/swagger`

### Database (MySQL + Dapper)

No EF Core migrations — schema is managed manually. Connection strings are in `appsettings.json` and `appsettings.Development.json`.

## Architecture

### Frontend (`/client/src/`)

- **Pages:** `LoginPage`, `StudyManagePage`, `StudyPage`, `TemplatePage`, `UserPasswordPage`
- **State management:** Redux with Redux Thunk — Actions, Reducers, Types in `/store/`
- **HTTP client:** Axios via a custom API service layer
- **UI library:** Material-UI (MUI) v5
- **Forms:** React Hook Form with Yup validation
- **PDF viewing:** `@react-pdf-viewer` packages
- **Rich text:** React Quill, with RTF support via custom component
- **Date utilities:** date-fns, moment

### Backend (`/api/`)

- **Data access:** Dapper (micro-ORM) with a custom `MySqlDbContext` for transaction management — no Entity Framework
- **Pattern:** Controllers → Services → Repositories → MySqlDbContext
- **Controllers:** `AuthController`, `ConfigController`, `LibraryController`, `StudyController`, `UserController`
- **Repositories:** `ConfigRepository`, `LibraryRepository`, `StudyRepository`, `UserRepository`
- **Auth:** JWT Bearer tokens via `JwtServices`
- **Real-time:** SignalR hubs (`ConsultHub`, `ConsultRoomHub`)
- **PDF generation:** iTextSharp, PuppeteerSharp, QRCoder utilities in `/Utilities/`
- **FTP integration:** FluentFTP for radiology imaging files
- **Middleware:** `ExceptionHandlingMiddleware`

### Full-Stack Feature Flow

When tracing or implementing a feature end-to-end, follow this chain:

```
React Page → /store/Actions → Axios API call → api/Controllers/{Entity}Controller.cs → api/Repository/{Entity}Repository.cs → MySqlDbContext
```

### Deployment

Multi-site support under `/sites/` (cebu, ndch, negros) with site-specific configuration. GitHub workflows in `.github/`. CORS is open in development (`AllowAnyOrigin`).

### Key Conventions

- **Environment config:** `.env` for client; `appsettings.json` / `appsettings.Development.json` for API
- **Database:** MySQL 8.0.22 via Dapper — write raw SQL in repositories, no LINQ-to-SQL
- **DTOs:** `AuthDtos`, `InpatientDtos`, `LibraryDtos`, `StudyDtos`, `UserDto`, `PagingDtos`, `ResponseDtos`

## Communication Protocol

- Ask for clarification before implementing if you're uncertain about requirements or approach
- Challenge wrong directions immediately with specific reasoning and better alternatives
- Files prefixed with @ are context references (e.g., "@study.service.ts" means find and read that file) — search related files if context is insufficient
- If you cannot track the files based on references, ask which files are needed instead of doing an entire project search
- Do not write `// TODO(human)` comments — implement the entire feature
- Do not use text icons in comments or message prompts
- Do not edit or write code using the Grep tool — always use the Edit tool
- Do not use the Bash tool for file operations (reading, writing, editing, searching). Always use the dedicated tools: Read, Write, Edit, Glob, Grep

## Code Standards

### React / TypeScript

- Explicit return types on all functions/methods
- No `any` or `unknown` — use proper types or create interfaces
- All variables and functions: `camelCase`
- Use `async/await` with Axios for HTTP requests
- Unsubscribe/cancel requests in `useEffect` cleanup or use AbortController
- Keep components focused — move logic to custom hooks or Redux actions
- Form validation via React Hook Form + Yup schemas
- Date display format: `dd-MMM-yyyy`
- Do not add comment docs in `.tsx`/`.scss` files unless logic is non-obvious

### .NET Core (C#)

- Use `<summary>` XML docs on all public methods explaining use case
- `camelCase` for function and variable names
- `snake_case` on properties of Dapper-mapped classes and their associated DTOs
- New controllers: create manually following `{Entity}Controller.cs` naming, inherit `ControllerBase`
- Write raw SQL in repository methods — do not use EF Core or LINQ providers
- Wrap multi-step DB operations in a `MySqlDbContext` transaction

### General

- DRY: extract repeated logic into reusable functions
- Single Responsibility: one function = one clear purpose
- Meaningful names: variables/functions should explain themselves
- Error handling: always handle edge cases and potential failures
- This is a monorepo — when implementing HTTP requests, trace the pattern from client action through to the API controller and repository

## Project-Specific Rules

- **Builds:** Request permission before building API or client
- **Database changes:** Coordinate schema changes manually — there are no migration tools in use
- **FTP/imaging files:** Changes to FTP integration should be tested against a dev FTP server, not production
- **Multi-site:** Configuration differences across sites (cebu, ndch, negros) live in `/sites/` — do not hardcode site-specific values
- **Comments:** Only for complex patterns/logic, not explanatory summaries
