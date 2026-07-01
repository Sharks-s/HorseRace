# HƯỚNG DẪN NGHIỆP VỤ & SƠ ĐỒ LUỒNG HOẠT ĐỘNG (BUSINESS FLOWS)
## Hệ thống quản lý giải đua ngựa (Horse Racing Tournament Management System)

Tài liệu này hệ thống hóa toàn bộ các luồng nghiệp vụ cốt lõi và các quy tắc nghiệp vụ (Business Rules - BR) của dự án Horse Racing Tournament Management System (MVP) dưới dạng sơ đồ **Mermaid** trực quan.

> [!NOTE]
> Các sơ đồ thiết kế tổng thể bao gồm Sơ đồ Use Case, Sơ đồ cấu trúc thành phần (Component View) và Sơ đồ lớp (Class Diagram) đã được chuyển sang tài liệu đặc tả [SRS_Horse_Racing_Tournament_Management_System.md](file:///c:/Users/PC%202024/Desktop/IdeaProjects/swd/HorseRace/doc/docs/SRS_Horse_Racing_Tournament_Management_System.md).

---

## 1. Sơ đồ tương tác đồng thời (Concurrent Communication Diagrams)

Các luồng xử lý đồng thời, kiểm tra ràng buộc nghiệp vụ (Business Rules) và đồng bộ hóa trạng thái giữa cơ sở dữ liệu và các thành phần giao diện người dùng.

### 1.1. Quy trình nộp báo cáo kết quả của Trọng tài (Referee's Result Flow)

```mermaid
flowchart TD
  %% Nodes definition
  Ref([Race Referee])
  RefUI[Referee Dashboard UI]
  ResultMod[Result Module Backend]
  DB[(Database PostgreSQL)]
  TourMod[Scheduling & Tournament Module]
  AdminUI[Admin Dashboard UI]
  Admin([Admin])
  SpecUI[Spectator Live UI]
  Spec([Spectator])

  %% Flows
  Ref -- "1: submitReport(raceID, violations)" --> RefUI
  RefUI -- "2: POST /api/results/submit" --> ResultMod
  
  subgraph Backend_Processing [Xử lý đồng thời ở Backend]
    direction TB
    ResultMod -- "3: calculateRanking(Strategy)" --> ResultMod
    ResultMod -- "4: saveReport & updateRaceResult" --> DB
    ResultMod -- "5: notifyStatusChange (Concurrent)" --> TourMod
    ResultMod -- "6: pushLiveResult (Real-time)" --> SpecUI
  end

  TourMod -- "7: pushNotification" --> AdminUI
  AdminUI -- "8: publish official result" --> Admin
  SpecUI -- "9: view live ranking updates" --> Spec
```

### 1.2. Quy trình đăng ký và kết nối Jockey của Chủ ngựa (Jockey's Registration Flow)

```mermaid
flowchart TD
  Owner([Horse Owner])
  OwnerUI[Owner Dashboard UI]
  RegMod[Registration Module Backend]
  DB[(Database PostgreSQL)]
  JocUI[Jockey Dashboard UI]
  Joc([Jockey])

  Owner -- "1: gửi_yêu_cầu_thuê_Jockey" --> OwnerUI
  OwnerUI -- "2: POST /api/registrations/request" --> RegMod

  subgraph Checks [Kiểm tra nghiệp vụ đồng thời]
    direction TB
    C1{"checkHorseHealth (BR-01)"}
    C2{"checkJockeyLimit (BR-02)"}
    C3{"checkClosingTime (BR-04)"}
  end

  RegMod --> Checks
  C1 -- "Query Health Cert" --> DB
  C2 -- "Query Jockey Schedule" --> DB
  
  RegMod -- "4: notifyJockeyInvitation" --> JocUI
  JocUI -- "5: nhận lời mời" --> Joc
  Joc -- "6: acceptInvitation" --> JocUI
  JocUI -- "7: PUT /api/registrations/confirm" --> RegMod
  RegMod -- "8: updateRegistrationStatus (Confirmed)" --> DB
  RegMod -- "9: notifyConfirmation" --> OwnerUI
  OwnerUI -- "10: theo dõi lịch đua" --> Owner
```

---

## 2. Sơ đồ tuần tự các luồng nghiệp vụ chi tiết (Sequence Diagrams)

### Luồng 2.1: Đăng ký hồ sơ ngựa mới (Horse Owner Register Horse)
*Mô tả:* Chủ ngựa đăng ký thông tin cho ngựa tham gia hệ thống, bắt buộc kiểm tra điều kiện sức khỏe và hạng cân theo quy tắc **BR-01**.

```mermaid
sequenceDiagram
  autonumber
  actor Owner as Horse Owner
  participant Page as HorseRegistrationPage
  participant Controller as HorseController
  participant Service as HorseService
  participant Repo as HorseRepository
  participant DB as Database

  Owner->>Page: openRegistrationForm()
  Page->>Controller: submitHorseData(horseData)
  
  Note over Service: BR-01 Verification:<br/>1. Health Certificate <= 6 months<br/>2. Weight is within valid limits
  Controller->>Service: validateHorseEligibility(horseData)
  
  Service->>Repo: saveHorse(horse)
  Repo->>DB: INSERT into horse_profile
  DB-->>Repo: success
  Repo-->>Service: horseSaved
  Service-->>Controller: registrationSuccess()
  Controller-->>Page: displaySuccessMessage()
  Page-->>Owner: showRegistrationCompleted()
```

### Luồng 2.2: Gửi yêu cầu thuê Jockey (Horse Owner Hire Jockey)
*Mô tả:* Chủ ngựa gửi lời mời cho Jockey điều khiển ngựa. Hệ thống kiểm tra xem Jockey đó đã đạt giới hạn cuộc đua trong ngày hay chưa theo quy tắc **BR-02**.

```mermaid
sequenceDiagram
  autonumber
  actor Owner as Horse Owner
  participant Page as HiringPage
  participant Controller as InvitationController
  participant Service as InvitationService
  participant JocService as JockeyService
  participant Repo as RegistrationRepository
  participant DB as Database

  Owner->>Page: openHiringForm()
  Page->>Controller: submitInvitation(jockeyID, raceID)
  Controller->>Service: processInvitation()
  
  Note over JocService: BR-02 Verification:<br/>Jockey cannot race more than 3 horses/day
  Service->>JocService: checkJockeyAvailability(jockeyID, date)
  JocService-->>Service: available
  
  Service->>Repo: saveRegistration()
  Repo->>DB: INSERT pending registration
  DB-->>Repo: success
  Repo-->>Service: registrationSaved()
  Service-->>Controller: invitationSent()
  Controller-->>Page: displaySuccess()
  Page-->>Owner: showInvitationSent()
```

### Luồng 2.3: Jockey phản hồi lời mời thuê (Jockey Accept / Reject Invitation)
*Mô tả:* Jockey xem lời mời và tiến hành chấp nhận hoặc từ chối. Trạng thái đăng ký giải đấu chỉ được xác nhận chính thức khi Jockey đồng ý.

```mermaid
sequenceDiagram
  autonumber
  actor Jockey as Jockey
  participant Page as InvitationPage
  participant Controller as InvitationController
  participant Service as InvitationService
  participant RegService as RegistrationService
  participant DB as Database

  Jockey->>Page: viewInvitation()
  Page->>Controller: respondInvitation(status)
  Controller->>Service: processResponse()
  
  alt Accept Invitation
    Service->>RegService: confirmRegistration()
    RegService->>DB: UPDATE registration_status = 'CONFIRMED'
    DB-->>RegService: success
    RegService-->>Service: registrationConfirmed()
    Service-->>Controller: invitationAccepted()
  else Reject Invitation
    Service->>DB: UPDATE registration_status = 'REJECTED'
    DB-->>Service: success
    Service-->>Controller: invitationRejected()
  end
  
  Controller-->>Page: displayResult()
  Page-->>Jockey: showResponseStatus()
```

### Luồng 2.4: Lập lịch giải đấu & vòng đua mới (Admin Create Tournament)
*Mô tả:* Admin tạo giải đấu và phân bổ các vòng đua. Hệ thống tự động kiểm tra xung đột về mặt thời gian và địa điểm đua để tránh chồng chéo lịch trình.

```mermaid
sequenceDiagram
  autonumber
  actor Admin as Admin
  participant Page as TournamentPage
  participant Controller as TournamentController
  participant Service as TournamentService
  participant RaceService as RaceService
  participant Repo as TournamentRepository
  participant DB as Database

  Admin->>Page: openTournamentForm()
  Page->>Controller: createTournament(data)
  Controller->>Service: processTournament()
  
  Note over RaceService: Conflict Detection:<br/>Detect schedule conflicts and duplicate race times
  Service->>RaceService: validateSchedule(scheduleDetails)
  RaceService-->>Service: validSchedule
  
  Service->>Repo: saveTournament()
  Repo->>DB: INSERT tournament & races
  DB-->>Repo: success
  Repo-->>Service: tournamentSaved()
  Service-->>Controller: creationSuccess()
  Controller-->>Page: displaySuccess()
  Page-->>Admin: showTournamentCreated()
```

### Luồng 2.5: Trọng tài nộp biên bản thi đấu (Race Referee Submit Race Report)
*Mô tả:* Trọng tài kiểm tra ngựa, ghi nhận các lỗi vi phạm trong trận đua và gửi biên bản lên hệ thống để kích hoạt việc tính toán điểm số.

```mermaid
sequenceDiagram
  autonumber
  actor Referee as Race Referee
  participant Dash as RefereeDashboard
  participant Controller as ReportController
  participant Service as ReportService
  participant ResultService as ResultService
  participant Repo as ReportRepository
  participant DB as Database

  Referee->>Dash: openReportForm(raceID)
  Dash->>Controller: submitReport(reportData)
  Controller->>Service: processReport()
  
  Service->>Repo: saveReport()
  Repo->>DB: INSERT referee_report
  DB-->>Repo: success
  Repo-->>Service: reportSaved()
  
  Note over ResultService: BR-05 Core Rule:<br/>Points & rankings can only be calculated<br/>once referee report is submitted
  Service->>ResultService: triggerRankingCalculation(raceID)
  ResultService-->>Service: rankingCalculated()
  
  Service-->>Controller: reportSubmitted()
  Controller-->>Dash: displaySuccess()
  Dash-->>Referee: showReportSubmitted()
```

### Luồng 2.6: Admin công bố kết quả chính thức (Admin Publish Result)
*Mô tả:* Admin tiến hành kiểm duyệt kết quả và phát hành chính thức lên bảng tin của khán giả. Luồng này thực thi chặt chẽ quy tắc **BR-05** (không thể công bố trước khi có biên bản của trọng tài).

```mermaid
sequenceDiagram
  autonumber
  actor Admin as Admin
  participant Dash as AdminDashboard
  participant Controller as ResultController
  participant Service as ResultService
  participant TourService as TournamentService
  participant DB as Database

  Admin->>Dash: viewUnpublishedResults()
  Dash->>Controller: getPendingResults()
  Controller->>Service: fetchPendingResults()
  Service-->>Controller: pendingResultsList
  Controller-->>Dash: displayPendingResults()
  
  Admin->>Dash: publishResult(raceID)
  Dash->>Controller: publishRaceResult(raceID)
  
  Note over Service: BR-05 Verification:<br/>Verify that the Referee report exists and is confirmed
  Controller->>Service: publishResult(raceID)
  
  Service->>DB: UPDATE race_status = 'COMPLETED'
  DB-->>Service: success
  Service->>TourService: updateGlobalRanking(tournamentID)
  TourService-->>Service: rankingsUpdated
  
  Service-->>Controller: publicationSuccess()
  Controller-->>Dash: displayPublishedSuccess()
  Dash-->>Admin: showResultsPublished()
```

### Luồng 2.7: Khán giả tra cứu bảng xếp hạng (Spectator View Result & Rankings)
*Mô tả:* Khán giả (Spectator) truy cập hệ thống để xem trực tuyến lịch đua, kết quả xếp hạng và điểm số của từng ngựa đua/jockey theo thời gian thực.

```mermaid
sequenceDiagram
  autonumber
  actor Spec as Spectator
  participant Portal as SpectatorPortal
  participant Controller as ViewController
  participant Service as ViewService
  participant DB as Database

  Spec->>Portal: selectTournament(tournamentID)
  Portal->>Controller: getTournamentDetails(tournamentID)
  Controller->>Service: fetchTournamentData(tournamentID)
  Service->>DB: SELECT tournament, races & standings
  DB-->>Service: data
  Service-->>Controller: tournamentData
  Controller-->>Portal: displayDetails()
  
  Spec->>Portal: viewLiveRankings()
  Portal->>Controller: getRankings(tournamentID)
  Controller->>Service: fetchRankings(tournamentID)
  Service->>DB: SELECT current rankings ordered by points (BR-03)
  DB-->>Service: rankingsData
  Service-->>Controller: rankings
  Controller-->>Portal: displayRankings()
  Portal-->>Spec: showRankings()
```

---

## 3. Tổng hợp quy tắc nghiệp vụ áp dụng trong các luồng (Business Rules Mapping)

| Mã Quy Tắc (BR) | Loại Quy Tắc | Nội Dung Ràng Buộc | Module Xử Lý | Vị Trí Kiểm Tra Trong Luồng |
| :--- | :--- | :--- | :--- | :--- |
| **BR-01** | Định nghĩa (Definitional) | Ngựa phải có chứng nhận sức khỏe $\le 6$ tháng và cân nặng nằm trong hạng cân cho phép. | `registrationModule` | Luồng 2.1 (Bước 3) & Luồng 1.2 |
| **BR-02** | Hành vi (Behavioral) | Một Jockey không được đua quá 3 lượt trong cùng một ngày. | `judgingModule` | Luồng 2.2 (Bước 4) & Luồng 1.2 |
| **BR-03** | Tính toán (Calculational) | Điểm số xếp hạng tính bằng: $\sum (\text{Thời gian hoàn thành} \times \text{Hệ số quãng đường})$. Xử lý hòa bằng cách xét thời gian chạy nhanh nhất ở các vòng. | `tournamentModule` | Luồng 2.7 (Bước 9) & Luồng 1.1 |
| **BR-04** | Thời gian (Temporal) | Cổng đăng ký tự động đóng trước thời điểm đua 48 giờ. | `registrationModule` | Luồng 1.2 (Bước 3) |
| **BR-05** | Hành vi (Behavioral) | Kết quả chỉ chính thức khi có biên bản từ trọng tài và được Admin duyệt công bố. | `judgingModule` | Luồng 2.5 (Bước 7) & Luồng 2.6 (Bước 8) |
