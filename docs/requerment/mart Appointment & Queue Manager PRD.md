# Smart Appointment & Queue Manager

## Overview

Build a web application to manage service appointments, staff availability, and customer queues, with conflict handling.

## Features

### 1. Authentication

- **User Login & Signup**: Users can register and log in using email and password.
- **Post-Login Redirect**: After login, redirect to Dashboard.
- **Demo User Login**: Provide a demo user login button with credentials.

### 2. Staff & Service Setup

- **Staff Management**:
  - Users can create staff members manually (no email required).
  - Each staff member has:
    - Name
    - Service Type (e.g., Doctor, Consultant, Support Agent)
    - Daily Capacity (max appointments per day: 5)
    - Availability Status: Available / On Leave
- **Service Definition**:
  - Users can define services:
    - Service Name (e.g., Consultation, Check-up)
    - Duration (15 / 30 / 60 minutes)
    - Required Staff Type

### 3. Appointment Management

- Users can:
  - Create appointments
  - Edit or cancel appointments
  - View appointments by date or staff member
- Each appointment includes:
  - Customer Name
  - Service
  - Assigned Staff
  - Appointment Date & Time
  - Status: Scheduled, Completed, Cancelled, No-Show

### 4. Appointment Assignment Rules

- When assigning staff:
  - Show each eligible staff member as: `Farhan (3 / 5 appointments today)`
  - If staff exceeds daily capacity, show warning: `Farhan already has 5 appointments today.`
  - If no staff is available: Appointment goes into Waiting Queue

### 5. Waiting Queue Management

- Appointments without staff go into a Waiting Queue.
- Queue rules:
  - Ordered by appointment time
  - Show queue position (1st, 2nd, 3rd…)
- When a staff becomes available:
  - User can click "Assign From Queue"
  - The earliest eligible appointment is assigned automatically

### 6. Conflict Detection

- When creating or editing appointments:
  - Detect time conflicts for the same staff
  - Show message: `This staff member already has an appointment at this time.`
  - Options:
    - Pick another staff
    - Change time

### 7. Dashboard

- Display:
  - Total Appointments Today
  - Completed vs Pending
  - Waiting Queue Count
  - Staff Load Summary:
    - Riya — 4 / 5 (OK)
    - Farhan — 5 / 5 (Booked)

### 8. Activity Log

- Track important actions:
  - Queue → Staff assignments
- Show latest 5–10 logs.
- Example:
  - 11:45 AM — Appointment for "John Doe" auto-assigned to Riya.
  - 12:10 PM — Appointment moved from queue to Farhan.

## Important Note

- **Technology Stack**: The frontend and backend fresh projects are ready to start..
