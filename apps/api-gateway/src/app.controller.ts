import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePaymentIntentDto } from '@app/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('payment-intent')
  async handlePaymentIntent(@Body() body: CreatePaymentIntentDto) {
    return await this.appService.handlePaymentIntent(body);
  }
}
