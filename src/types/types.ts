export interface UserType {
  id: string;
  email: string;
  password: string;
}

export interface DatabaseError extends Error {
  code?: string;
}
