# Smart Appointment & Queue Manager — Sprint Backlog

## Summary of Codebase Analysis

### Existing Infrastructure

| Area           | Status     | Details                                                              |
| -------------- | ---------- | -------------------------------------------------------------------- |
| Frontend Stack | ✅ Ready   | React 19, Vite 7, TypeScript 5.9, Tailwind 4, Zustand 5, SWR 2       |
| Backend Stack  | ✅ Ready   | NestJS 11, MongoDB (Mongoose 9), Zod validation                      |
| Auth Module    | ⚠️ Partial | Mock login implemented; guards, store, routes exist but no real API  |
| UI Components  | ⚠️ Minimal | `Button`, `Card`, `Input`, `Label` only                              |
| API Client     | ✅ Ready   | Axios wrapper with typed responses                                   |
| Error Handling | ✅ Ready   | `ErrorBoundary`, global error handlers                               |
| Routing        | ✅ Ready   | React Router 7 with auth guards (`authenticated`, `guest`, `public`) |

### Major Gaps Identified

| PRD Feature                | Current State   | Gap Analysis                                      |
| -------------------------- | --------------- | ------------------------------------------------- |
| **Authentication**         | Mock user login | Needs real API integration, demo user button      |
| **Staff Management**       | ❌ Missing      | Full CRUD module required (frontend + backend)    |
| **Service Definition**     | ❌ Missing      | Full CRUD module required (frontend + backend)    |
| **Appointment Management** | ❌ Missing      | Full CRUD + status workflow required              |
| **Assignment Rules**       | ❌ Missing      | Staff capacity logic, conflict detection required |
| **Waiting Queue**          | ❌ Missing      | Queue management UI + backend logic               |
| **Dashboard**              | ❌ Placeholder  | Stats, staff load summary, widgets required       |
| **Activity Log**           | ❌ Missing      | Event tracking system required                    |
| **Backend APIs**           | ❌ Empty        | Only base NestJS setup exists, no modules         |

### Technical Debt Notes

1. **Auth uses mock login** — `use-auth.ts` simulates API with `setTimeout`, must replace with real API call
2. **Dashboard is placeholder** — Current `DashboardPage.tsx` just shows links, needs complete redesign
3. **No shared form components** — Need `Select`, `DatePicker`, `TimePicker`, `Dialog`, `Toast`
4. **No data fetching patterns** — SWR is installed but no hooks implemented yet
5. **Backend has no modules** — Only `AppModule` with config exists

---

## Sprint Backlog Stories

---

### EPIC 1: Backend Infrastructure & Core APIs

---

#### Story 1.1: Setup MongoDB Connection & Base Module Structure

**Goal**: Establish MongoDB connection and create reusable module patterns.

- [x] Create `src/common/` directory structure on backend
  - [x] `src/common/dto/pagination.dto.ts` — generic pagination DTO
  - [x] `src/common/interfaces/base-model.interface.ts` — common fields (id, createdAt, updatedAt)
  - [x] `src/common/filters/http-exception.filter.ts` — global exception filter
  - [x] `src/common/interceptors/transform.interceptor.ts` — response transformation
- [x] Update `app.module.ts` to include `MongooseModule.forRoot()`
- [x] Create `.env.development` with `MONGODB_URI` variable
- [x] **Verify**: Run `npm run start:dev` and confirm MongoDB connection log

---

#### Story 1.2: Implement Auth Module (Backend)

**Goal**: Create authentication endpoints with JWT.

- [x] Create `src/auth/` module structure
  - [x] `auth.module.ts` — module definition
  - [x] `auth.controller.ts` — endpoints: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
  - [x] `auth.service.ts` — business logic
  - [x] `dto/login.dto.ts` — Zod-validated login payload
  - [x] `dto/register.dto.ts` — Zod-validated register payload
  - [x] `strategies/jwt.strategy.ts` — Passport JWT strategy
  - [x] `guards/jwt-auth.guard.ts` — protect routes
- [x] Create `src/users/` module for user management
  - [x] `user.schema.ts` — Mongoose schema (email, password hash, name, role)
  - [x] `users.service.ts` — findByEmail, createUser
- [x] Add bcrypt for password hashing
- [x] Add `@nestjs/jwt` and `@nestjs/passport` dependencies
- [x] Create demo user seed: `demo@example.com` / `demo123`
- [x] **Verify**:
  - [x] `POST /auth/register` creates user → returns JWT
  - [x] `POST /auth/login` with valid creds → returns JWT
  - [x] `GET /auth/me` with Bearer token → returns user object

---

#### Story 1.3: Implement Staff CRUD API (Backend)

**Goal**: Create staff management endpoints.

- [x] Create `src/staff/` module
  - [x] `staff.schema.ts` — name, serviceType, dailyCapacity (default 5), availabilityStatus (enum: Available, On Leave), userId (owner)
  - [x] `dto/create-staff.dto.ts`
  - [x] `dto/update-staff.dto.ts`
  - [x] `staff.controller.ts` — `GET /staff`, `POST /staff`, `PUT /staff/:id`, `DELETE /staff/:id`
  - [x] `staff.service.ts` — CRUD operations scoped to authenticated user
- [x] Add index on `userId` for efficient queries
- [x] **Verify**:
  - [x] Create staff member → 201 response
  - [x] List staff → returns array scoped to user
  - [x] Update staff → changes reflected
  - [x] Delete staff → 204 response

---

#### Story 1.4: Implement Service Definition API (Backend)

**Goal**: Create service definition endpoints.

- [x] Create `src/services-definition/` module
  - [x] `service-definition.schema.ts` — name, duration (15/30/60), requiredStaffType, userId
  - [x] `dto/create-service.dto.ts`
  - [x] `dto/update-service.dto.ts`
  - [x] `services-definition.controller.ts` — CRUD endpoints
  - [x] `services-definition.service.ts`
- [x] **Verify**: CRUD operations work (create, list, update, delete)

---

#### Story 1.5: Implement Appointment CRUD API (Backend)

**Goal**: Create appointment management endpoints with status workflow.

- [x] Create `src/appointments/` module
  - [x] `appointment.schema.ts`:
    - `customerName`, `serviceId` (ref), `staffId` (nullable ref), `appointmentDate`, `appointmentTime`
    - `status` (enum: Scheduled, Completed, Cancelled, No-Show, Waiting)
    - `queuePosition` (nullable)
    - `userId` (owner)
  - [x] `dto/create-appointment.dto.ts`
  - [x] `dto/update-appointment.dto.ts`
  - [x] `appointment.controller.ts`:
    - `GET /appointments` — list with filters (date, staff, status)
    - `POST /appointments` — create with conflict check
    - `PUT /appointments/:id` — update with conflict check
    - `DELETE /appointments/:id` — cancel
    - `PATCH /appointments/:id/status` — change status
  - [x] `appointment.service.ts`:
    - Implement conflict detection (same staff + overlapping time)
    - Implement staff capacity check (count appointments for staff on date)
    - If no staff available, set status=Waiting and assign queuePosition
- [x] **Verify**:
  - [x] Create appointment for staff with capacity → Success
  - [x] Create conflicting appointment → 409 Conflict error
  - [x] Create appointment when staff at capacity → Goes to Waiting Queue

---

#### Story 1.6: Implement Waiting Queue API (Backend)

**Goal**: Create queue management endpoints.

- [x] Add to `appointments.controller.ts`:
  - [x] `GET /appointments/queue` — list Waiting appointments sorted by time
  - [x] `POST /appointments/queue/assign/:staffId` — assign earliest queue item to staff
- [x] Add to `appointments.service.ts`:
  - [x] `getQueue()` — filter by status=Waiting, sort by appointmentDate+Time
  - [x] `assignFromQueue(staffId)` — pop earliest, assign to staff, set status=Scheduled
  - [x] Recalculate `queuePosition` after assignment
- [x] **Verify**:
  - [x] Queue returns Waiting appointments in correct order
  - [x] Assign from queue → appointment status changes to Scheduled

---

#### Story 1.7: Implement Activity Log API (Backend)

**Goal**: Track important assignment actions.

- [x] Create `src/activity-log/` module
  - [x] `activity-log.schema.ts`:
    - `action` (enum: QueueToStaff, ManualAssign, StatusChange)
    - `description`, `appointmentId`, `staffId`, `timestamp`, `userId`
  - [x] `activity-log.service.ts` — create log entry, get recent logs (limit 10)
  - [x] `activity-log.controller.ts` — `GET /activity-logs`
- [x] Integrate logging into appointment assignment logic
- [x] **Verify**:
  - [x] Assign from queue → activity log created
  - [x] `GET /activity-logs` → returns latest 10

---

#### Story 1.8: Implement Dashboard Stats API (Backend)

**Goal**: Aggregated stats endpoint.

- [x] Create `src/dashboard/` module
  - [x] `dashboard.controller.ts` — `GET /dashboard/stats`
  - [x] `dashboard.service.ts`:
    - `getTodayStats()`: totalAppointments, completed, pending, waitingQueueCount
    - `getStaffLoad()`: array of { staffId, name, current, max, status }
- [x] **Verify**:
  - [x] Dashboard stats returns correct counts
  - [x] Staff load shows accurate capacity numbers

---

### EPIC 2: Frontend — Shared Components & Design System

---

#### Story 2.1: Add Required UI Components (shadcn/ui)

**Goal**: Expand component library for forms and dialogs.

- [x] Install/create components:
  - [x] `Select` — for dropdowns (staff type, status, duration)
  - [x] `Dialog` — for modals (create/edit forms)
  - [x] `Badge` — for status badges
  - [x] `Table` — for data lists
  - [x] `Sonner` — for notifications
  - [x] `Calendar` + `DatePicker` — for appointment date
  - [x] `TimePicker` — for appointment time
  - [x] `Avatar` — for staff display
  - [x] `Skeleton` — for loading states
  - [x] `Alert` — for warnings (capacity exceeded, conflicts)
- [x] **Verify**: Each component renders without errors in Storybook or test page

---

#### Story 2.2: Create Layout Component

**Goal**: Main app layout with sidebar navigation.

- [x] Create `src/components/layouts/MainLayout.tsx`:
  - Sidebar with nav links (Dashboard, Staff, Services, Appointments, Queue)
  - Header with user info and logout
  - Main content area with `<Outlet />`
- [x] Create `src/components/layouts/Sidebar.tsx`
- [x] Create `src/components/layouts/Header.tsx`
- [x] Add icons from lucide-react
- [x] **Verify**: Navigate between pages, layout persists

---

### EPIC 3: Frontend — Auth Module Enhancement

---

#### Story 3.1: Connect Auth to Real API

**Goal**: Replace mock login with actual API calls.

- [x] Update `auth.service.ts` (already structured) to use real endpoints
- [x] Update `use-auth.ts`:
  - Replace mock `setTimeout` with `authService.login()`
  - Store JWT in localStorage
  - Add `register` function
- [x] Add token refresh logic if needed
- [x] **Verify**:
  - [x] Login with valid credentials → Dashboard redirect
  - [x] Login with invalid credentials → Error message shown

---

#### Story 3.2: Add Demo User Login Button

**Goal**: One-click demo access.

- [ ] Update `LoginForm.tsx`:
  - [ ] Add "Demo Login" button below form
  - [ ] On click → call login with `demo@example.com` / `demo123`
- [ ] Style button distinctly (secondary variant)
- [ ] **Verify**: Click demo button → auto-login → Dashboard

---

#### Story 3.3: Add Signup Page

**Goal**: User registration flow.

- [ ] Create `src/features/auth/pages/SignupPage.tsx`
- [ ] Create `src/features/auth/components/SignupForm.tsx`:
  - Fields: Name, Email, Password, Confirm Password
  - Validation with Zod
- [ ] Add route `/signup` with `auth: 'guest'`
- [ ] Add "Sign up" link on Login page
- [ ] **Verify**: Register new user → auto-login → Dashboard

---

### EPIC 4: Frontend — Staff Module

---

#### Story 4.1: Create Staff Feature Module Structure

**Goal**: Scaffold staff module following existing patterns.

- [ ] Create `src/features/staff/` structure:
  - [ ] `staff.types.ts` — Staff interface
  - [ ] `services/staff.service.ts` — API calls
  - [ ] `hooks/use-staff.ts` — SWR data fetching
  - [ ] `store/staff.store.ts` — if needed for local state
  - [ ] `routes/staff.routes.ts` — routes definition
  - [ ] `index.ts` — exports
- [ ] Register routes in `config/routes.ts`
- [ ] **Verify**: Route `/staff` accessible (empty page OK)

---

#### Story 4.2: Staff List Page

**Goal**: Display all staff with CRUD actions.

- [ ] Create `src/features/staff/pages/StaffListPage.tsx`:
  - Fetch staff with `useStaff()` hook
  - Display in `Table` component
  - Columns: Name, Service Type, Daily Capacity, Status, Actions
  - "Add Staff" button → opens dialog
  - Actions: Edit, Delete
- [ ] Show empty state when no staff
- [ ] Show loading skeleton while fetching
- [ ] **Verify**: Staff list displays correctly, CRUD works

---

#### Story 4.3: Staff Create/Edit Dialog

**Goal**: Form for staff management.

- [ ] Create `src/features/staff/components/StaffFormDialog.tsx`:
  - Fields: Name, Service Type (dropdown), Daily Capacity (number), Availability Status (switch/select)
  - Zod validation
  - Create vs Edit mode
- [ ] On submit → call API → refresh list → close dialog → show toast
- [ ] **Verify**: Create staff → appears in list; Edit staff → changes reflected

---

### EPIC 5: Frontend — Service Definition Module

---

#### Story 5.1: Create Service Feature Module Structure

**Goal**: Scaffold service module.

- [ ] Create `src/features/services-definition/` structure (same pattern as staff)
- [ ] Register routes
- [ ] **Verify**: Route `/services` accessible

---

#### Story 5.2: Service List Page

**Goal**: Display and manage services.

- [ ] Create `ServiceListPage.tsx`:
  - Table: Name, Duration, Required Staff Type, Actions
  - Add/Edit/Delete functionality
- [ ] Create `ServiceFormDialog.tsx`:
  - Fields: Name, Duration (dropdown: 15/30/60), Required Staff Type (dropdown)
- [ ] **Verify**: CRUD operations work

---

### EPIC 6: Frontend — Appointment Module

---

#### Story 6.1: Create Appointment Feature Module Structure

**Goal**: Scaffold appointment module.

- [ ] Create `src/features/appointments/` structure
- [ ] Register routes (`/appointments`)
- [ ] **Verify**: Route accessible

---

#### Story 6.2: Appointment List Page

**Goal**: Display appointments with filters.

- [ ] Create `AppointmentsListPage.tsx`:
  - Filters: Date (DatePicker), Staff (Select), Status (Select)
  - Table: Customer Name, Service, Staff, Date, Time, Status, Actions
  - Actions: Edit, Cancel, Mark Complete, Mark No-Show
  - "New Appointment" button
- [ ] Show status with color-coded badges
- [ ] **Verify**: Filtering works, CRUD works

---

#### Story 6.3: Appointment Create/Edit Dialog

**Goal**: Book appointments with validation.

- [ ] Create `AppointmentFormDialog.tsx`:
  - Fields:
    - Customer Name (input)
    - Service (Select — loads from services)
    - Staff (Select — shows `Name (X/Y appointments today)`)
    - Date (DatePicker)
    - Time (TimePicker)
  - Staff dropdown:
    - Filter by service's required staff type
    - Show capacity: `Farhan (3/5 appointments today)`
    - Show warning if at capacity: `⚠️ Farhan already has 5 appointments today`
  - On submit:
    - API returns conflict → show error Alert with options
    - API returns success → refresh + toast
- [ ] **Verify**:
  - [ ] Select staff → see capacity
  - [ ] Book at capacity → warning shown
  - [ ] Time conflict → error + options (pick another staff, change time)

---

#### Story 6.4: Appointment Status Workflow

**Goal**: Status transitions.

- [ ] Add status change buttons/menu on appointment row:
  - Scheduled → Completed, No-Show, Cancelled
  - Waiting → (only via queue assignment)
- [ ] Confirm before cancellation
- [ ] **Verify**: Status changes correctly, activity logged

---

### EPIC 7: Frontend — Waiting Queue Module

---

#### Story 7.1: Queue Management Page

**Goal**: View and manage waiting queue.

- [ ] Create `src/features/queue/pages/QueuePage.tsx`:
  - Display queue in priority order
  - Columns: Position (#1, #2...), Customer, Service, Requested Time
  - "Assign" button per row → opens staff selector
- [ ] Create `QueueAssignDialog.tsx`:
  - Select available staff (filter by service type + has capacity)
  - Confirm → API call → refresh → toast
- [ ] Show empty state: "No appointments in queue"
- [ ] **Verify**: Queue shows correct order, assign works

---

### EPIC 8: Frontend — Dashboard

---

#### Story 8.1: Dashboard Stats Widgets

**Goal**: Display daily summary.

- [ ] Redesign `DashboardPage.tsx`:
  - 4 stat cards:
    - Total Appointments Today
    - Completed
    - Pending
    - Waiting Queue Count
  - Use `Card` component with icons
- [ ] Fetch stats from `GET /dashboard/stats`
- [ ] **Verify**: Stats show correct numbers

---

#### Story 8.2: Staff Load Summary Widget

**Goal**: Display staff workload.

- [ ] Add Staff Load section to dashboard:
  - List each staff: `Name — X / Y (status badge)`
  - Status badge colors:
    - Green: OK (under capacity)
    - Yellow: Near capacity (1 slot left)
    - Red: Booked (at capacity)
    - Gray: On Leave
- [ ] **Verify**: Load shows correctly, colors match capacity

---

#### Story 8.3: Activity Log Widget

**Goal**: Display recent actions.

- [ ] Add Activity Log section to dashboard:
  - List last 5-10 logs
  - Format: `HH:MM AM/PM — Description`
  - Example: `11:45 AM — Appointment for "John Doe" auto-assigned to Riya.`
- [ ] Fetch from `GET /activity-logs`
- [ ] **Verify**: Logs display correctly

---

### EPIC 9: Integration & Testing

---

#### Story 9.1: End-to-End Flow Testing

**Goal**: Verify complete user flows.

- [ ] Test: Register → Create Staff → Create Service → Book Appointment → Complete
- [ ] Test: Book when staff at capacity → Goes to queue → Assign from queue
- [ ] Test: Time conflict detection → Error shown → Change time → Success
- [ ] Test: Demo login → Access all features
- [ ] **Verify**: All flows work without errors

---

#### Story 9.2: Unit Tests for Backend Services

**Goal**: Test critical business logic.

- [ ] Test `AppointmentService.checkConflict()`
- [ ] Test `AppointmentService.checkCapacity()`
- [ ] Test `AppointmentService.assignFromQueue()`
- [ ] Test `ActivityLogService.createLog()`
- [ ] **Verify**: All tests pass (`npm run test`)

---

#### Story 9.3: Frontend Component Tests

**Goal**: Test critical UI interactions.

- [ ] Test `AppointmentFormDialog` validation
- [ ] Test `StaffFormDialog` submit
- [ ] Test `QueueAssignDialog` flow
- [ ] Test auth guards redirect correctly
- [ ] **Verify**: All tests pass (`npm run test:run`)

---

### EPIC 10: Documentation

---

#### Story 10.1: API Documentation

**Goal**: Document all endpoints.

- [ ] Add Swagger/OpenAPI via `@nestjs/swagger`
- [ ] Document all endpoints with examples
- [ ] **Verify**: `/api/docs` shows swagger UI

---

#### Story 10.2: README Updates

**Goal**: Project setup instructions.

- [ ] Update `frontend/README.md` with setup steps
- [ ] Update `backend/README.md` with:
  - Environment variables
  - MongoDB setup
  - Demo user credentials
- [ ] **Verify**: New developer can setup project from README

---

## Risk Register

| Risk                              | Impact | Mitigation                                        |
| --------------------------------- | ------ | ------------------------------------------------- |
| MongoDB schema changes mid-sprint | High   | Finalize schemas before coding                    |
| Time conflict logic edge cases    | Medium | Define business rules clearly (overlapping times) |
| Staff capacity timezone issues    | Medium | Store all times in UTC, display in local          |
| Auth token expiry handling        | Low    | Implement refresh token flow                      |

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Code follows existing patterns in codebase
- [ ] TypeScript strict mode passes (no `any`)
- [ ] Unit tests written for business logic
- [ ] Visual QA passed (responsive, accessible)
- [ ] Activity logging works for key actions
- [ ] Demo user can complete full flow
