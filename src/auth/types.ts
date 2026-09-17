export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
};

export type AuthSession = {
  user: SessionUser;
  expires: string;
};
