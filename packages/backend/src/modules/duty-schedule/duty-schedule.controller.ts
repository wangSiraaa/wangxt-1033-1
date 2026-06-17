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
import { DutyScheduleService } from './duty-schedule.service';
import {
  CreateDutyScheduleDto,
  UpdateDutyScheduleDto,
  DutyScheduleQueryDto,
  SwapDutyDto,
  BatchCreateDutyScheduleDto,
  DutyScheduleByDateDto,
} from '@shared/dto/duty.dto';

@Controller('duty-schedule')
export class DutyScheduleController {
  constructor(private readonly dutyScheduleService: DutyScheduleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateDutyScheduleDto): Promise<any> {
    return this.dutyScheduleService.create(dto, 'system');
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  async batchCreate(@Body() dto: BatchCreateDutyScheduleDto): Promise<any[]> {
    return this.dutyScheduleService.batchCreate(dto, 'system');
  }

  @Get()
  async findAll(@Query() query: DutyScheduleQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const result = await this.dutyScheduleService.findAll(query);
    return {
      ...result,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.dutyScheduleService.findOne(id);
  }

  @Get('by-date/:date')
  async findByDate(@Param('date') date: string): Promise<any[]> {
    return this.dutyScheduleService.findByDate(new Date(date));
  }

  @Get('schedule/by-date')
  async getDutyByDate(
    @Query('date') date?: string,
  ): Promise<DutyScheduleByDateDto> {
    return this.dutyScheduleService.getDutyByDate(
      date ? new Date(date) : new Date(),
    );
  }

  @Get('current/counselor')
  async getCurrentDutyCounselor(): Promise<any | null> {
    return this.dutyScheduleService.getCurrentDutyCounselor();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDutyScheduleDto,
  ): Promise<any> {
    return this.dutyScheduleService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.dutyScheduleService.remove(id);
  }

  @Post(':id/swap/request')
  async requestSwap(
    @Param('id') id: string,
    @Body() dto: SwapDutyDto,
  ): Promise<any> {
    return this.dutyScheduleService.requestSwap(id, dto, 'system');
  }

  @Post(':id/swap/confirm')
  async confirmSwap(@Param('id') id: string): Promise<any> {
    return this.dutyScheduleService.confirmSwap(id, 'system');
  }

  @Post(':id/start')
  async startDuty(@Param('id') id: string): Promise<any> {
    return this.dutyScheduleService.startDuty(id);
  }

  @Post(':id/end')
  async endDuty(@Param('id') id: string): Promise<any> {
    return this.dutyScheduleService.endDuty(id);
  }
}
