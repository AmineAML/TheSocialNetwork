export interface IServiceImageDeleteResponse {
    status: number;
    message: string;
    errors: { [key: string]: any };
  }