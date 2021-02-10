import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ContactUsResponseDto } from './interfaces/mailer/dto/contact-us-response.dto';
import { ContactUsDto } from './interfaces/mailer/dto/contact-us.dto';
import { IServiceContactUsResponse } from './interfaces/mailer/service-mailer-respone.interface';

@Controller('mailer')
export class MailerController {
    constructor(@Inject('MAILER_SERVICE') private readonly mailerServiceClient: ClientProxy) { }

    //Contact us email
    @Post('contact')
    public async contactUs(@Body() contactRequest: ContactUsDto): Promise<ContactUsResponseDto> {
        const contactResponse: IServiceContactUsResponse = await this.mailerServiceClient
            .send('mailer_contact_us_email', contactRequest)
            .toPromise();

        return {
            message: contactResponse.message,
            errors: null,
        };
    }
}
