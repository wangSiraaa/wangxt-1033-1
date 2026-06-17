import { Module } from '@nestjs/common';
import { DailyTrackingService } from './daily-tracking.service';
import { DailyTrackingController } from './daily-tracking.controller';
import { FollowUpService } from './follow-up.service';

@Module({
  controllers: [DailyTrackingController],
  providers: [DailyTrackingService, FollowUpService],
  exports: [DailyTrackingService, FollowUpService],
})
export class DailyTrackingModule {}
