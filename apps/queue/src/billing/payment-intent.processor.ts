import { BILLING_QUEUE, CreatePaymentIntentDto } from '@app/shared';
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Worker, Job, Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class PaymentIntentProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PaymentIntentProcessor.name);
  private worker: Worker;

  constructor(
    private readonly configService: ConfigService,
    @InjectQueue(BILLING_QUEUE) private readonly billingQueue: Queue,
  ) {}

  async onModuleInit() {
    this.worker = new Worker(
      BILLING_QUEUE,
      async (job: Job<CreatePaymentIntentDto & { id: number }>) => {
        this.logger.debug(`Processing job ${job.data.id}`);
        await this.wait(2000);
        this.logger.debug(
          `Creating payment intent for job ${job.data.id} with amount ${job.data.amount}`,
        );
        await this.wait(5000);
        this.logger.debug(
          `Payment intent for job ${job.data.id} with amount ${job.data.amount}`,
        );
      },
      {
        connection: this.billingQueue.opts.connection,
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Job ${job.id} completed!`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job.id} failed with error: ${err.message}`);
    });
  }

  async onModuleDestroy() {
    await this.worker.close();
  }

  private async wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
