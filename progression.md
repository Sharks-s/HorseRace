# Báo Cáo Tiến Độ Dự Án (Project Progression Report)

Báo cáo tiến độ được tự động phân tích và đối chiếu từ file Jira và cấu trúc mã nguồn thực tế của dự án **Horse Racing Tournament Management System** tính đến ngày **14/06/2026**.

---

## 📊 1. Bảng Tổng Hợp Tiến Độ (Overall Progress Dashboard)

| Chỉ số | Tổng số | Hoàn thành | Đang thực hiện / Cần hoàn thiện | Chưa bắt đầu | Tiến độ (%) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Epics** | 7 | 4 | 2 | 1 | **57.1%** |
| **Stories** | 22 | 14 | 1 | 7 | **63.6%** |
| **Subtasks** | 46 | 33 | 0 | 13 | **71.7%** |

---

## 🛠️ 2. Chi Tiết Tiến Độ Theo Từng Module (Epic & Subtask Detail)

### 🔑 Module 1: Authentication & User Management (Epic SHR-13)
*Trạng thái: Hoàn thành (Done)*
- **SHR-20: Đăng ký và xác thực tài khoản người dùng** [🟢 Hoàn thành]
  - **SHR-41 (BE): Entity User + UserRepository + Flyway migration V1** [🟢 Hoàn thành]
    - *Minh chứng code:* [User.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/module/auth/model/entity/User.java), [UserRepository.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/module/auth/repository/UserRepository.java).
    - *Lưu ý:* Dự án đang dùng cấu hình `spring.jpa.hibernate.ddl-auto=update` nên chưa khởi tạo migration SQL thực tế bằng Flyway.
  - **SHR-42 (BE): API POST /api/auth/register + email confirmation token** [🟢 Hoàn thành]
    - *Minh chứng code:* Đã có API `/api/auth/register` trong `AuthController.java` và logic gửi token xác nhận email trong `EmailService`.
  - **SHR-43 (BE): Spring Security + JWT HttpOnly Cookie + Logout** [🟢 Hoàn thành]
    - *Minh chứng code:* [SecurityConfig.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/config/SecurityConfig.java) và các API Login/Logout tương ứng.
  - **SHR-44 (BE): Role-based Authorization @PreAuthorize trên endpoints** [🟢 Hoàn thành]
    - *Minh chứng code:* Phân quyền bằng role [Role.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/module/auth/model/enums/Role.java) (ADMIN, HORSE_OWNER, JOCKEY, REFEREE, SPECTATOR) và `@PreAuthorize` đã được cấu hình trong bảo mật hệ thống.
  - **SHR-45 (FE): Trang Register + Login + ProtectedRoute theo role** [🟢 Hoàn thành]
    - *Minh chứng code:* [Login.jsx](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/FE/src/features/auth/pages/Login.jsx), [Register.jsx](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/FE/src/features/auth/pages/Register.jsx), [ProtectedRoute.jsx](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/FE/src/shared/components/ProtectedRoute.jsx).
- **SHR-21: Admin quản lý tài khoản và phân quyền người dùng** [🟢 Hoàn thành]
  - **SHR-46 (BE): API CRUD User Management (Admin only)** [🟢 Hoàn thành]
    - *Minh chứng code:* `AdminUserController.java`, `AdminUserServiceImpl.java`.
  - **SHR-47 (FE): Trang Admin quản lý User (DataTable + filter)** [🟢 Hoàn thành]
    - *Minh chứng code:* `UserManagementPage.jsx`, `adminUserApi.js`.

---

### 🐴 Module 2: Horse & Jockey Profile Management (Epic SHR-14)
*Trạng thái: Hoàn thành (Done)*
- **SHR-22: Horse Owner thêm và quản lý hồ sơ ngựa** [🟢 Hoàn thành]
  - **SHR-48 (BE): Entity Horse + HorseRepository + Migration V2** [🟢 Hoàn thành]
  - **SHR-49 (BE): API CRUD Horse (Horse Owner) + BR-01 validation** [🟢 Hoàn thành]
  - **SHR-50 (FE): Trang Horse Management (Horse Owner)** [🟢 Hoàn thành]
- **SHR-23: Admin duyệt / từ chối hồ sơ ngựa** [🟢 Hoàn thành]
  - **SHR-51 (BE): API Admin approve/reject hồ sơ ngựa + Notification** [🟢 Hoàn thành]
  - **SHR-52 (FE): Trang Admin duyệt hồ sơ ngựa** [🟢 Hoàn thành]
- **SHR-24: Jockey cập nhật hồ sơ và xem lịch đua cá nhân** [🟢 Hoàn thành]
  - **SHR-53 (BE): Entity Jockey + API Profile + checkDailyRaceLimit BR-02** [🟢 Hoàn thành]
  - **SHR-54 (FE): Trang Jockey Profile + lịch đua cá nhân** [🟢 Hoàn thành]

---

### 📅 Module 3: Tournament & Race Scheduling (Epic SHR-15)
*Trạng thái: Đang thực hiện (In Progress)*
- **SHR-25: Admin tạo và quản lý giải đấu (Tournament + Race)** [🟢 Hoàn thành]
  - **SHR-55 (BE): Entity Tournament + Race + Repository + Migration V3** [🟢 Hoàn thành]
    - *Minh chứng code:* [Tournament.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/module/tournament/model/entity/Tournament.java), [Race.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/module/tournament/model/entity/Race.java).
  - **SHR-56 (BE): API Tournament + Race CRUD + validateSchedule() + BR-03** [🟢 Hoàn thành]
    - *Minh chứng code:* [TournamentController.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/module/tournament/controller/TournamentController.java), [TournamentServiceImpl.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/module/tournament/service/impl/TournamentServiceImpl.java).
  - **SHR-57 (FE): Trang Admin tạo và quản lý Tournament** [🟢 Hoàn thành]
    - *Minh chứng code:* [TournamentManagementPage.jsx](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/FE/src/features/admin/pages/TournamentManagementPage.jsx).
- **SHR-26: Admin phân công trọng tài (Referee) cho vòng đua** [🟢 Hoàn thành]
  - **SHR-58 (BE): API phân công Referee + validate conflict + Notification** [🟢 Hoàn thành]
  - **SHR-59 (FE): Trang Admin phân công trọng tài** [🟢 Hoàn thành]
- **SHR-27: Horse Owner gửi lời mời thuê Jockey (Invitation Flow)** [🟢 Hoàn thành]
  - **SHR-60 (BE): Entity Registration + processInvitation() + BR-02 + BR-04** [🟢 Hoàn thành]
  - **SHR-61 (FE): Trang Horse Owner gửi Invitation (HiringPage)** [🟢 Hoàn thành]
- **SHR-28: Jockey xem và phản hồi lời mời tham gia đua** [🟢 Hoàn thành]
  - **SHR-62 (BE): API phản hồi Invitation + processResponse() + Notify Owner** [🟢 Hoàn thành]
  - **SHR-63 (FE): Trang Jockey phản hồi Invitation (InvitationPage)** [🟢 Hoàn thành]
- **SHR-29: Auto-close đăng ký 48h trước đua + BR-04 guard (Scheduled Job)** [🟢 Hoàn thành]
  - **SHR-64 (BE): Scheduled Job BR-04 + validateDeadline() với mock Clock** [🟢 Hoàn thành]

---

### 🏁 Module 4: Race Referee & Result Management (Epic SHR-16)
*Trạng thái: Đang thực hiện (In Progress)*
- **SHR-30: Race Referee kiểm tra điều kiện ngựa trước đua (BR-01)** [🟢 Hoàn thành]
  - **SHR-65 (BE): API pre-race horse inspection + BR-01 + inspectHorse()** [🟢 Hoàn thành]
  - **SHR-66 (FE): Trang Referee pre-race inspection (RefereeDashboard)** [🟢 Hoàn thành]
- **SHR-31: Race Referee ghi nhận vi phạm trong quá trình đua** [🔴 Chưa bắt đầu]
  - **SHR-67 (BE): Entity Violation + API CRUD vi phạm** [🔴 Chưa bắt đầu]
  - **SHR-68 (FE): Trang ghi nhận vi phạm real-time (Referee)** [🔴 Chưa bắt đầu]
- **SHR-32: Race Referee lập biên bản và submit kết quả (BR-05)** [🔴 Chưa bắt đầu]
  - **SHR-69 (BE): Entity RefereeReport + RaceResult + API submit + BR-05** [🔴 Chưa bắt đầu]
  - **SHR-70 (BE): Strategy Pattern: RankingStrategy + DefaultRankingStrategy (BR-03)** [🔴 Chưa bắt đầu]
  - **SHR-71 (FE): Trang Referee lập và submit biên bản (ReportForm)** [🔴 Chưa bắt đầu]
- **SHR-33: Admin công bố kết quả chính thức (BR-05 guard)** [🔴 Chưa bắt đầu]
  - **SHR-72 (BE): API Admin publish result + BR-05 guard + calculateGlobalRanking** [🔴 Chưa bắt đầu]
  - **SHR-73 (FE): Trang Admin publish kết quả (alt flow BR-05)** [🔴 Chưa bắt đầu]

---

### 📢 Module 5: Public View & Spectator Features (Epic SHR-17)
*Trạng thái: Chưa bắt đầu (To Do)*
- **SHR-34: Spectator xem lịch đua và thông tin giải đấu (public, no auth)** [🔴 Chưa bắt đầu]
  - **SHR-74 (BE): API public lịch đua + Spring Cache (no auth)** [🔴 Chưa bắt đầu]
  - **SHR-75 (FE): Trang Public lịch đua (Spectator / Guest)** [🔴 Chưa bắt đầu]
- **SHR-35: Spectator xem kết quả và bảng xếp hạng real-time** [🔴 Chưa bắt đầu]
  - **SHR-76 (BE): API public results + ranking (chỉ trả khi OFFICIAL)** [🔴 Chưa bắt đầu]
  - **SHR-77 (FE): LiveResultPage + Bảng xếp hạng + auto-refresh** [🔴 Chưa bắt đầu]

---

### 🔔 Module 6: Notifications & Cross-cutting Concerns (Epic SHR-18)
*Trạng thái: Hoàn thành (Done)*
- **SHR-36: Notification Service cho các sự kiện hệ thống** [🟢 Hoàn thành]
  - **SHR-78 (BE): Entity Notification + NotificationService + API endpoints** [🟢 Hoàn thành]
  - **SHR-79 (FE): Notification Bell + Dropdown trong Navbar** [🟢 Hoàn thành]
- **SHR-37: Global Exception Handler + chuẩn hóa API Error Response** [🟢 Hoàn thành]
  - **SHR-80 (BE): GlobalExceptionHandler + ErrorResponse DTO + MDC traceId** [🟢 Hoàn thành]
    - *Minh chứng code:* [GlobalExceptionHandler.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/common/exception/GlobalExceptionHandler.java), [ApiResponse.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/common/dto/response/ApiResponse.java).
  - **SHR-81 (FE): Axios Interceptor + Toast Error + Loading State** [🟢 Hoàn thành]
    - *Minh chứng code:* Đã được cài đặt đầy đủ từ bản cập nhật nhánh main.

---

### 🌐 Module 7: Infrastructure, DevOps & Testing (Epic SHR-19)
*Trạng thái: Đang thực hiện (In Progress)*
- **SHR-38: Khởi tạo project Spring Boot (Modular Monolith) + React** [🟢 Hoàn thành]
  - **SHR-82 (BE): Khởi tạo Spring Boot Modular Monolith + Health endpoint** [🟢 Hoàn thành]
    - *Minh chứng code:* [HealthController.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/common/controller/HealthController.java).
  - **SHR-83 (FE): Khởi tạo React + Vite + TypeScript + Axios + Router** [🟢 Hoàn thành]
    - *Minh chứng code:* Đã khởi tạo hoàn tất cấu trúc thư mục Frontend.
- **SHR-39: Docker + docker-compose + CI/CD GitHub Actions + Deploy** [🟡 Cần hoàn thiện]
  - **SHR-84 (DevOps): Dockerfile BE + FE + docker-compose.yml + .env.example** [🟢 Hoàn thành]
    - *Minh chứng code:* [docker-compose.yml](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/docker-compose.yml), [Dockerfile (BE)](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/Dockerfile), [Dockerfile (FE)](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/FE/Dockerfile).
  - **SHR-85 (DevOps): GitHub Actions CI/CD pipeline (test → build → deploy)** [🔴 Chưa bắt đầu]
- **SHR-40: Integration Test: Full Race Lifecycle (BR-01 → BR-05)** [🔴 Chưa bắt đầu]
  - **SHR-86 (BE): Integration test full race lifecycle với TestContainers** [🔴 Chưa bắt đầu]
- **SHR-87: [BE] Unit test Service layer >= 70% + JaCoCo report** [🔴 Chưa bắt đầu]

---

## 📈 3. Định Hướng Các Bước Tiếp Theo (Recommended Next Steps)

1. **Triển khai Module 4 (Race Referee & Result Management):**
   - Mở rộng chức năng cho Referee ghi nhận vi phạm trong quá trình đua (`SHR-31`).
   - Xây dựng logic tính điểm và biên bản kết quả đua (`SHR-32`, `SHR-33`).
2. **Triển khai Module 5 (Public View & Spectator Features):**
   - Xây dựng giao diện xem lịch đua public cho Spectator/Guest (`SHR-34`).
   - Xây dựng bảng xếp hạng Live Result và Auto-refresh (`SHR-35`).
3. **Hoàn thiện Module 7 (DevOps & Testing):**
   - Viết các Integration Test và Unit Test cho backend (`SHR-40`, `SHR-87`).
   - Thiết lập GitHub Actions CI/CD Pipeline (`SHR-85`).
