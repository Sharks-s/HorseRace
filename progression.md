# Project Progression Report

This project progression report has been automatically analyzed, reconciled, and updated against the actual source code in the **Horse Racing Tournament Management System** workspace as of **June 26, 2026**.

---

## 📊 1. Overall Progress Dashboard

| Metric | Total | Completed | In Progress / Needs Refinement | To Do | Progress (%) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Epics** | 7 | 4 | 2 | 1 | **57.1%** |
| **Stories** | 22 | 14 | 1 | 7 | **63.6%** |
| **Subtasks** | 46 | 33 | 0 | 13 | **71.7%** |

> [!NOTE]
> **Audit Summary**: All major architectural gaps previously identified (model duplication, disconnected flows, lack of invitation notifications, and non-standard exception handling DTOs) have been successfully resolved and verified.

---

## 🟢 2. Resolved Architectural Gaps

We have completed the refactoring of duplicate code paths to align the system with the designed modular architecture:

### 1. Unified Registration and Inspection Flows (Model Duplication Resolved)
* **What was changed**: Removed the duplicate `ProfileModuleHorse` entity and the separate `RaceRegistration` entity. The system now uses a single, unified [Horse.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/horse/model/entity/Horse.java) and [Registration.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/registration/model/entity/Registration.java) mapping to the `registrations` table.
* **The Benefit**: The Referee Pre-race Inspection flow and the Jockey Invitation flow are now fully integrated and share the same dataset. Referees can successfully inspect and update the status of tournament registrations.

### 2. Standardized Session Cookie Authentication
* **What was changed**: Verified the Spring Session Cookie Authentication (`SessionCreationPolicy.IF_REQUIRED`) configured in [SecurityConfig.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/common/config/SecurityConfig.java). Cleaned up documentation references.

### 3. Standardized Global Exception Handler DTO
* **What was changed**: Refactored [GlobalExceptionHandler.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/common/exception/GlobalExceptionHandler.java) to wrap all exception bodies in the standard [ApiResponse.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/common/dto/response/ApiResponse.java) DTO wrapper utilizing the `.failure(code, message)` factory methods.

### 4. Integrated Notifications in Invitation Flows
* **What was changed**: Modified [RegistrationServiceImpl.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/tournament/service/impl/RegistrationServiceImpl.java) to save notifications to `NotificationRepository` whenever an owner creates a Jockey invitation, and when a Jockey accepts or declines the invitation.
* **Daily Race Limit (BR-02)**: Integrated the active constraint into the invitation acceptance method, preventing Jockeys from exceeding 3 accepted races in a day.

---

## 🛠️ 3. Epic & Subtask Detail

### 🔑 Module 1: Authentication & User Management (Epic SHR-13)
*Status: Complete*
- **SHR-20: User Registration and Authentication** [🟢 Completed]
  - **SHR-41 (BE): Entity User + UserRepository** [🟢 Completed]
    * *Code References:* [User.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/auth/model/entity/User.java), [UserRepository.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/auth/repository/UserRepository.java).
  - **SHR-42 (BE): API POST /api/auth/register + email verification** [🟢 Completed]
    * *Code References:* [AuthController.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/auth/controller/AuthController.java).
  - **SHR-43 (BE): Spring Security + Session-based Auth & Logout** [🟢 Completed]
    * *Code References:* [SecurityConfig.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/common/config/SecurityConfig.java).
  - **SHR-44 (BE): Role-based Authorization @PreAuthorize on Endpoints** [🟢 Completed]
    * *Code References:* [Role.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/auth/model/enums/Role.java).
  - **SHR-45 (FE): Register Page + Login Page + ProtectedRoutes** [🟢 Completed]
    * *Code References:* [Login.jsx](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/src/features/auth/pages/Login.jsx), [Register.jsx](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/src/features/auth/pages/Register.jsx), [ProtectedRoute.jsx](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/src/shared/components/ProtectedRoute.jsx).
- **SHR-21: Admin User Management and Permissions** [🟢 Completed]
  - **SHR-46 (BE): API CRUD User Management (Admin only)** [🟢 Completed]
    * *Code References:* [AdminUserController.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/auth/controller/AdminUserController.java), [AdminUserServiceImpl.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/auth/service/impl/AdminUserServiceImpl.java).
  - **SHR-47 (FE): Admin User Management Page** [🟢 Completed]
    * *Code References:* [UserManagementPage.jsx](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/src/features/admin/pages/UserManagementPage.jsx), [adminUserApi.js](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/src/api/adminUserApi.js).

---

### 🐴 Module 2: Horse & Jockey Profile Management (Epic SHR-14)
*Status: Complete*
- **SHR-22: Horse Owner Profile and Horse Profile Management** [🟢 Completed]
  - **SHR-48 (BE): Entity Horse + HorseRepository** [🟢 Completed]
    * *Code References:* [Horse.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/horse/model/entity/Horse.java), [HorseRepository.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/horse/repository/HorseRepository.java).
  - **SHR-49 (BE): API CRUD Horse (Horse Owner) + validation** [🟢 Completed]
    * *Code References:* [HorseServiceImpl.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/horse/service/impl/HorseServiceImpl.java), [HorseController.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/horse/controller/HorseController.java).
  - **SHR-50 (FE): Horse Management Dashboard for Owner** [🟢 Completed]
    * *Code References:* [HorseManagementPage.jsx](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/src/features/owner/pages/HorseManagementPage.jsx).
- **SHR-23: Admin Approve/Reject Horse Profile** [🟢 Completed]
  - **SHR-51 (BE): API Admin Approve/Reject Horse + Notification Seeding** [🟢 Completed]
    * *Code References:* [AdminHorseReviewController.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/admin/controller/AdminHorseReviewController.java), [AdminHorseReviewServiceImpl.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/admin/service/impl/AdminHorseReviewServiceImpl.java).
  - **SHR-52 (FE): Admin Horse Review Page** [🟢 Completed]
    * *Code References:* [HorseReviewPage.jsx](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/src/features/admin/pages/HorseReviewPage.jsx).
- **SHR-24: Jockey Profile Update and Personal Race Schedule** [🟢 Completed]
  - **SHR-53 (BE): Entity Jockey + API Profile + checkDailyRaceLimit (BR-02)** [🟢 Completed]
    * *Code References:* [JockeyProfile.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/jockey/model/entity/JockeyProfile.java), [JockeyServiceImpl.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/jockey/service/impl/JockeyServiceImpl.java#L89-L98) (`checkDailyRaceLimit`).
  - **SHR-54 (FE): Jockey Profile & Schedule Dashboard** [🟢 Completed]
    * *Code References:* [JockeyWorkspacePage.jsx](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/src/features/jockey/pages/JockeyWorkspacePage.jsx).

---

### 📅 Module 3: Tournament & Race Scheduling (Epic SHR-15)
*Status: Complete*
- **SHR-25: Admin Tournament & Race Creation** [🟢 Completed]
  - **SHR-55 (BE): Entity Tournament + Race + Repositories** [🟢 Completed]
    * *Code References:* [Tournament.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/tournament/model/entity/Tournament.java), [Race.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/tournament/model/entity/Race.java).
  - **SHR-56 (BE): API Tournament & Race CRUD + Validation (BR-03)** [🟢 Completed]
    * *Code References:* [TournamentController.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/tournament/controller/TournamentController.java), [TournamentServiceImpl.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/tournament/service/impl/TournamentServiceImpl.java).
  - **SHR-57 (FE): Admin Tournament Management Page** [🟢 Completed]
    * *Code References:* [TournamentManagementPage.jsx](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/src/features/admin/pages/TournamentManagementPage.jsx).
- **SHR-26: Admin Assign Referee to Race** [🟢 Completed]
  - **SHR-58 (BE): API Assign Referee + Conflict Validation** [🟢 Completed]
    * *Code References:* [RaceServiceImpl.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/tournament/service/impl/RaceServiceImpl.java) (`assignReferee`).
  - **SHR-59 (FE): Admin Referee Assignment View** [🟢 Completed]
    * *Code References:* Integrated into [TournamentManagementPage.jsx](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/src/features/admin/pages/TournamentManagementPage.jsx).
- **SHR-27: Horse Owner Hire Jockey (Invitation Flow)** [🟢 Completed]
  - **SHR-60 (BE): Entity Registration + sendInvitation() + BR-04 Guard + Notifications** [🟢 Completed]
    * *Code References:* [RegistrationServiceImpl.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/tournament/service/impl/RegistrationServiceImpl.java#L37-L73) (`sendInvitation`).
  - **SHR-61 (FE): Hiring Page for Owners** [🟢 Completed]
    * *Code References:* [HiringPage.jsx](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/src/features/owner/pages/HiringPage.jsx).
- **SHR-28: Jockey Respond to Invitation** [🟢 Completed]
  - **SHR-62 (BE): API Respond to Invitation + respondToInvitation() + Notifications + BR-02 check** [🟢 Completed]
    * *Code References:* [RegistrationServiceImpl.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/tournament/service/impl/RegistrationServiceImpl.java#L77-L95) (`respondToInvitation`).
  - **SHR-63 (FE): Jockey Invitation Response View** [🟢 Completed]
    * *Code References:* [InvitationPage.jsx](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/src/features/jockey/pages/InvitationPage.jsx).
- **SHR-29: Auto-close Registration Job (Scheduled 48h Guard)** [🟢 Completed]
  - **SHR-64 (BE): Scheduled Job closeRegistrationsForUpcomingRaces()** [🟢 Completed]
    * *Code References:* [RaceSchedulingJob.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/tournament/job/RaceSchedulingJob.java).

---

### 🏁 Module 4: Race Referee & Result Management (Epic SHR-16)
*Status: In Progress*
- **SHR-30: Referee Inspection of Horse Conditions (BR-01)** [🟢 Completed]
  - **SHR-65 (BE): API Pre-race Horse Inspection + inspectHorse()** [🟢 Completed]
    * *Code References:* [RefereeInspectionServiceImpl.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/referee/service/impl/RefereeInspectionServiceImpl.java#L55-L86) (`inspectHorse`).
  - **SHR-66 (FE): Referee Pre-race Inspection Dashboard** [🟢 Completed]
    * *Code References:* [RefereeDashboard.jsx](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/src/features/referee/pages/RefereeDashboard.jsx).
- **SHR-31: Referee Record Violations Real-time** [🔴 To Do]
  - **SHR-67 (BE): Entity Violation + API CRUD** [🔴 To Do]
  - **SHR-68 (FE): Referee Real-time Violation Form** [🔴 To Do]
- **SHR-32: Referee Report & Race Result Submission (BR-05)** [🔴 To Do]
  - **SHR-69 (BE): Entity RefereeReport + RaceResult + API Submission** [🔴 To Do]
  - **SHR-70 (BE): Strategy Pattern: RankingStrategy & DefaultRankingStrategy** [🔴 To Do]
  - **SHR-71 (FE): Referee Report Submission Form** [🔴 To Do]
- **SHR-33: Admin Publish Official Results** [🔴 To Do]
  - **SHR-72 (BE): API Publish Results + calculateGlobalRanking** [🔴 To Do]
  - **SHR-73 (FE): Admin Publish Results Dashboard** [🔴 To Do]

---

### 📢 Module 5: Public View & Spectator Features (Epic SHR-17)
*Status: To Do*
- **SHR-34: Spectator View Race Schedule & Tournament Details** [🔴 To Do]
  - **SHR-74 (BE): API Public Schedule + Spring Cache** [🔴 To Do]
  - **SHR-75 (FE): Public Schedule Board** [🔴 To Do]
- **SHR-35: Spectator View Real-time Ranking & Official Results** [🔴 To Do]
  - **SHR-76 (BE): API Public Results (Only show when status is OFFICIAL)** [🔴 To Do]
  - **SHR-77 (FE): Live Rankings & Results Board (Auto-refresh)** [🔴 To Do]

---

### 🔔 Module 6: Notifications & Cross-cutting Concerns (Epic SHR-18)
*Status: Complete*
- **SHR-36: System Notification Service** [🟢 Completed]
  - **SHR-78 (BE): Entity Notification + NotificationService** [🟢 Completed]
    * *Code References:* [Notification.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/notification/model/entity/Notification.java), [NotificationController.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/module/notification/controller/NotificationController.java).
  - **SHR-79 (FE): Notification Bell Icon + Dropdown** [🟢 Completed]
- **SHR-37: Global Exception Handler** [🟢 Completed]
  - **SHR-80 (BE): GlobalExceptionHandler + ErrorResponse standardization** [🟢 Completed]
    * *Code References:* [GlobalExceptionHandler.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/common/exception/GlobalExceptionHandler.java).
  - **SHR-81 (FE): Axios Interceptor + Toast Alerts** [🟢 Completed]

---

### 🌐 Module 7: Infrastructure, DevOps & Testing (Epic SHR-19)
*Status: In Progress*
- **SHR-38: Setup Spring Boot and React Project Structure** [🟢 Completed]
  - **SHR-82 (BE): Modular Monolith Setup + Health Endpoint** [🟢 Completed]
    * *Code References:* [HealthController.java](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/src/main/java/com/example/be/common/controller/HealthController.java).
  - **SHR-83 (FE): React + Vite + Tailwind CSS Setup** [🟢 Completed]
- **SHR-39: Docker & Container Orchestration** [🟡 Needs Refinement]
  - **SHR-84 (DevOps): Dockerfiles + docker-compose.yml + .env.example** [🟢 Completed]
    * *Code References:* [docker-compose.yml](file:///d:/Minh/IdeaProjects/SWD/HorseRace/docker-compose.yml), [Dockerfile (BE)](file:///d:/Minh/IdeaProjects/SWD/HorseRace/be/Dockerfile), [Dockerfile (FE)](file:///d:/Minh/IdeaProjects/SWD/HorseRace/FE/Dockerfile).
  - **SHR-85 (DevOps): CI/CD Pipelines** [🔴 To Do]
- **SHR-40: Testing** [🔴 To Do]
  - **SHR-86 (BE): Integration test suite (TestContainers)** [🔴 To Do]
  - **SHR-87 (BE): Unit tests with JaCoCo Coverage (Target: >= 70%)** [🔴 To Do]
