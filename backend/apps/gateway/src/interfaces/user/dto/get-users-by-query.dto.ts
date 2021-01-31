import { IUser } from '../user.interface';

export class GetUsersByQueryResponseDto {
  message: string;
  data: {
    users: any;//IUser[];
    meta: {
      itemCount: number;
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    },
    link: {
      first: string;
      previous: string;
      next: string;
      last: string;
    }
  };
  errors: { [key: string]: any };
}