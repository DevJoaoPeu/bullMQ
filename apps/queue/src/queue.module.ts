import { BILLING_QUEUE, SharedModule } from '@app/shared';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { PaymentIntentProcessor } from './billing/payment-intent.processor';

@Module({
  imports: [
    SharedModule,
    BullModule.registerQueue({
      name: BILLING_QUEUE,
    }),
  ],
  providers: [PaymentIntentProcessor],
})
export class QueueModule {}
