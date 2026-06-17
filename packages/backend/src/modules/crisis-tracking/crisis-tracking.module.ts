import { Module, forwardRef } from '@nestjs/common';
import { CrisisTrackingService } from './crisis-tracking.service';
import { CrisisTrackingController } from './crisis-tracking.controller';

@Module({
  controllers: [CrisisTrackingController],
  providers: [CrisisTrackingService],
  exports: [CrisisTrackingService],
})
export class CrisisTrackingModule {}
