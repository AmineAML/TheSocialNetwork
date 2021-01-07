import { IUser } from '../user.interface';

export class GetUserByTokenResponseDto {
  message: string;
  data: {
    user: IUser;
  };
  errors: { [key: string]: any };
}