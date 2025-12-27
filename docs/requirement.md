# Requirements – Student Portal Management System

## 1. Purpose
Develop a simple Student Portal prototype focusing on SCM processes (versioning, baselines, change control).

## 2. Scope
The system includes:
- Login/Authentication page
- Dashboard page listing portal modules
- Core functional action: Course Registration (Add/Drop)
- JSON-based data storage (no real database required)

## 3. Functional Requirements
### FR-01: User Login
- The system shall allow a student to login using username and password.
- The system shall show an error message for invalid credentials.

### FR-02: Dashboard
- The system shall display a dashboard after successful login.
- The dashboard shall list portal modules (Courses, Profile, Grades, Requests, etc.).

### FR-03: View Course List
- The system shall display available courses from `courses.json`.

### FR-04: Register Course (Core Action)
- The system shall allow a student to register a selected course.
- The registration shall be saved (or simulated) in `registrations.json`.

### FR-05: Drop Course
- The system shall allow a student to drop a registered course.

## 4. Non-Functional Requirements
- NFR-01: Simple UI using HTML/CSS.
- NFR-02: Version control using Git/GitHub with branching and PRs.
- NFR-03: Changes managed via Change Requests (CRs).
- NFR-04: Baselines tagged as BL1 and BL2.
- NFR-05: Releases created as v1.0 and v1.1 with release notes.

## 5. Assumptions
- This is a prototype; full production security is not required.
- JSON storage is sufficient for this project.
