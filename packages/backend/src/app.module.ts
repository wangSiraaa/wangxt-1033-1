import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { CrisisTrackingModule } from './modules/crisis-tracking/crisis-tracking.module';
import { DutyScheduleModule } from './modules/duty-schedule/duty-schedule.module';
import { GroupCounselingModule } from './modules/group-counseling/group-counseling.module';
import { TakeoverModule } from './modules/takeover/takeover.module';
import { DailyTrackingModule } from './modules/daily-tracking/daily-tracking.module';

@Module({
  imports: [
    UsersModule,
    CrisisTrackingModule,
    DutyScheduleModule,
    GroupCounselingModule,
    TakeoverModule,
    DailyTrackingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
