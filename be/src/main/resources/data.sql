-- =============================================================
-- HorseRace Seed Data  (H2 compatible — spring.sql.init.mode=always)
-- Passwords are BCrypt-encoded → plain text shown in comments
-- All IDs are fixed UUIDs so data.sql is idempotent via MERGE
-- =============================================================

-- ----------------------------------------------------------------
-- 1. USERS
--    Roles : ADMIN | HORSE_OWNER | JOCKEY | REFEREE | SPECTATOR
--    Status: ACTIVE | PENDING_VERIFICATION | PENDING_APPROVAL | INACTIVE | SUSPENDED
-- ----------------------------------------------------------------
MERGE INTO users (id, username, full_name, email, password, phone_number, role, status,
                  email_verified_at, created_at, updated_at)
KEY (id) VALUES
-- Admin  (password: Admin@123)
('00000000-0000-0000-0000-000000000001',
 'admin', 'System Admin', 'admin@horserace.local',
 '$2a$10$7QxCOmwKhFfHaBCFpOHuIO/D1tWLNH7pGCpAh.iFvMRJSsBIR2v5m',
 'admin@horserace.local', 'ADMIN', 'ACTIVE',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Horse Owner 1  (password: Owner@123)
('00000000-0000-0000-0000-000000000002',
 'nguyen_van_a', 'Nguyễn Văn A', 'owner1@horserace.local',
 '$2a$10$iK3G1bIFzLI9MiJKa.K3QuBvDOnJuQ2PQ1R8bT6VbnMkjLUn5tN02',
 '0901234001', 'HORSE_OWNER', 'ACTIVE',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Horse Owner 2  (password: Owner@123)
('00000000-0000-0000-0000-000000000003',
 'tran_thi_b', 'Trần Thị B', 'owner2@horserace.local',
 '$2a$10$iK3G1bIFzLI9MiJKa.K3QuBvDOnJuQ2PQ1R8bT6VbnMkjLUn5tN02',
 '0901234002', 'HORSE_OWNER', 'ACTIVE',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Jockey 1  (password: Jockey@123)
('00000000-0000-0000-0000-000000000004',
 'jockey_minh', 'Lê Văn Minh', 'jockey1@horserace.local',
 '$2a$10$8TGdQ1FJJqCMnq0KbApMqe4cRu3Kxl3pIPPp0jGiS0dLIaRAHFvwO',
 '0901234003', 'JOCKEY', 'ACTIVE',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Jockey 2  (password: Jockey@123)
('00000000-0000-0000-0000-000000000005',
 'jockey_hung', 'Phạm Văn Hùng', 'jockey2@horserace.local',
 '$2a$10$8TGdQ1FJJqCMnq0KbApMqe4cRu3Kxl3pIPPp0jGiS0dLIaRAHFvwO',
 '0901234004', 'JOCKEY', 'ACTIVE',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Jockey 3  (password: Jockey@123)
('00000000-0000-0000-0000-000000000006',
 'jockey_lan', 'Hoàng Thị Lan', 'jockey3@horserace.local',
 '$2a$10$8TGdQ1FJJqCMnq0KbApMqe4cRu3Kxl3pIPPp0jGiS0dLIaRAHFvwO',
 '0901234005', 'JOCKEY', 'ACTIVE',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Referee 1  (password: Referee@123)
('00000000-0000-0000-0000-000000000007',
 'referee_duc', 'Nguyễn Đức Trọng', 'referee1@horserace.local',
 '$2a$10$5rRKYvZ0J5/K4B7g2aBaXuyMFmkXfRkxTwIq0m2R81MDr3/6grqyq',
 '0901234006', 'REFEREE', 'ACTIVE',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Referee 2  (password: Referee@123)
('00000000-0000-0000-0000-000000000008',
 'referee_mai', 'Lê Thị Mai', 'referee2@horserace.local',
 '$2a$10$5rRKYvZ0J5/K4B7g2aBaXuyMFmkXfRkxTwIq0m2R81MDr3/6grqyq',
 '0901234007', 'REFEREE', 'ACTIVE',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Spectator  (password: Spec@123)
('00000000-0000-0000-0000-000000000009',
 'spectator_1', 'Khán Giả Một', 'spectator1@horserace.local',
 '$2a$10$U2LVpxNS5AvkxSzXHgvfauh2Lg0.B0IiEy3kK1nNBF7UE8Yz9cAUW',
 '0901234008', 'SPECTATOR', 'ACTIVE',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ----------------------------------------------------------------
-- 2. JOCKEY PROFILES
-- ----------------------------------------------------------------
MERGE INTO jockey_profiles (id, user_id, license_no, name, weight, bio, created_at, updated_at)
KEY (id) VALUES
('00000000-0000-0000-0001-000000000001',
 '00000000-0000-0000-0000-000000000004',
 'JLN-001', 'Lê Văn Minh', 58.5,
 'Jockey chuyên nghiệp 8 năm kinh nghiệm, chuyên đường đua sprint.',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('00000000-0000-0000-0001-000000000002',
 '00000000-0000-0000-0000-000000000005',
 'JLN-002', 'Phạm Văn Hùng', 57.0,
 'Từng vô địch giải đua nội địa 2022, mạnh nhất ở đường dài.',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('00000000-0000-0000-0001-000000000003',
 '00000000-0000-0000-0000-000000000006',
 'JLN-003', 'Hoàng Thị Lan', 55.2,
 'Jockey nữ đầu tiên đạt danh hiệu tại giải ASEAN 2023.',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ----------------------------------------------------------------
-- 3. HORSES
--    Status: PENDING_REVIEW | APPROVED | REJECTED | REGISTERED
-- ----------------------------------------------------------------
MERGE INTO horses (id, name, breed, age, weight, health_cert_expiry,
                   status, owner_id, created_at, updated_at)
KEY (id) VALUES
('00000000-0000-0000-0002-000000000001',
 'Thunder Storm', 'Thoroughbred', 5, 480.0, '2027-06-01',
 'APPROVED', '00000000-0000-0000-0000-000000000002',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('00000000-0000-0000-0002-000000000002',
 'Golden Arrow', 'Arabian', 4, 450.0, '2027-03-15',
 'APPROVED', '00000000-0000-0000-0000-000000000002',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('00000000-0000-0000-0002-000000000003',
 'Midnight Star', 'Quarter Horse', 6, 510.0, '2026-12-31',
 'APPROVED', '00000000-0000-0000-0000-000000000003',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('00000000-0000-0000-0002-000000000004',
 'Desert Wind', 'Thoroughbred', 3, 430.0, '2027-08-20',
 'PENDING_REVIEW', '00000000-0000-0000-0000-000000000003',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ----------------------------------------------------------------
-- 4. TOURNAMENTS
--    Status: UPCOMING | ONGOING | COMPLETED
-- ----------------------------------------------------------------
MERGE INTO tournaments (id, name, start_date, end_date, description, status, created_at, updated_at)
KEY (id) VALUES
('00000000-0000-0000-0003-000000000001',
 'Vietnam Horse Racing Championship 2025',
 '2025-07-01', '2025-07-31',
 'Giải đua ngựa vô địch toàn quốc năm 2025, quy tụ các ngựa xuất sắc nhất từ 3 miền.',
 'ONGOING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('00000000-0000-0000-0003-000000000002',
 'Hanoi Sprint Cup 2025',
 '2025-09-10', '2025-09-20',
 'Cúp đua ngựa sprint nhanh nhất tại Hà Nội. Hệ số đường đua cao nhất trong năm.',
 'UPCOMING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ----------------------------------------------------------------
-- 5. RACES
--    Status: SCHEDULED | CLOSED_REGISTRATION | IN_PROGRESS | RESULT_SUBMITTED | OFFICIAL | CANCELLED
-- ----------------------------------------------------------------
MERGE INTO races (id, tournament_id, referee_id, name, start_time, distance_factor, status, created_at, updated_at)
KEY (id) VALUES
-- Race 1 – đã đóng đăng ký, do referee_duc phụ trách
('00000000-0000-0000-0004-000000000001',
 '00000000-0000-0000-0003-000000000001',
 '00000000-0000-0000-0000-000000000007',
 'Race 1 – 1200m Sprint',
 '2025-07-05 08:00:00', 1.2,
 'CLOSED_REGISTRATION', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Race 2 – sắp tới
('00000000-0000-0000-0004-000000000002',
 '00000000-0000-0000-0003-000000000001',
 '00000000-0000-0000-0000-000000000008',
 'Race 2 – 1600m Classic',
 '2025-07-12 08:00:00', 1.6,
 'SCHEDULED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Race 3 – giải Hanoi Sprint, chưa có referee
('00000000-0000-0000-0004-000000000003',
 '00000000-0000-0000-0003-000000000002',
 NULL,
 'Hanoi Sprint Qualifier',
 '2025-09-12 09:00:00', 1.0,
 'SCHEDULED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ----------------------------------------------------------------
-- 6. REGISTRATIONS (cho Race 1 – CLOSED_REGISTRATION)
--    Status: PENDING_JOCKEY | ACCEPTED | DECLINED | RACE_READY | DISQUALIFIED | CANCELLED
-- ----------------------------------------------------------------
MERGE INTO registrations (id, race_id, horse_id, owner_id, jockey_id, status, created_at, updated_at)
KEY (id) VALUES
-- Thunder Storm + Jockey Minh → RACE_READY
('00000000-0000-0000-0005-000000000001',
 '00000000-0000-0000-0004-000000000001',
 '00000000-0000-0000-0002-000000000001',
 '00000000-0000-0000-0000-000000000002',
 '00000000-0000-0000-0000-000000000004',
 'RACE_READY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Golden Arrow + Jockey Hung → RACE_READY
('00000000-0000-0000-0005-000000000002',
 '00000000-0000-0000-0004-000000000001',
 '00000000-0000-0000-0002-000000000002',
 '00000000-0000-0000-0000-000000000002',
 '00000000-0000-0000-0000-000000000005',
 'RACE_READY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Midnight Star + Jockey Lan → RACE_READY
('00000000-0000-0000-0005-000000000003',
 '00000000-0000-0000-0004-000000000001',
 '00000000-0000-0000-0002-000000000003',
 '00000000-0000-0000-0000-000000000003',
 '00000000-0000-0000-0000-000000000006',
 'RACE_READY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
