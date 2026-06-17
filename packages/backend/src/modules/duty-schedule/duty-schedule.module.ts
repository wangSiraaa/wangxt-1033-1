import { Module } from '@nestjs/common';
import { DutyScheduleService } from './duty-schedule.service';
import { DutyScheduleController } from './duty-schedule.controller';

@Module({
  controllers: [DutyScheduleController],
  providers: [DutyScheduleService],
  exports: [DutyScheduleService],
})
export class DutyScheduleModule {}
