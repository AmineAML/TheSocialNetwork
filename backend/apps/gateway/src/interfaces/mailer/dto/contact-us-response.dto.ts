import { IContact } from "../contact.interface";

export class ContactUsResponseDto {
  message: string;
  errors: { [key: string]: any };
}