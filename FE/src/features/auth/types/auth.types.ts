export interface UserResponse {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  lastLoginAt: string | null;
}

// Cập nhật danh sách các Role chính thức theo tài liệu SRS đua ngựa
export type Role = "ADMIN" | "HORSE_OWNER" | "JOCKEY" | "REFEREE" | "SPECTATOR";

// Cập nhật trạng thái User phù hợp với việc kiểm duyệt hồ sơ trong hệ thống
export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING_VERIFICATION"
  | "PENDING_APPROVAL"
  | "SUSPENDED";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: Role; // Bổ sung trường role để truyền từ Form Đăng ký xuống API Backend
}

export interface AuthResponse {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  status: UserStatus;
  lastLoginAt: string | null;
}
