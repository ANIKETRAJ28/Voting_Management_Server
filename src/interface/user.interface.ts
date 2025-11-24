export interface IUserResponse {
  id: string;
  address: string;
}
export interface IUser extends IUserResponse {
  nonce: string;
  created_at: Date;
  last_login: Date | null;
}
