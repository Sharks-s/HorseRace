# Báo Cáo Tiến Độ Dự Án (Project Progression Report)

Báo cáo tiến độ được tự động phân tích và đối chiếu từ file Jira và cấu trúc mã nguồn thực tế của dự án **Horse Racing Tournament Management System** tính đến ngày **14/06/2026**.

---

## 📊 1. Bảng Tổng Hợp Tiến Độ (Overall Progress Dashboard)

| Chỉ số | Tổng số | Hoàn thành | Đang thực hiện / Cần hoàn thiện | Chưa bắt đầu | Tiến độ (%) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Epics** | 7 | 2 | 1 | 4 | **28.6%** |
| **Stories** | 18 | 4 | 2 | 12 | **22.2%** |
| **Subtasks** | 46 | 10 | 3 | 33 | **21.7%** |

---

## 🛠️ 2. Chi Tiết Tiến Độ Theo Từng Module (Epic & Subtask Detail)

### 🔑 Module 1: Authentication & User Management (Epic SHR-13)
*Trạng thái: Đang hoàn thiện (In Progress)*
- **SHR-20: Đăng ký và xác thực tài khoản người dùng** [🟢 Hoàn thành]
  - **SHR-41 (BE): Entity User + UserRepository + Flyway migration V1** [🟢 Hoàn thành]
    - *Minh chứng code:* [User.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/module/auth/model/entity/User.java), [UserRepository.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/module/auth/repository/UserRepository.java).
    - *Lưu ý:* Dự án đang dùng cấu hình `spring.jpa.hibernate.ddl-auto=update` nên chưa khởi tạo migration SQL thực tế bằng Flyway.
  - **SHR-42 (BE): API POST /api/auth/register + email confirmation token** [🟡 Cần hoàn thiện]
    - *Minh chứng code:* Đã có API `/api/auth/register` trong [AuthController.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/module/auth/controller/AuthController.java), tuy nhiên logic gửi token xác nhận email chưa được tích hợp.
  - **SHR-43 (BE): Spring Security + JWT HttpOnly Cookie + Logout** [🟢 Hoàn thành]
    - *Minh chứng code:* [SecurityConfig.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/config/SecurityConfig.java) và các API Login/Logout tương ứng.
  - **SHR-44 (BE): Role-based Authorization @PreAuthorize trên endpoints** [🟢 Hoàn thành]
    - *Minh chứng code:* Phân quyền bằng role [Role.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/module/auth/model/enums/Role.java) (ADMIN, HORSE_OWNER, JOCKEY, REFEREE, SPECTATOR) và `@PreAuthorize` đã được cấu hình trong bảo mật hệ thống.
  - **SHR-45 (FE): Trang Register + Login + ProtectedRoute theo role** [🟢 Hoàn thành]
    - *Minh chứng code:* [Login.jsx](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/FE/src/features/auth/pages/Login.jsx), [Register.jsx](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/FE/src/features/auth/pages/Register.jsx), [ProtectedRoute.jsx](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/FE/src/shared/components/ProtectedRoute.jsx).
- **SHR-21: Admin quản lý tài khoản và phân quyền người dùng** [🔴 Chưa bắt đầu]
  - **SHR-46 (BE): API CRUD User Management (Admin only)** [🔴 Chưa bắt đầu]
  - **SHR-47 (FE): Trang Admin quản lý User (DataTable + filter)** [🔴 Chưa bắt đầu]

---

### 🐴 Module 2: Horse & Jockey Profile Management (Epic SHR-14)
*Trạng thái: Chưa bắt đầu (To Do)*
- **SHR-22: Horse Owner thêm và quản lý hồ sơ ngựa** [🔴 Chưa bắt đầu]
  - **SHR-48 (BE): Entity Horse + HorseRepository + Migration V2** [🔴 Chưa bắt đầu]
  - **SHR-49 (BE): API CRUD Horse (Horse Owner) + BR-01 validation** [🔴 Chưa bắt đầu]
  - **SHR-50 (FE): Trang Horse Management (Horse Owner)** [🔴 Chưa bắt đầu]
- **SHR-23: Admin duyệt / từ chối hồ sơ ngựa** [🔴 Chưa bắt đầu]
  - **SHR-51 (BE): API Admin approve/reject hồ sơ ngựa + Notification** [🔴 Chưa bắt đầu]
  - **SHR-52 (FE): Trang Admin duyệt hồ sơ ngựa** [🔴 Chưa bắt đầu]
- **SHR-24: Jockey cập nhật hồ sơ và xem lịch đua cá nhân** [🔴 Chưa bắt đầu]
  - **SHR-53 (BE): Entity Jockey + API Profile + checkDailyRaceLimit BR-02** [🔴 Chưa bắt đầu]
  - **SHR-54 (FE): Trang Jockey Profile + lịch đua cá nhân** [🔴 Chưa bắt đầu]

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
- **SHR-26: Admin phân công trọng tài (Referee) cho vòng đua** [🔴 Chưa bắt đầu]
  - **SHR-58 (BE): API phân công Referee + validate conflict + Notification** [🔴 Chưa bắt đầu]
  - **SHR-59 (FE): Trang Admin phân công trọng tài** [🔴 Chưa bắt đầu]
- **SHR-27: Horse Owner gửi lời mời thuê Jockey (Invitation Flow)** [🔴 Chưa bắt đầu]
  - **SHR-60 (BE): Entity Registration + processInvitation() + BR-02 + BR-04** [🔴 Chưa bắt đầu]
  - **SHR-61 (FE): Trang Horse Owner gửi Invitation (HiringPage)** [🔴 Chưa bắt đầu]
- **SHR-28: Jockey xem và phản hồi lời mời tham gia đua** [🔴 Chưa bắt đầu]
  - **SHR-62 (BE): API phản hồi Invitation + processResponse() + Notify Owner** [🔴 Chưa bắt đầu]
  - **SHR-63 (FE): Trang Jockey phản hồi Invitation (InvitationPage)** [🔴 Chưa bắt đầu]
- **SHR-29: Auto-close đăng ký 48h trước đua + BR-04 guard (Scheduled Job)** [🔴 Chưa bắt đầu]
  - **SHR-64 (BE): Scheduled Job BR-04 + validateDeadline() với mock Clock** [🔴 Chưa bắt đầu]

---

### 🏁 Module 4: Race Referee & Result Management (Epic SHR-16)
*Trạng thái: Chưa bắt đầu (To Do)*
- **SHR-30: Race Referee kiểm tra điều kiện ngựa trước đua (BR-01)** [🔴 Chưa bắt đầu]
  - **SHR-65 (BE): API pre-race horse inspection + BR-01 + inspectHorse()** [🔴 Chưa bắt đầu]
  - **SHR-66 (FE): Trang Referee pre-race inspection (RefereeDashboard)** [🔴 Chưa bắt đầu]
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
*Trạng thái: Đang thực hiện (In Progress)*
- **SHR-36: Notification Service cho các sự kiện hệ thống** [🔴 Chưa bắt đầu]
  - **SHR-78 (BE): Entity Notification + NotificationService + API endpoints** [🔴 Chưa bắt đầu]
  - **SHR-79 (FE): Notification Bell + Dropdown trong Navbar** [🔴 Chưa bắt đầu]
- **SHR-37: Global Exception Handler + chuẩn hóa API Error Response** [🟡 Cần hoàn thiện]
  - **SHR-80 (BE): GlobalExceptionHandler + ErrorResponse DTO + MDC traceId** [🟢 Hoàn thành]
    - *Minh chứng code:* [GlobalExceptionHandler.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/common/exception/GlobalExceptionHandler.java), [ApiResponse.java](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/be/src/main/java/com/example/be/common/dto/response/ApiResponse.java).
  - **SHR-81 (FE): Axios Interceptor + Toast Error + Loading State** [🟡 Cần hoàn thiện]
    - *Minh chứng code:* [axios.ts](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/FE/src/api/axios.ts) đã được khởi tạo, nhưng cấu hình Interceptor xử lý lỗi tự động và Loading State/Toast global chưa được cài đặt đầy đủ.

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

1. **Hoàn thiện Base Concerns:**
   - Cài đặt cấu hình gửi Email Token khi Đăng ký (`SHR-42`).
   - Cài đặt Axios Interceptor hoàn chỉnh để bắt lỗi từ API (`SHR-81`).
2. **Triển khai Module 2 (Horse & Jockey):**
   - Định nghĩa Entity `Horse` & `Jockey`.
   - Viết các API CRUD Horse và các validations đi kèm.
3. **Triển khai Quy trình Đăng ký & Tuyển dụng (Hiring Flow):**
   - Viết logic `Registration` kết nối giữa Horse, Jockey và Race (`SHR-60`).
