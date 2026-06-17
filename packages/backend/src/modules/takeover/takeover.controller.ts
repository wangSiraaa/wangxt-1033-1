import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TakeoverService } from './takeover.service';
import {
  CreateTakeoverDto,
  ReleaseTakeoverDto,
  TakeoverQueryDto,
  BatchTakeoverDto,
  TakeoverAppointmentCheckDto,
  TakeoverCheckResultDto,
} from '@shared/dto/takeover.dto';

@Controller('takeover')
export class TakeoverController {
  constructor(private readonly takeoverService: TakeoverService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTakeover(@Body() dto: CreateTakeoverDto): Promise<any> {
    return this.takeoverService.createTakeover(dto);
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  async batchTakeover(@Body() dto: BatchTakeoverDto): Promise<any[]> {
    return this.takeoverService.batchTakeover(dto);
  }

  @Post(':id/release')
  async releaseTakeover(
    @Param('id') id: string,
    @Body() dto: ReleaseTakeoverDto,
  ): Promise<any> {
    return this.takeoverService.releaseTakeover(id, dto);
  }

  @Get()
  async findAll(@Query() query: TakeoverQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const result = await this.takeoverService.findAll(query);
    return {
      ...result,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.takeoverService.findOne(id);
  }

  @Get('student/:studentId/active')
  async getActiveTakeoverByStudent(
    @Param('studentId') studentId: string,
  ): Promise<any | null> {
    return this.takeoverService.getActiveTakeoverByStudent(studentId);
  }

  @Post('appointment/check')
  @HttpCode(HttpStatus.OK)
  async checkAppointmentTakeover(
    @Body() dto: TakeoverAppointmentCheckDto,
  ): Promise<TakeoverCheckResultDto> {
    return this.takeoverService.checkAppointmentTakeover(dto);
  }

  @Get('appointment/:appointmentId/can-cancel')
  async canStudentCancelAppointment(
    @Param('appointmentId') appointmentId: string,
    @Query('studentId') studentId: string,
  ): Promise<{ canCancel: boolean; reason?: string }> {
    const canCancel = await this.takeoverService.canStudentCancelAppointment(
      appointmentId,
      studentId,
    );
    return {
      canCancel,
      reason: canCancel ? undefined : '该预约已被接管，学生无法自行取消',
    };
  }
}
