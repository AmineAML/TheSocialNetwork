import { SendGridService } from '@anchan828/nest-sendgrid';
import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagePattern } from '@nestjs/microservices';
import { IEmailData } from './interfaces/email-data.interface';
import { IMailSendResponse } from './interfaces/mail-send-response.interface';

const logger = new Logger('MAILER')

@Controller()
export class ServiceMailerController {
  constructor(private readonly sendGrid: SendGridService,
              private readonly configService: ConfigService) {}



  @MessagePattern('mail_send_confirm_email')
  async mailSendConfirmEmail(data: IEmailData): Promise<IMailSendResponse> {
    let result = null

    const enabled = this.configService.get('ENABLE_MAILER')

    console.log(enabled)

    if (enabled) {
      await this.sendGrid.send(data).then(() => {
        logger.log('Confirm account email sent')
  
        result = {
          status: HttpStatus.ACCEPTED,
          message: 'mail_send_confirm_email_success'
        };
      }).catch(e => {
        logger.error(`Couldn't send account confirmation email: ${e}`)
  
        result = {
          status: HttpStatus.NOT_ACCEPTABLE,
          message: 'mail_send_confirm_email_failed_to_send'
        };
      })
    }

    return result
  }

  @MessagePattern('mail_send_welcome_tutorial')
  async mailSendWelcomeTutorial(data: IEmailData): Promise<IMailSendResponse> {
    let result: any

    const enabled = this.configService.get<boolean>('ENABLE_MAILER')

    console.log(enabled)

    if (enabled) {
      await this.sendGrid.send(data).then(() => {
        logger.log('Confirm account email sent')
  
        result = {
          status: HttpStatus.ACCEPTED,
          message: 'mail_send_confirm_email_success'
        };
      }).catch(e => {
        logger.error(`Couldn't send account confirmation email: ${e}`)
  
        result = {
          status: HttpStatus.NOT_ACCEPTABLE,
          message: 'mail_send_confirm_email_failed_to_send'
        };
      })
    }

    return result
  }
}
