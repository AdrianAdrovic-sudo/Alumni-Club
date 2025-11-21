export type UserRole = "admin" | "alumni";

export interface JwtUserPayload {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: JwtUserPayload;
}
