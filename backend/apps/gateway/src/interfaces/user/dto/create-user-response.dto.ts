import { IUser } from '../user.interface';

export class CreateUserResponseDto {
  message: string;
  data: {
    user: IUser;
    access_token: string;
    refresh_token: string;
  };
  errors: { [key: string]: any };
}