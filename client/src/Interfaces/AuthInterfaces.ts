export interface ILoginDto {
  username: string;
  password: string;
}

export interface IPasswordDto {
  old_password: string;
  new_password: string;
  confirm_new_password?: string | null;
}
