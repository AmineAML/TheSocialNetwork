export interface IEmailData {
  to: string;
  from: string
  subject: string;
  text: string;
  html?: string;
}