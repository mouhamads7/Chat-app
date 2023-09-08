export type User = {
  username: string;
  password: string;
};

export type UserWithId = {
  id: number;
  username: string;
  password: string;
};

export type Friend = {
  username: string;
  connected: string;
  userid: string;
};
