export interface AdminSession {
  userId: string;
  email: string;
  accessToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
