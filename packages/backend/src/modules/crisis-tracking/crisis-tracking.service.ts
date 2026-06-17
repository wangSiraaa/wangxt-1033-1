import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  HighRiskDetectionDto,
  HighRiskDetectionResultDto,
  CrisisTimelineResponseDto,
  CrisisCaseDetailDto,
  EscalateCrisisDto,
  CloseTrackingDto,
  CreateCrisisFromAssessmentDto,
} from '@shared/dto/crisis-tracking.dto';
import {
  IRiskAssessment,
  ICrisisCase,
  IAppointment,
  IReferralRecord,
  ITakeoverRecord,
  IDailyTrackingRecord,
  IFollowUp,
  ICrisisTimeline,
  IHighRiskDetectionResult,
} from '@shared/interfaces';
import {
  RiskLevel,
  CrisisStatus,
  CrisisSource,
  TrackingRecordType,
  UserRole,
  NotificationType,
} from '@shared/enums';

@Injectable()
export class CrisisTrackingService {
  private highRiskAssessments: Map<string, IRiskAssessment[]> = new Map();
  private crisisCases: Map<string, ICrisisCase> = new Map();
  private appointments: Map<string, IAppointment> = new Map();
  private referrals: Map<string, IReferralRecord> = new Map();
  private takeoverRecords: Map<string, ITakeoverRecord> = new Map();
  private dailyTrackings: Map<string, IDailyTrackingRecord[]> = new Map();
  private followUps: Map<string, IFollowUp[]> = new Map();

  constructor() {}

  async detectMultipleHighRisk(
    dto: HighRiskDetectionDto,
  ): Promise<HighRiskDetectionResultDto> {
    const { studentId, timeWindowHours = 24, riskThreshold = RiskLevel.HIGH } = dto;

    const studentAssessments = this.highRiskAssessments.get(studentId) || [];
    const now = new Date();
    const windowStart = new Date(now.getTime() - timeWindowHours * 60 * 60 * 1000);

    const highRiskAssessmentsInWindow = studentAssessments.filter(
      (a) =>
        a.riskLevel === riskThreshold ||
        a.riskLevel === RiskLevel.CRITICAL ||
        a.isHighRisk,
    ).filter((a) => new Date(a.assessmentDate) >= windowStart);

    const highRiskCount = highRiskAssessmentsInWindow.length;
    const isMultipleHighRisk = highRiskCount >= 2;

    const existingCrisisCase = this.findActiveCrisisCase(studentId);

    let shouldEscalate = false;
    let escalationReason = '';
    const suggestedActions: string[] = [];

    if (isMultipleHighRisk) {
      shouldEscalate = true;
      escalationReason = `${timeWindowHours}小时内出现${highRiskCount}次高危评估，需立即启动人工干预`;
      suggestedActions.push('立即通知危机组长');
      suggestedActions.push('指派专人接管');
      suggestedActions.push('通知辅导员');
      suggestedActions.push('启动每日追踪机制');
      suggestedActions.push('联系家长评估风险');
    } else if (highRiskCount === 1 && !existingCrisisCase) {
      shouldEscalate = true;
      escalationReason = '首次出现高危评估，需建立危机个案并安排首次评估';
      suggestedActions.push('建立危机个案');
      suggestedActions.push('安排首次评估');
      suggestedActions.push('通知危机组长');
    }

    return {
      studentId,
      studentName: this.getStudentName(studentId),
      isMultipleHighRisk,
      highRiskCount,
      timeWindowHours,
      firstAssessmentDate:
        highRiskAssessmentsInWindow.length > 0
          ? new Date(highRiskAssessmentsInWindow[highRiskAssessmentsInWindow.length - 1].assessmentDate)
          : undefined,
      latestAssessmentDate:
        highRiskAssessmentsInWindow.length > 0
          ? new Date(highRiskAssessmentsInWindow[0].assessmentDate)
          : undefined,
      assessments: highRiskAssessmentsInWindow,
      existingCrisisCaseId: existingCrisisCase?.id,
      shouldEscalate,
      escalationReason,
      suggestedActions,
    };
  }

  async createCrisisFromAssessment(
    dto: CreateCrisisFromAssessmentDto,
  ): Promise<ICrisisCase> {
    const detectionResult = await this.detectMultipleHighRisk({
      studentId: dto.studentId,
    });

    if (!detectionResult.shouldEscalate && !dto.isEmergency) {
      throw new BadRequestException('当前情况未达到危机干预标准');
    }

    const crisisCase: ICrisisCase = {
      id: this.generateId(),
      studentId: dto.studentId,
      reporterId: dto.reporterId,
      counselorId: undefined,
      crisisLeaderId: undefined,
      status: CrisisStatus.IDENTIFIED,
      severity: dto.severity,
      source: dto.source,
      title: dto.title,
      description: dto.description,
      reportedAt: new Date(),
      isEmergency: dto.isEmergency,
      policeInvolved: false,
      hospitalInvolved: false,
      familyNotified: false,
      mentorNotified: false,
      isManualTakeover: false,
      trackingCount: 0,
      isTrackingClosed: false,
      riskAssessmentIds: dto.assessmentIds,
      appointmentIds: [],
      referralIds: [],
    };

    this.crisisCases.set(crisisCase.id, crisisCase);
    this.associateStudentCrisisCase(dto.studentId, crisisCase.id);

    return crisisCase;
  }

  async getCrisisCaseDetail(crisisCaseId: string): Promise<CrisisCaseDetailDto> {
    const crisisCase = this.crisisCases.get(crisisCaseId);
    if (!crisisCase) {
      throw new NotFoundException('危机个案不存在');
    }

    const assessments = this.getAssessmentsForCrisis(crisisCaseId);
    const appointments = this.getAppointmentsForCrisis(crisisCaseId);
    const referrals = this.getReferralsForCrisis(crisisCaseId);
    const trackingRecords = this.getDailyTrackings(crisisCaseId);
    const followUps = this.getFollowUps(crisisCaseId);
    const takeoverRecords = this.getTakeoverRecords(crisisCaseId);
    const timeline = this.buildCrisisTimeline(crisisCaseId);

    const dailyTrackingSummary = this.getDailyTrackingSummary(crisisCaseId);

    return {
      crisisCase,
      assessments,
      appointments,
      referrals,
      trackingRecords,
      followUps,
      takeoverRecords,
      timeline,
      dailyTrackingSummary,
    };
  }

  async getCrisisTimeline(
    crisisCaseId: string,
  ): Promise<CrisisTimelineResponseDto[]> {
    return this.buildCrisisTimeline(crisisCaseId);
  }

  async escalateCrisis(dto: EscalateCrisisDto): Promise<ICrisisCase> {
    const crisisCase = this.crisisCases.get(dto.crisisCaseId);
    if (!crisisCase) {
      throw new NotFoundException('危机个案不存在');
    }

    crisisCase.severity = dto.newSeverity;
    if (dto.newStatus) {
      crisisCase.status = dto.newStatus;
    }
    crisisCase.updatedAt = new Date();

    if (dto.newSeverity === RiskLevel.CRITICAL) {
      crisisCase.isManualTakeover = true;
    }

    this.addTrackingNote(crisisCase.id, {
      type: 'status_change',
      title: '危机等级升级',
      description: `从${crisisCase.severity}升级为${dto.newSeverity}，原因：${dto.reason}`,
      actorId: dto.operatorId,
    });

    return crisisCase;
  }

  async closeTracking(dto: CloseTrackingDto): Promise<ICrisisCase> {
    const crisisCase = this.crisisCases.get(dto.crisisCaseId);
    if (!crisisCase) {
      throw new NotFoundException('危机个案不存在');
    }

    crisisCase.isTrackingClosed = true;
    crisisCase.status = dto.finalStatus;
    crisisCase.closedAt = new Date();

    this.addTrackingNote(crisisCase.id, {
      type: 'status_change',
      title: '追踪闭环',
      description: `追踪已关闭，原因：${dto.reason}，最终状态：${dto.finalStatus}`,
      actorId: dto.closedBy,
    });

    return crisisCase;
  }

  async checkDailyTrackingRequired(): Promise<{
    pendingCases: ICrisisCase[];
    overdueCases: ICrisisCase[];
  }> {
    const pendingCases: ICrisisCase[] = [];
    const overdueCases: ICrisisCase[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const crisisCase of this.crisisCases.values()) {
      if (
        crisisCase.isTrackingClosed ||
        crisisCase.status === CrisisStatus.RESOLVED
      ) {
        continue;
      }

      const trackings = this.dailyTrackings.get(crisisCase.id) || [];
      const lastTracking = trackings.length > 0 ? trackings[0] : null;
      const lastTrackingDate = lastTracking
        ? new Date(lastTracking.trackingDate)
        : null;

      if (!lastTrackingDate || lastTrackingDate < today) {
        pendingCases.push(crisisCase);

        if (
          lastTrackingDate &&
          today.getTime() - lastTrackingDate.getTime() > 24 * 60 * 60 * 1000
        ) {
          overdueCases.push(crisisCase);
        }
      }
    }

    return { pendingCases, overdueCases };
  }

  private buildCrisisTimeline(crisisCaseId: string): ICrisisTimeline[] {
    const timeline: ICrisisTimeline[] = [];
    const crisisCase = this.crisisCases.get(crisisCaseId);
    if (!crisisCase) return timeline;

    const assessments = this.getAssessmentsForCrisis(crisisCaseId);
    const appointments = this.getAppointmentsForCrisis(crisisCaseId);
    const referrals = this.getReferralsForCrisis(crisisCaseId);
    const trackings = this.getDailyTrackings(crisisCaseId);
    const takeovers = this.getTakeoverRecords(crisisCaseId);

    timeline.push({
      id: `crisis-${crisisCase.id}`,
      crisisCaseId,
      type: 'status_change',
      title: '危机个案建立',
      description: `${crisisCase.source}来源，等级：${crisisCase.severity}`,
      timestamp: new Date(crisisCase.reportedAt),
      actorId: crisisCase.reporterId,
      relatedId: crisisCase.id,
      relatedType: 'crisis_case',
    });

    assessments.forEach((a) => {
      timeline.push({
        id: `assessment-${a.id}`,
        crisisCaseId,
        type: 'assessment',
        title: '风险评估',
        description: `风险等级：${a.riskLevel}，总分：${a.overallScore}`,
        timestamp: new Date(a.assessmentDate),
        actorId: a.counselorId,
        relatedId: a.id,
        relatedType: 'risk_assessment',
        details: {
          selfHarmScore: a.selfHarmScore,
          suicideScore: a.suicideScore,
          depressionScore: a.depressionScore,
        },
      });
    });

    appointments.forEach((a) => {
      timeline.push({
        id: `appointment-${a.id}`,
        crisisCaseId,
        type: 'appointment',
        title: '咨询预约',
        description: `${a.startTime}-${a.endTime}，咨询师：${a.counselorId}，状态：${a.status}`,
        timestamp: new Date(a.date),
        actorId: a.counselorId,
        relatedId: a.id,
        relatedType: 'appointment',
      });
    });

    referrals.forEach((r) => {
      timeline.push({
        id: `referral-${r.id}`,
        crisisCaseId,
        type: 'referral',
        title: '转介记录',
        description: `转介至：${r.referredToName || r.referredTo}，类型：${r.referralType}`,
        timestamp: new Date(r.referralDate),
        actorId: r.referredFrom,
        relatedId: r.id,
        relatedType: 'referral',
      });
    });

    trackings.forEach((t) => {
      timeline.push({
        id: `tracking-${t.id}`,
        crisisCaseId,
        type: 'tracking',
        title: '每日追踪',
        description: `追踪人：${t.trackerName}，状态：${t.status}，是否稳定：${t.isStable ? '是' : '否'}`,
        timestamp: new Date(t.trackingDate),
        actorId: t.trackerId,
        relatedId: t.id,
        relatedType: 'daily_tracking',
        details: {
          moodLevel: t.moodLevel,
          sleepStatus: t.sleepStatus,
          appetiteStatus: t.appetiteStatus,
        },
      });
    });

    takeovers.forEach((t) => {
      timeline.push({
        id: `takeover-${t.id}`,
        crisisCaseId,
        type: 'takeover',
        title: '人工接管',
        description: `接管咨询师：${t.takeoverCounselorName}，原因：${t.reason}`,
        timestamp: new Date(t.takenOverAt),
        actorId: t.takeoverCounselorId,
        relatedId: t.id,
        relatedType: 'takeover',
      });
    });

    return timeline.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  private findActiveCrisisCase(studentId: string): ICrisisCase | undefined {
    for (const crisisCase of this.crisisCases.values()) {
      if (
        crisisCase.studentId === studentId &&
        !crisisCase.isTrackingClosed &&
        crisisCase.status !== CrisisStatus.RESOLVED
      ) {
        return crisisCase;
      }
    }
    return undefined;
  }

  private associateStudentCrisisCase(studentId: string, crisisCaseId: string) {
  }

  private getAssessmentsForCrisis(crisisCaseId: string): IRiskAssessment[] {
    const crisisCase = this.crisisCases.get(crisisCaseId);
    if (!crisisCase) return [];

    const result: IRiskAssessment[] = [];
    for (const assessments of this.highRiskAssessments.values()) {
      for (const assessment of assessments) {
        if (crisisCase.riskAssessmentIds.includes(assessment.id)) {
          result.push(assessment);
        }
      }
    }
    return result.sort(
      (a, b) =>
        new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime(),
    );
  }

  private getAppointmentsForCrisis(crisisCaseId: string): IAppointment[] {
    const crisisCase = this.crisisCases.get(crisisCaseId);
    if (!crisisCase) return [];

    const result: IAppointment[] = [];
    for (const appointment of this.appointments.values()) {
      if (crisisCase.appointmentIds.includes(appointment.id)) {
        result.push(appointment);
      }
    }
    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  private getReferralsForCrisis(crisisCaseId: string): IReferralRecord[] {
    const result: IReferralRecord[] = [];
    for (const referral of this.referrals.values()) {
      if (referral.crisisCaseId === crisisCaseId) {
        result.push(referral);
      }
    }
    return result.sort(
      (a, b) =>
        new Date(b.referralDate).getTime() - new Date(a.referralDate).getTime(),
    );
  }

  private getDailyTrackings(crisisCaseId: string): IDailyTrackingRecord[] {
    return this.dailyTrackings.get(crisisCaseId) || [];
  }

  private getFollowUps(crisisCaseId: string): IFollowUp[] {
    return this.followUps.get(crisisCaseId) || [];
  }

  private getTakeoverRecords(crisisCaseId: string): ITakeoverRecord[] {
    const result: ITakeoverRecord[] = [];
    for (const record of this.takeoverRecords.values()) {
      if (record.crisisCaseId === crisisCaseId) {
        result.push(record);
      }
    }
    return result;
  }

  private getDailyTrackingSummary(crisisCaseId: string) {
    const trackings = this.dailyTrackings.get(crisisCaseId) || [];
    const latest = trackings.length > 0 ? trackings[0] : null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastTrackingDate = latest ? new Date(latest.trackingDate) : null;
    const isTodayTracked =
      lastTrackingDate && lastTrackingDate >= today ? true : false;

    let consecutiveStableDays = 0;
    for (const tracking of trackings) {
      if (tracking.isStable) {
        consecutiveStableDays++;
      } else {
        break;
      }
    }

    return {
      crisisCaseId,
      studentId: '',
      studentName: '',
      totalTrackingDays: trackings.length,
      lastTrackingDate: lastTrackingDate || undefined,
      nextTrackingDate: isTodayTracked
        ? new Date(today.getTime() + 24 * 60 * 60 * 1000)
        : today,
      consecutiveStableDays,
      needsAttention: !isTodayTracked,
      pendingTrackings: isTodayTracked ? 0 : 1,
      latestTracking: latest || undefined,
    };
  }

  private addTrackingNote(
    crisisCaseId: string,
    note: Omit<ICrisisTimeline, 'id' | 'crisisCaseId'>,
  ) {
    const timeline: ICrisisTimeline = {
      ...note,
      id: this.generateId(),
      crisisCaseId,
    };
  }

  private getStudentName(studentId: string): string {
    return `学生${studentId}`;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  registerAssessment(assessment: IRiskAssessment) {
    const studentAssessments =
      this.highRiskAssessments.get(assessment.studentId) || [];
    studentAssessments.unshift(assessment);
    this.highRiskAssessments.set(assessment.studentId, studentAssessments);

    if (assessment.isHighRisk || assessment.riskLevel === RiskLevel.HIGH || assessment.riskLevel === RiskLevel.CRITICAL) {
      this.detectMultipleHighRisk({
        studentId: assessment.studentId,
      }).then((result) => {
        if (result.shouldEscalate && !result.existingCrisisCaseId) {
          console.log(`学生 ${assessment.studentId} 触发高危预警: ${result.escalationReason}`);
        }
      });
    }
  }

  registerAppointment(appointment: IAppointment) {
    this.appointments.set(appointment.id, appointment);
  }

  registerReferral(referral: IReferralRecord) {
    this.referrals.set(referral.id, referral);
    if (referral.crisisCaseId) {
      const crisisCase = this.crisisCases.get(referral.crisisCaseId);
      if (crisisCase && !crisisCase.referralIds.includes(referral.id)) {
        crisisCase.referralIds.push(referral.id);
      }
    }
  }

  registerTakeover(takeover: ITakeoverRecord) {
    this.takeoverRecords.set(takeover.id, takeover);
    if (takeover.crisisCaseId) {
      const crisisCase = this.crisisCases.get(takeover.crisisCaseId);
      if (crisisCase) {
        crisisCase.isManualTakeover = true;
        crisisCase.takeoverCounselorId = takeover.takeoverCounselorId;
        crisisCase.takeoverReason = takeover.reason;
        crisisCase.takeoverAt = takeover.takenOverAt;
      }
    }
  }

  registerDailyTracking(record: IDailyTrackingRecord) {
    const trackings = this.dailyTrackings.get(record.crisisCaseId) || [];
    trackings.unshift(record);
    this.dailyTrackings.set(record.crisisCaseId, trackings);

    const crisisCase = this.crisisCases.get(record.crisisCaseId);
    if (crisisCase) {
      crisisCase.trackingCount++;
      crisisCase.lastTrackingDate = record.trackingDate;
    }
  }

  registerFollowUp(followUp: IFollowUp) {
    const followUps = this.followUps.get(followUp.crisisCaseId) || [];
    followUps.push(followUp);
    this.followUps.set(followUp.crisisCaseId, followUps);
  }
}
