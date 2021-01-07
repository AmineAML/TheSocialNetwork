import { IUser } from '../user.interface';

export class GetUsersByQueryResponseDto {
  message: string;
  data: {
    users: any//IUser[];
  };
  errors: { [key: string]: any };
}