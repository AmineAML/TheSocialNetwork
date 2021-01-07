export class LoginUserResponseDto {
  message: string;
  data: {
    access_token: string;
  };
  errors: { [key: string]: any };
}