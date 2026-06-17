import React, { useState } from 'react';
import { CrisisTrackingList } from './components/CrisisTrackingList';
import { CrisisCaseDetail } from './components/CrisisCaseDetail';
import { GroupCounselingPage } from './components/GroupCounselingPage';
import { DutySchedulePage } from './components/DutySchedulePage';
import {
  ICrisisCase,
  IRiskAssessment,
  IAppointment,
  IReferralRecord,
  IDailyTrackingRecord,
  IFollowUp,
  ITakeoverRecord,
  ICrisisTimeline,
  IGroupCounseling,
  IRoom,
  IDutySchedule,
} from '@shared/interfaces';
import {
  RiskLevel,
  CrisisStatus,
  TakeoverReason,
  FollowUpStatus,
  FollowUpType,
  TrackingRecordType,
  GroupCounselingStatus,
  RoomType,
  DutyShiftType,
  DutyStatus,
} from '@shared/enums';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('crisis-tracking');
  const [selectedCrisisCase, setSelectedCrisisCase] = useState<ICrisisCase | null>(null);

  const mockCrisisCases: ICrisisCase[] = [
    {
      id: 'crisis-001',
      studentId: 'stu-001',
      studentName: '张小明',
      title: '抑郁情绪高危评估',
      description: '学生连续两次提交SDS问卷，得分均在高危区间，伴有自伤意念',
      severity: RiskLevel.HIGH,
      status: CrisisStatus.TRACKING,
      source: 'questionnaire',
      reportedAt: new Date('2024-01-15T09:30:00'),
      assignedCounselorId: 'coun-001',
      assignedCounselorName: '李老师',
      mentorNotified: true,
      mentorId: 'mentor-001',
      mentorName: '王辅导员',
      isManualTakeover: true,
      takeoverCounselorId: 'coun-002',
      takeoverCounselorName: '赵主任',
      takeoverReason: TakeoverReason.HIGH_RISK,
      takeoverAt: new Date('2024-01-15T14:00:00'),
      lastTrackingDate: new Date('2024-01-16T10:00:00'),
      nextTrackingDate: new Date('2024-01-17T09:00:00'),
      trackingCount: 2,
      isTrackingClosed: false,
      riskAssessmentIds: ['assess-001', 'assess-002'],
      appointmentIds: ['apt-001', 'apt-002'],
      referralIds: [],
      createdAt: new Date('2024-01-15T09:30:00'),
      updatedAt: new Date('2024-01-16T10:00:00'),
    },
    {
      id: 'crisis-002',
      studentId: 'stu-002',
      studentName: '李小红',
      title: '焦虑情绪评估',
      description: '学生提交SAS问卷，得分较高，伴有睡眠困难',
      severity: RiskLevel.MEDIUM,
      status: CrisisStatus.FIRST_REVIEW,
      source: 'questionnaire',
      reportedAt: new Date('2024-01-16T08:00:00'),
      assignedCounselorId: 'coun-003',
      assignedCounselorName: '陈老师',
      mentorNotified: false,
      isManualTakeover: false,
      lastTrackingDate: undefined,
      nextTrackingDate: undefined,
      trackingCount: 0,
      isTrackingClosed: false,
      riskAssessmentIds: ['assess-003'],
      appointmentIds: ['apt-003'],
      referralIds: [],
      createdAt: new Date('2024-01-16T08:00:00'),
      updatedAt: new Date('2024-01-16T08:00:00'),
    },
    {
      id: 'crisis-003',
      studentId: 'stu-003',
      studentName: '王小强',
      title: '自伤行为紧急干预',
      description: '夜间值班期间学生报告有自伤行为，已紧急转介',
      severity: RiskLevel.CRITICAL,
      status: CrisisStatus.MANUAL_TAKEOVER,
      source: 'night_duty',
      reportedAt: new Date('2024-01-14T22:30:00'),
      assignedCounselorId: 'coun-004',
      assignedCounselorName: '孙老师',
      mentorNotified: true,
      mentorId: 'mentor-002',
      mentorName: '刘辅导员',
      isManualTakeover: true,
      takeoverCounselorId: 'coun-004',
      takeoverCounselorName: '孙老师',
      takeoverReason: TakeoverReason.NIGHT_EMERGENCY,
      takeoverAt: new Date('2024-01-14T22:45:00'),
      lastTrackingDate: new Date('2024-01-16T09:00:00'),
      nextTrackingDate: new Date('2024-01-17T09:00:00'),
      trackingCount: 3,
      isTrackingClosed: false,
      riskAssessmentIds: ['assess-004'],
      appointmentIds: ['apt-004'],
      referralIds: ['referral-001'],
      createdAt: new Date('2024-01-14T22:30:00'),
      updatedAt: new Date('2024-01-16T09:00:00'),
    },
  ];

  const mockAssessments: IRiskAssessment[] = [
    {
      id: 'assess-001',
      studentId: 'stu-001',
      assessmentDate: new Date('2024-01-14T10:00:00'),
      questionnaireType: 'SDS',
      overallScore: 65,
      depressionScore: 68,
      anxietyScore: 45,
      selfHarmScore: 3,
      suicideScore: 2,
      riskLevel: RiskLevel.HIGH,
      isHighRisk: true,
      triggeredCrisis: true,
      crisisCaseId: 'crisis-001',
      notes: '学生报告有持续的低落情绪，对未来感到无望',
    },
    {
      id: 'assess-002',
      studentId: 'stu-001',
      assessmentDate: new Date('2024-01-15T08:30:00'),
      questionnaireType: 'SDS',
      overallScore: 72,
      depressionScore: 75,
      anxietyScore: 50,
      selfHarmScore: 5,
      suicideScore: 4,
      riskLevel: RiskLevel.HIGH,
      isHighRisk: true,
      triggeredCrisis: true,
      crisisCaseId: 'crisis-001',
      notes: '24小时内第二次评估，得分进一步升高，有明确自伤计划',
    },
  ];

  const mockAppointments: IAppointment[] = [
    {
      id: 'apt-001',
      studentId: 'stu-001',
      studentName: '张小明',
      counselorId: 'coun-001',
      counselorName: '李老师',
      date: new Date('2024-01-15'),
      startTime: '14:00',
      endTime: '15:00',
      status: 'completed',
      type: 'individual',
      isNightDuty: false,
      isGroup: false,
      takenOver: false,
      studentCannotCancel: false,
      createdAt: new Date('2024-01-14T10:00:00'),
    },
    {
      id: 'apt-002',
      studentId: 'stu-001',
      studentName: '张小明',
      counselorId: 'coun-002',
      counselorName: '赵主任',
      date: new Date('2024-01-17'),
      startTime: '09:00',
      endTime: '10:00',
      status: 'confirmed',
      type: 'individual',
      isNightDuty: false,
      isGroup: false,
      takenOver: true,
      takeoverCounselorId: 'coun-002',
      takeoverCounselorName: '赵主任',
      takeoverReason: TakeoverReason.HIGH_RISK,
      takeoverAt: new Date('2024-01-15T14:00:00'),
      studentCannotCancel: true,
      createdAt: new Date('2024-01-15T14:00:00'),
    },
  ];

  const mockReferrals: IReferralRecord[] = [
    {
      id: 'referral-001',
      crisisCaseId: 'crisis-003',
      referralType: 'external_hospital',
      referredFrom: 'coun-004',
      referredFromName: '孙老师',
      referredTo: 'hospital-001',
      referredToName: '市精神卫生中心',
      referralReason: '学生有明确自伤行为，需要专业医疗干预',
      referralDate: new Date('2024-01-15T08:00:00'),
      isAccepted: true,
      acceptedAt: new Date('2024-01-15T10:00:00'),
      notes: '已联系家长，陪同前往医院',
    },
  ];

  const mockTrackingRecords: IDailyTrackingRecord[] = [
    {
      id: 'track-001',
      crisisCaseId: 'crisis-001',
      studentId: 'stu-001',
      studentName: '张小明',
      trackerId: 'coun-002',
      trackerName: '赵主任',
      trackingDate: new Date('2024-01-16T10:00:00'),
      status: 'tracked',
      recordType: TrackingRecordType.DAILY_CHECK,
      content: '学生今日情绪稳定，睡眠尚可，已预约明天咨询',
      moodLevel: 3,
      sleepStatus: 'fair',
      appetiteStatus: 'fair',
      isStable: true,
      needsFollowUp: true,
      nextAction: '继续每日追踪，观察情绪变化',
      createdAt: new Date('2024-01-16T10:00:00'),
    },
    {
      id: 'track-002',
      crisisCaseId: 'crisis-001',
      studentId: 'stu-001',
      studentName: '张小明',
      trackerId: 'coun-002',
      trackerName: '赵主任',
      trackingDate: new Date('2024-01-15T16:00:00'),
      status: 'tracked',
      recordType: TrackingRecordType.DAILY_CHECK,
      content: '首次介入，学生情绪较低落，建立信任关系',
      moodLevel: 2,
      sleepStatus: 'poor',
      appetiteStatus: 'poor',
      isStable: false,
      needsFollowUp: true,
      nextAction: '24小时内再次追踪，评估安全程度',
      createdAt: new Date('2024-01-15T16:00:00'),
    },
  ];

  const mockFollowUps: IFollowUp[] = [
    {
      id: 'fu-001',
      crisisCaseId: 'crisis-001',
      studentId: 'stu-001',
      studentName: '张小明',
      assigneeId: 'coun-002',
      assigneeName: '赵主任',
      type: FollowUpType.PHONE,
      status: FollowUpStatus.COMPLETED,
      scheduledDate: new Date('2024-01-16T14:00:00'),
      scheduledTime: '14:00',
      followUpNumber: 1,
      isMandatory: true,
      result: '学生接听电话，情绪尚可，同意明天来咨询',
      completedAt: new Date('2024-01-16T14:15:00'),
      createdAt: new Date('2024-01-15T16:00:00'),
      updatedAt: new Date('2024-01-16T14:15:00'),
    },
    {
      id: 'fu-002',
      crisisCaseId: 'crisis-001',
      studentId: 'stu-001',
      studentName: '张小明',
      assigneeId: 'coun-002',
      assigneeName: '赵主任',
      type: FollowUpType.OFFLINE,
      status: FollowUpStatus.PENDING,
      scheduledDate: new Date('2024-01-17T09:00:00'),
      scheduledTime: '09:00',
      followUpNumber: 2,
      isMandatory: true,
      notes: '面询，深度评估自杀风险',
      createdAt: new Date('2024-01-15T16:00:00'),
      updatedAt: new Date('2024-01-15T16:00:00'),
    },
    {
      id: 'fu-003',
      crisisCaseId: 'crisis-001',
      studentId: 'stu-001',
      studentName: '张小明',
      assigneeId: 'coun-002',
      assigneeName: '赵主任',
      type: FollowUpType.PHONE,
      status: FollowUpStatus.PENDING,
      scheduledDate: new Date('2024-01-18T14:00:00'),
      scheduledTime: '14:00',
      followUpNumber: 3,
      isMandatory: false,
      createdAt: new Date('2024-01-15T16:00:00'),
      updatedAt: new Date('2024-01-15T16:00:00'),
    },
    {
      id: 'fu-004',
      crisisCaseId: 'crisis-001',
      studentId: 'stu-001',
      studentName: '张小明',
      assigneeId: 'mentor-001',
      assigneeName: '王辅导员',
      type: FollowUpType.MESSAGE,
      status: FollowUpStatus.OVERDUE,
      scheduledDate: new Date('2024-01-15T18:00:00'),
      scheduledTime: '18:00',
      followUpNumber: 1,
      isMandatory: true,
      notes: '辅导员跟进学生日常生活情况',
      createdAt: new Date('2024-01-15T16:00:00'),
      updatedAt: new Date('2024-01-15T16:00:00'),
    },
  ];

  const mockTakeoverRecords: ITakeoverRecord[] = [
    {
      id: 'take-001',
      crisisCaseId: 'crisis-001',
      appointmentId: 'apt-002',
      studentId: 'stu-001',
      originalCounselorId: 'coun-001',
      originalCounselorName: '李老师',
      takeoverCounselorId: 'coun-002',
      takeoverCounselorName: '赵主任',
      reason: TakeoverReason.HIGH_RISK,
      reasonDescription: '学生24小时内两次高危评估，需要资深咨询师介入',
      isActive: true,
      takenOverAt: new Date('2024-01-15T14:00:00'),
      createdAt: new Date('2024-01-15T14:00:00'),
    },
  ];

  const mockTimeline: ICrisisTimeline[] = [
    {
      id: 'tl-001',
      crisisCaseId: 'crisis-001',
      type: 'assessment',
      title: '第一次高危评估',
      description: 'SDS问卷得分65分，抑郁情绪严重',
      timestamp: new Date('2024-01-14T10:00:00'),
      actorId: 'stu-001',
      actorName: '张小明',
    },
    {
      id: 'tl-002',
      crisisCaseId: 'crisis-001',
      type: 'status_change',
      title: '危机预警触发',
      description: '系统检测到高危评估，自动创建危机个案',
      timestamp: new Date('2024-01-14T10:05:00'),
      actorId: 'system',
      actorName: '系统',
    },
    {
      id: 'tl-003',
      crisisCaseId: 'crisis-001',
      type: 'appointment',
      title: '预约咨询',
      description: '学生预约1月15日下午2点咨询',
      timestamp: new Date('2024-01-14T11:00:00'),
      actorId: 'stu-001',
      actorName: '张小明',
    },
    {
      id: 'tl-004',
      crisisCaseId: 'crisis-001',
      type: 'assessment',
      title: '第二次高危评估',
      description: '24小时内第二次评估，得分升高至72分，自伤意念增强',
      timestamp: new Date('2024-01-15T08:30:00'),
      actorId: 'stu-001',
      actorName: '张小明',
    },
    {
      id: 'tl-005',
      crisisCaseId: 'crisis-001',
      type: 'takeover',
      title: '人工接管',
      description: '赵主任接管个案，原因：高风险个案',
      timestamp: new Date('2024-01-15T14:00:00'),
      actorId: 'coun-002',
      actorName: '赵主任',
    },
    {
      id: 'tl-006',
      crisisCaseId: 'crisis-001',
      type: 'tracking',
      title: '首次追踪',
      description: '首次介入，学生情绪较低落，建立信任关系',
      timestamp: new Date('2024-01-15T16:00:00'),
      actorId: 'coun-002',
      actorName: '赵主任',
    },
    {
      id: 'tl-007',
      crisisCaseId: 'crisis-001',
      type: 'note',
      title: '辅导员通知',
      description: '已通知辅导员王老师，关注学生日常表现',
      timestamp: new Date('2024-01-15T16:30:00'),
      actorId: 'coun-002',
      actorName: '赵主任',
    },
    {
      id: 'tl-008',
      crisisCaseId: 'crisis-001',
      type: 'tracking',
      title: '第二次追踪',
      description: '学生今日情绪稳定，睡眠尚可',
      timestamp: new Date('2024-01-16T10:00:00'),
      actorId: 'coun-002',
      actorName: '赵主任',
    },
  ];

  const mockGroups: IGroupCounseling[] = [
    {
      id: 'group-001',
      title: '情绪管理成长小组',
      description: '帮助学生识别和管理情绪，提升情绪调节能力',
      theme: '情绪管理',
      leaderId: 'coun-001',
      leaderName: '李老师',
      coLeaderId: 'coun-003',
      coLeaderName: '陈老师',
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-03-20'),
      startTime: '19:00',
      endTime: '20:30',
      sessionCount: 10,
      duration: 90,
      maxMembers: 12,
      currentMembers: 8,
      status: GroupCounselingStatus.IN_PROGRESS,
      roomId: 'room-001',
      roomName: '团体辅导室A',
      isConfidentialRoom: true,
      weekday: 4,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-10'),
    },
    {
      id: 'group-002',
      title: '人际关系成长团体',
      description: '探索人际互动模式，提升人际交往能力',
      theme: '人际关系',
      leaderId: 'coun-002',
      leaderName: '赵主任',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-04-30'),
      startTime: '15:00',
      endTime: '16:30',
      sessionCount: 12,
      duration: 90,
      maxMembers: 15,
      currentMembers: 5,
      status: GroupCounselingStatus.REGISTRATION,
      roomId: 'room-002',
      roomName: '团体辅导室B',
      isConfidentialRoom: false,
      weekday: 2,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  ];

  const mockRooms: IRoom[] = [
    {
      id: 'room-001',
      name: '团体辅导室A',
      type: RoomType.GROUP,
      capacity: 15,
      building: '心理中心',
      floor: '2楼',
      isConfidential: true,
      equipments: ['沙盘', '音乐放松椅'],
    },
    {
      id: 'room-002',
      name: '团体辅导室B',
      type: RoomType.GROUP,
      capacity: 20,
      building: '心理中心',
      floor: '2楼',
      isConfidential: false,
      equipments: ['投影仪', '白板'],
    },
    {
      id: 'room-003',
      name: '个体咨询室1',
      type: RoomType.INDIVIDUAL,
      capacity: 2,
      building: '心理中心',
      floor: '1楼',
      isConfidential: true,
      equipments: ['沙盘', '放松椅'],
    },
    {
      id: 'room-004',
      name: '个体咨询室2',
      type: RoomType.INDIVIDUAL,
      capacity: 2,
      building: '心理中心',
      floor: '1楼',
      isConfidential: true,
      equipments: ['生物反馈仪'],
    },
  ];

  const mockDutySchedules: IDutySchedule[] = [
    {
      id: 'duty-001',
      date: new Date(),
      shiftType: DutyShiftType.MORNING,
      startTime: '08:00',
      endTime: '12:00',
      counselorId: 'coun-001',
      counselorName: '李老师',
      counselorTitle: '二级心理咨询师',
      status: DutyStatus.IN_PROGRESS,
      isNightDuty: false,
      createdAt: new Date(),
    },
    {
      id: 'duty-002',
      date: new Date(),
      shiftType: DutyShiftType.AFTERNOON,
      startTime: '14:00',
      endTime: '18:00',
      counselorId: 'coun-003',
      counselorName: '陈老师',
      counselorTitle: '三级心理咨询师',
      status: DutyStatus.SCHEDULED,
      isNightDuty: false,
      createdAt: new Date(),
    },
    {
      id: 'duty-003',
      date: new Date(),
      shiftType: DutyShiftType.NIGHT,
      startTime: '18:00',
      endTime: '22:00',
      counselorId: 'coun-004',
      counselorName: '孙老师',
      counselorTitle: '二级心理咨询师',
      status: DutyStatus.SCHEDULED,
      isNightDuty: true,
      notes: '夜间值班，处理紧急个案',
      createdAt: new Date(),
    },
    {
      id: 'duty-004',
      date: new Date(Date.now() + 86400000),
      shiftType: DutyShiftType.MORNING,
      startTime: '08:00',
      endTime: '12:00',
      counselorId: 'coun-002',
      counselorName: '赵主任',
      counselorTitle: '一级心理咨询师',
      status: DutyStatus.SCHEDULED,
      isNightDuty: false,
      createdAt: new Date(),
    },
    {
      id: 'duty-005',
      date: new Date(Date.now() + 86400000),
      shiftType: DutyShiftType.NIGHT,
      startTime: '19:00',
      endTime: '23:00',
      counselorId: 'coun-005',
      counselorName: '周老师',
      counselorTitle: '二级心理咨询师',
      status: DutyStatus.SCHEDULED,
      isNightDuty: true,
      createdAt: new Date(),
    },
  ];

  const handleSelectCase = (crisisCase: ICrisisCase) => {
    setSelectedCrisisCase(crisisCase);
    setActiveTab('crisis-detail');
  };

  const renderContent = () => {
    if (activeTab === 'crisis-tracking') {
      return (
        <CrisisTrackingList
          crisisCases={mockCrisisCases}
          onSelectCase={handleSelectCase}
        />
      );
    }

    if (activeTab === 'crisis-detail' && selectedCrisisCase) {
      return (
        <div className="detail-page">
          <button
            className="back-button"
            onClick={() => {
              setActiveTab('crisis-tracking');
              setSelectedCrisisCase(null);
            }}
          >
            ← 返回列表
          </button>
          <CrisisCaseDetail
            crisisCase={selectedCrisisCase}
            assessments={mockAssessments.filter(
              (a) => a.crisisCaseId === selectedCrisisCase.id,
            )}
            appointments={mockAppointments.filter(
              (a) => a.studentId === selectedCrisisCase.studentId,
            )}
            referrals={mockReferrals.filter(
              (r) => r.crisisCaseId === selectedCrisisCase.id,
            )}
            trackingRecords={mockTrackingRecords.filter(
              (t) => t.crisisCaseId === selectedCrisisCase.id,
            )}
            followUps={mockFollowUps.filter(
              (f) => f.crisisCaseId === selectedCrisisCase.id,
            )}
            takeoverRecords={mockTakeoverRecords.filter(
              (t) => t.crisisCaseId === selectedCrisisCase.id,
            )}
            timeline={mockTimeline.filter(
              (t) => t.crisisCaseId === selectedCrisisCase.id,
            )}
            dailyTrackingSummary={{
              totalTrackingDays: 2,
              lastTrackingDate: new Date('2024-01-16T10:00:00'),
              nextTrackingDate: new Date('2024-01-17T09:00:00'),
              consecutiveStableDays: 1,
              needsAttention: true,
              pendingTrackings: 1,
            }}
          />
        </div>
      );
    }

    if (activeTab === 'group-counseling') {
      return (
        <GroupCounselingPage
          groupCounselings={mockGroups}
          rooms={mockRooms}
          onSelectGroup={() => {}}
        />
      );
    }

    if (activeTab === 'duty-schedule') {
      return <DutySchedulePage dutySchedules={mockDutySchedules} />;
    }

    return null;
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="app-title">心理咨询中心</h2>
          <p className="app-subtitle">管理系统 v2.0</p>
        </div>
        <nav className="nav-menu">
          <NavItem
            icon="📊"
            label="高危追踪"
            active={activeTab === 'crisis-tracking' || activeTab === 'crisis-detail'}
            onClick={() => {
              setActiveTab('crisis-tracking');
              setSelectedCrisisCase(null);
            }}
          />
          <NavItem
            icon="🌙"
            label="夜间值班"
            active={activeTab === 'duty-schedule'}
            onClick={() => setActiveTab('duty-schedule')}
          />
          <NavItem
            icon="👥"
            label="团体咨询"
            active={activeTab === 'group-counseling'}
            onClick={() => setActiveTab('group-counseling')}
          />
          <NavItem
            icon="📅"
            label="预约管理"
            active={activeTab === 'appointments'}
            onClick={() => setActiveTab('appointments')}
          />
          <NavItem
            icon="👤"
            label="学生管理"
            active={activeTab === 'students'}
            onClick={() => setActiveTab('students')}
          />
          <NavItem
            icon="⚙️"
            label="系统设置"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </nav>
      </aside>

      <main className="main-content">{renderContent()}</main>
    </div>
  );
};

const NavItem: React.FC<{
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => {
  return (
    <button
      className={`nav-item ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </button>
  );
};

export default App;
