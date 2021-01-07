import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export class Configs {
    constructor(private readonly config: ConfigService) {
        this.config = config
    }
    
    port = this.config.get('API_GATEWAY_PORT')

    accountService = {
        options: {
            url: this.config.get<string>('REDIS_ACCOUNT_SERVICE_URL')
        },
        Transport: Transport.REDIS
    }

    isProduction() {
        return this.config.get('NODE_ENV') === 'production'
    }
}