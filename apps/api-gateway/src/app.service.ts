import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CreatePaymentIntentDto } from '@app/shared';
import { BILLING_QUEUE } from '@app/shared';

@Injectable()
export class AppService {
  private id = 1;

  constructor(
    @InjectQueue(BILLING_QUEUE) private readonly billingQueue: Queue,
  ) {}
  async handlePaymentIntent(body: CreatePaymentIntentDto) {
    await this.billingQueue.add(BILLING_QUEUE, { ...body, id: this.id });

    this.id++;
  }
}
