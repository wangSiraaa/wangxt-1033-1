import { Module } from '@nestjs/common';
import { GroupCounselingService } from './group-counseling.service';
import { GroupCounselingController } from './group-counseling.controller';

@Module({
  controllers: [GroupCounselingController],
  providers: [GroupCounselingService],
  exports: [GroupCounselingService],
})
export class GroupCounselingModule {}
