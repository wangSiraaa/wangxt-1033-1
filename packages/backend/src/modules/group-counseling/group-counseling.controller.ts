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
import { GroupCounselingService } from './group-counseling.service';
import {
  CreateGroupCounselingDto,
  UpdateGroupCounselingDto,
  GroupCounselingQueryDto,
  JoinGroupCounselingDto,
  LeaveGroupCounselingDto,
  GroupMemberQueryDto,
  RecordAttendanceDto,
  GroupRoomConflictCheckDto,
  RoomConflictResultDto,
} from '@shared/dto/group-counseling.dto';

@Controller('group-counseling')
export class GroupCounselingController {
  constructor(private readonly groupCounselingService: GroupCounselingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateGroupCounselingDto): Promise<any> {
    return this.groupCounselingService.create(dto, 'system');
  }

  @Get()
  async findAll(@Query() query: GroupCounselingQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const result = await this.groupCounselingService.findAll(query);
    return {
      ...result,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.groupCounselingService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGroupCounselingDto,
  ): Promise<any> {
    return this.groupCounselingService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.groupCounselingService.remove(id);
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string): Promise<any> {
    return this.groupCounselingService.publish(id);
  }

  @Post(':id/start')
  async startGroup(@Param('id') id: string): Promise<any> {
    return this.groupCounselingService.startGroup(id);
  }

  @Post(':id/complete')
  async completeGroup(@Param('id') id: string): Promise<any> {
    return this.groupCounselingService.completeGroup(id);
  }

  @Post(':id/cancel')
  async cancelGroup(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<any> {
    return this.groupCounselingService.cancelGroup(id, reason);
  }

  @Get(':id/members')
  async getMembers(
    @Param('id') id: string,
    @Query() query: GroupMemberQueryDto,
  ): Promise<{
    items: any[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const result = await this.groupCounselingService.getMembers(id, query);
    return {
      ...result,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    };
  }

  @Post(':id/members/join')
  async join(
    @Param('id') id: string,
    @Body() dto: JoinGroupCounselingDto,
  ): Promise<any> {
    return this.groupCounselingService.join(id, dto);
  }

  @Post(':id/members/:memberId/leave')
  async leave(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() dto: LeaveGroupCounselingDto,
  ): Promise<any> {
    return this.groupCounselingService.leave(id, memberId, dto);
  }

  @Post(':id/attendance')
  @HttpCode(HttpStatus.OK)
  async recordAttendance(
    @Param('id') id: string,
    @Body() dto: RecordAttendanceDto,
  ): Promise<void> {
    return this.groupCounselingService.recordAttendance(id, dto);
  }

  @Post('room-conflict/check')
  async checkRoomConflict(
    @Body() dto: GroupRoomConflictCheckDto,
  ): Promise<RoomConflictResultDto> {
    return this.groupCounselingService.checkRoomConflict(dto);
  }

  @Post('room-conflict/reschedule-check')
  async checkRoomConflictForReschedule(
    @Body()
    dto: {
      roomId: string;
      date: Date;
      startTime: string;
      endTime: string;
      appointmentId?: string;
    },
  ): Promise<{ hasConflict: boolean }> {
    const hasConflict =
      await this.groupCounselingService.checkRoomConflictForReschedule(
        dto.roomId,
        new Date(dto.date),
        dto.startTime,
        dto.endTime,
        dto.appointmentId,
      );
    return { hasConflict };
  }
}
