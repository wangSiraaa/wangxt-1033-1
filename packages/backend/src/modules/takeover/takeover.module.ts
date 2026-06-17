import { Module } from '@nestjs/common';
import { TakeoverService } from './takeover.service';
import { TakeoverController } from './takeover.controller';

@Module({
  controllers: [TakeoverController],
  providers: [TakeoverService],
  exports: [TakeoverService],
})
export class TakeoverModule {}
