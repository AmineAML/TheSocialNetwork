import { IUser } from '../user.interface';

export class UpdateUserResponseDto {
  message: string;
  data: {
    user: IUser;
  };
  errors: { [key: string]: any };
}