# Fix CRUD Operations for Appointments Management

## Summary of Gaps Found in Codebase

- **User Authentication Inconsistency**: Backend endpoints inconsistently use query parameters for userId instead of relying on JWT-authenticated user data, posing security risks and maintenance issues.
- **Missing Validation**: No checks prevent creating or updating appointments to past dates/times.
- **API Method Mismatch**: Frontend uses PUT for updates, backend uses PATCH, causing potential issues.
- **Redundant Query Params**: Frontend sends userId in queries, unnecessary if backend uses authenticated user.
- **Linting Issues**: ESLint rules disabled for return types in controller.
- **Type Safety**: Some types like staffId are weakly typed (string | null).
- **Error Handling**: Basic, could be more user-friendly.
- **Technical Debt**: Inconsistent patterns, TODOs for missing features like displaying service/staff names.
- **UI Issues**: Staff filter dropdown in appointments list page does not load actual staff options, showing only "All staff". On edit, staff and service fields are not prefilled correctly if the assigned staff doesn't match the service's required staff type.

## Stories

### Backend Refactor: Standardize User Authentication

- [x] Update `findAll` endpoint to use `req.user._id` instead of `@Query('userId')`
- [x] Update `getQueue` endpoint to use `req.user._id` instead of `@Query('userId')`
- [x] Update `assignFromQueue` endpoint to use `req.user._id` instead of `@Query('userId')`
- [x] Update `findOne` endpoint to use `req.user._id` instead of `@Query('userId')`
- [x] Update `update` endpoint to use `req.user._id` instead of `@Query('userId')`
- [x] Verify all endpoints now use authenticated user data
- [x] Run backend tests to ensure no regressions
- [x] Test API endpoints manually with JWT auth

### Backend Validation: Prevent Past Appointments

- [x] Add validation in `create` method to check if `appointmentDate` and `appointmentTime` are in the future
- [x] Add validation in `update` method to check if updated date/time are in the future
- [x] Throw `BadRequestException` with appropriate message for past appointments
- [x] Update DTOs if needed to include validation
- [x] Test creating past appointment fails
- [x] Test updating to past time fails

### Frontend API Alignment: Fix Update Method

- [x] Change `updateAppointment` in `appointments.service.ts` to use `apiClient.patch` instead of `put`
- [x] Update any related error handling if needed
- [x] Test appointment update works correctly

### Frontend Refactor: Remove Redundant UserId Queries

- [x] Remove `userId` from query params in `getAppointments`
- [x] Remove `userId` from query params in `getQueue`
- [x] Remove `userId` from query params in `assignFromQueue`
- [x] Update `use-appointments` hook to not pass `userId` in filters
- [x] Test that appointments still load correctly with auth

### Code Quality: Fix Linting Issues

- [x] Remove `/* eslint-disable @typescript-eslint/explicit-function-return-type */` from controller
- [x] Add explicit return types to all controller methods
- [x] Run linter and fix any other issues
- [x] Ensure build passes without warnings

### Type Safety: Improve Type Definitions

- [x] Change `staffId` in types to optional properly (e.g., `staffId?: string`)
- [x] Ensure consistency between frontend types and backend schemas
- [x] Update any related interfaces

### Error Management: Enhance Error Handling

- [ ] Improve error messages in backend for better user feedback
- [ ] Update frontend to handle specific error codes (e.g., 400 for past appointments)
- [ ] Add user-friendly error displays in UI

### Testing: Add Comprehensive Tests

- [ ] Write unit tests for past appointment validation
- [ ] Write unit tests for user auth consistency
- [ ] Write e2e tests for CRUD operations
- [ ] Test edge cases like updating status, deleting appointments
- [ ] Ensure all tests pass

### UI Enhancement: Populate Staff Filter Dropdown and Fix Edit Prefill

- [ ] Implement staff loading in `AppointmentsListPage.tsx` using existing `useStaff` hook
- [ ] Add staff options to the staff filter Select component
- [ ] Ensure staff list is filtered by user if needed
- [ ] Test that staff filter dropdown shows all available staff
- [ ] Verify filtering appointments by staff works correctly
- [ ] Fix edit form prefill: ensure current staff is included in dropdown options even if not matching service type
- [ ] Update `AppointmentFormDialog.tsx` to handle cases where assigned staff doesn't match service requirements
- [ ] Test editing appointments with mismatched staff/service works correctly

### Documentation: Update API Docs

- [ ] Update any API documentation to reflect changes
- [ ] Document the past appointment validation rule

This backlog ensures secure, consistent, and robust CRUD operations for appointments management.
