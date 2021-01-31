import { IInterest } from '../interest.interface';

export class GetInterestAllResponseDto {
  message: string;
  data: {
    interests: IInterest[];
  };
  errors: { [key: string]: any };
}