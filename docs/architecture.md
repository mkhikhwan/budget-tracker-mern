# Project Architecture

## Backend Structure
The backend follows a layered architecture to separate concerns.

- **`src/controllers/`**: Handles HTTP requests/responses and orchestrates calls to services.
- **`src/services/`**: Contains the core business logic and interacts with data models.
- **`src/routes/`**: Defines API endpoints and maps them to controllers.
- **`src/middleware/`**: Handles cross-cutting concerns like Authentication (`Auth.ts`) and validation.
- **`src/models/`**: Defines database schemas and entities.

## Frontend Structure
The frontend employs a **Feature-Based** architecture. Instead of grouping files by type (all components together), files are grouped by the business feature they belong to.

- **`src/features/`**: Contains domain-specific modules (e.g., `auth`, `transactions`).
  - **`components/`**: UI components specific to that feature.
  - **`pages/`**: Top-level page components for routes.
  - **`providers/`**: Context providers (e.g., `AuthProvider.tsx`).
  - **`*.api.ts`**: API client functions for the feature.
  - **`*.types.ts`**: TypeScript definitions for the feature.
- **`src/shared/`**: Contains reusable code shared across multiple features.
  - **`components/`**: Generic UI elements (e.g., `NavBar`, `Button`).
  - **`layouts/`**: Page layout wrappers (e.g., `PageLayout`).
  - **`pages/`**: Generic pages (e.g., `LoadingPage`).

## Shared Contracts
To ensure full-stack type safety, a shared library (aliased as `@budget-now/contract`) is used.

- **Shared Types**: Contains DTOs (e.g., `LoginDto`, `RegisterDto`) and interfaces (e.g., `UserTokenPayload`) used by both Backend and Frontend.
- **Consistency**: Serves as the single source of truth for API signatures, preventing integration errors.

## Feature Development Workflow
To add a new feature, follow these steps to ensure consistency across the stack:

1. **Define Contracts (Shared)**:
   - Define request/response DTOs and types in `@budget-now/contract`. This establishes the "interface" between frontend and backend.

2. **Backend Implementation**:
   - **Model**: Define schemas in `src/models/`.
   - **Service**: Implement business logic in `src/services/`.
   - **Controller**: Handle HTTP requests/responses in `src/controllers/`, using the shared DTOs for validation/typing.
   - **Route**: Map the endpoint in `src/routes/` (and add middleware if needed).

3. **Frontend Implementation**:
   - **API Layer**: Add the function to call the new endpoint in `src/features/<feature>/<name>.api.ts`.
   - **UI/Logic**: Create components and pages in `src/features/<feature>/`, utilizing the shared types.