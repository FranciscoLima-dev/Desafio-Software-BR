export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: AuthenticatedUser;
  token: string;
};

