export interface IUserRegister {
  name: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'USER'|undefined;
}
