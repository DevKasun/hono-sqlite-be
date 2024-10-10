export interface UserType {
  email: string;
  password: string;
}

export interface DatabaseError extends Error {
  code?: string;
}
