import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CrisisTrackingService } from './crisis-tracking.service';
import {
  HighRiskDetectionDto,
  HighRiskDetectionResultDto,
  CrisisTimelineResponseDto,
  CrisisCaseDetailDto,
  EscalateCrisisDto,
  CloseTrackingDto,
  CreateCrisisFromAssessmentDto,
} from '@shared/dto/crisis-tracking.dto';

@Controller('crisis-tracking')
export class CrisisTrackingController {
  constructor(private readonly crisisTrackingService: CrisisTrackingService) {}

  @Post('detect-high-risk')
  @HttpCode(HttpStatus.OK)
  async detectMultipleHighRisk(
    @Body() dto: HighRiskDetectionDto,
  ): Promise<HighRiskDetectionResultDto> {
    return this.crisisTrackingService.detectMultipleHighRisk(dto);
  }

  @Post('create-from-assessment')
  @HttpCode(HttpStatus.CREATED)
  async createCrisisFromAssessment(
    @Body() dto: CreateCrisisFromAssessmentDto,
  ): Promise<any> {
    return this.crisisTrackingService.createCrisisFromAssessment(dto);
  }

  @Get(':id/detail')
  async getCrisisCaseDetail(
    @Param('id') id: string,
  ): Promise<CrisisCaseDetailDto> {
    return this.crisisTrackingService.getCrisisCaseDetail(id);
  }

  @Get(':id/timeline')
  async getCrisisTimeline(
    @Param('id') id: string,
  ): Promise<CrisisTimelineResponseDto[]> {
    return this.crisisTrackingService.getCrisisTimeline(id);
  }

  @Put('escalate')
  async escalateCrisis(@Body() dto: EscalateCrisisDto): Promise<any> {
    return this.crisisTrackingService.escalateCrisis(dto);
  }

  @Put('close-tracking')
  async closeTracking(@Body() dto: CloseTrackingDto): Promise<any> {
    return this.crisisTrackingService.closeTracking(dto);
  }

  @Get('daily-tracking/check')
  async checkDailyTrackingRequired(): Promise<{
    pendingCases: any[];
    overdueCases: any[];
  }> {
    return this.crisisTrackingService.checkDailyTrackingRequired();
  }
}
