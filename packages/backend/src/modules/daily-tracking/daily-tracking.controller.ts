import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DailyTrackingService } from './daily-tracking.service';
import { FollowUpService } from './follow-up.service';
import {
  CreateDailyTrackingDto,
  UpdateDailyTrackingDto,
  DailyTrackingQueryDto,
  DailyTrackingSummaryDto,
  MarkTrackingCompleteDto,
  BulkTrackingReminderDto,
} from '@shared/dto/daily-tracking.dto';
import {
  CreateFollowUpDto,
  UpdateFollowUpDto,
  FollowUpQueryDto,
  CompleteFollowUpDto,
  BatchCreateFollowUpDto,
  FollowUpPlanDto,
} from '@shared/dto/follow-up.dto';

@Controller('daily-tracking')
export class DailyTrackingController {
  constructor(
    private readonly dailyTrackingService: DailyTrackingService,
    private readonly followUpService: FollowUpService,
  ) {}

  @Post('records')
  @HttpCode(HttpStatus.CREATED)
  async createTracking(@Body() dto: CreateDailyTrackingDto): Promise<any> {
    return this.dailyTrackingService.create(dto, 'system', '系统管理员');
  }

  @Get('records')
  async findAllTrackings(@Query() query: DailyTrackingQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const result = await this.dailyTrackingService.findAll(query);
    return {
      ...result,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    };
  }

  @Get('records/:id')
  async findOneTracking(@Param('id') id: string): Promise<any> {
    return this.dailyTrackingService.findOne(id);
  }

  @Put('records/:id')
  async updateTracking(
    @Param('id') id: string,
    @Body() dto: UpdateDailyTrackingDto,
  ): Promise<any> {
    return this.dailyTrackingService.update(id, dto);
  }

  @Delete('records/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTracking(@Param('id') id: string): Promise<void> {
    return this.dailyTrackingService.remove(id);
  }

  @Post('records/:id/complete')
  async markComplete(
    @Param('id') id: string,
    @Body() dto: MarkTrackingCompleteDto,
  ): Promise<any> {
    return this.dailyTrackingService.markComplete(id, dto);
  }

  @Get('summary/:crisisCaseId')
  async getSummary(
    @Param('crisisCaseId') crisisCaseId: string,
  ): Promise<DailyTrackingSummaryDto> {
    return this.dailyTrackingService.getSummary(crisisCaseId);
  }

  @Get('pending/all')
  async getPendingTrackings(): Promise<{
    pendingCases: any[];
    overdueCases: any[];
  }> {
    return this.dailyTrackingService.getPendingTrackings();
  }

  @Post('reminders/bulk')
  async sendBulkReminders(
    @Body() dto: BulkTrackingReminderDto,
  ): Promise<{ sent: number; crisisCases: string[] }> {
    return this.dailyTrackingService.sendBulkReminders(dto);
  }

  @Post('followups')
  @HttpCode(HttpStatus.CREATED)
  async createFollowUp(@Body() dto: CreateFollowUpDto): Promise<any> {
    return this.followUpService.create(dto);
  }

  @Post('followups/batch')
  @HttpCode(HttpStatus.CREATED)
  async batchCreateFollowUps(
    @Body() dto: BatchCreateFollowUpDto,
  ): Promise<any[]> {
    return this.followUpService.batchCreate(dto);
  }

  @Get('followups')
  async findAllFollowUps(@Query() query: FollowUpQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const result = await this.followUpService.findAll(query);
    return {
      ...result,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    };
  }

  @Get('followups/:id')
  async findOneFollowUp(@Param('id') id: string): Promise<any> {
    return this.followUpService.findOne(id);
  }

  @Put('followups/:id')
  async updateFollowUp(
    @Param('id') id: string,
    @Body() dto: UpdateFollowUpDto,
  ): Promise<any> {
    return this.followUpService.update(id, dto);
  }

  @Delete('followups/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFollowUp(@Param('id') id: string): Promise<void> {
    return this.followUpService.remove(id);
  }

  @Post('followups/:id/complete')
  async completeFollowUp(
    @Param('id') id: string,
    @Body() dto: CompleteFollowUpDto,
  ): Promise<any> {
    return this.followUpService.complete(id, dto);
  }

  @Post('followups/:id/skip')
  async skipFollowUp(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<any> {
    return this.followUpService.skip(id, reason);
  }

  @Post('followups/:id/start')
  async startFollowUp(@Param('id') id: string): Promise<any> {
    return this.followUpService.startFollowUp(id);
  }

  @Get('followups/plan/:crisisCaseId')
  async getFollowUpPlan(
    @Param('crisisCaseId') crisisCaseId: string,
  ): Promise<FollowUpPlanDto> {
    return this.followUpService.getFollowUpPlan(crisisCaseId);
  }
}
