export type LoginUser = {
  email: string;
  password: string;
};

export interface SignUpUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt?:Date;
};
