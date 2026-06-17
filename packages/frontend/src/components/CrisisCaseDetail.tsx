import React from 'react';
import {
  RiskLevel,
  CrisisStatus,
  TakeoverReason,
} from '@shared/enums';
import {
  ICrisisCase,
  IRiskAssessment,
  IAppointment,
  IReferralRecord,
  ITakeoverRecord,
  IDailyTrackingRecord,
  IFollowUp,
  ICrisisTimeline,
} from '@shared/interfaces';

interface CrisisCaseDetailProps {
  crisisCase: ICrisisCase;
  assessments: IRiskAssessment[];
  appointments: IAppointment[];
  referrals: IReferralRecord[];
  trackingRecords: IDailyTrackingRecord[];
  followUps: IFollowUp[];
  takeoverRecords: ITakeoverRecord[];
  timeline: ICrisisTimeline[];
  dailyTrackingSummary?: any;
}

export const CrisisCaseDetail: React.FC<CrisisCaseDetailProps> = ({
  crisisCase,
  assessments,
  appointments,
  referrals,
  trackingRecords,
  followUps,
  takeoverRecords,
  timeline,
  dailyTrackingSummary,
}) => {
  const activeTakeover = takeoverRecords.find((t) => t.isActive);

  return (
    <div className="crisis-case-detail">
      <CrisisCaseHeader
        crisisCase={crisisCase}
        activeTakeover={activeTakeover}
        dailyTrackingSummary={dailyTrackingSummary}
      />

      <div className="crisis-case-content">
        <div className="left-panel">
          <TakeoverInfo takeoverRecords={takeoverRecords} />
          <EscalationHistory assessments={assessments} />
          <DailyTrackingStatus summary={dailyTrackingSummary} />
        </div>

        <div className="right-panel">
          <CrisisTimeline timeline={timeline} />
        </div>
      </div>

      <div className="bottom-panel">
        <FollowUpProgress followUps={followUps} />
        <AppointmentHistory appointments={appointments} />
        <ReferralHistory referrals={referrals} />
      </div>
    </div>
  );
};

const CrisisCaseHeader: React.FC<{
  crisisCase: ICrisisCase;
  activeTakeover?: ITakeoverRecord;
  dailyTrackingSummary?: any;
}> = ({ crisisCase, activeTakeover, dailyTrackingSummary }) => {
  const severityConfig = {
    [RiskLevel.LOW]: { color: 'green', label: '低风险' },
    [RiskLevel.MEDIUM]: { color: 'yellow', label: '中风险' },
    [RiskLevel.HIGH]: { color: 'orange', label: '高风险' },
    [RiskLevel.CRITICAL]: { color: 'red', label: '极高风险' },
  };

  const statusConfig: Record<CrisisStatus, { color: string; label: string }> = {
    [CrisisStatus.IDENTIFIED]: { color: 'gray', label: '已识别' },
    [CrisisStatus.FIRST_REVIEW]: { color: 'blue', label: '一审中' },
    [CrisisStatus.SECOND_REVIEW]: { color: 'purple', label: '二审中' },
    [CrisisStatus.APPROVED]: { color: 'green', label: '已审批' },
    [CrisisStatus.REFERRED]: { color: 'orange', label: '已转介' },
    [CrisisStatus.TRACKING]: { color: 'blue', label: '追踪中' },
    [CrisisStatus.RESOLVED]: { color: 'green', label: '已解决' },
    [CrisisStatus.REJECTED]: { color: 'red', label: '已驳回' },
    [CrisisStatus.MANUAL_TAKEOVER]: { color: 'red', label: '人工接管' },
  };

  const sevConfig = severityConfig[crisisCase.severity as RiskLevel] || severityConfig[RiskLevel.LOW];
  const statConfig = statusConfig[crisisCase.status as CrisisStatus] || statusConfig[CrisisStatus.IDENTIFIED];

  return (
    <div className="crisis-case-header">
      <div className="header-left">
        <h1 className="case-title">{crisisCase.title}</h1>
        <div className="case-meta">
          <span className={`severity-badge ${sevConfig.color}`}>
            {sevConfig.label}
          </span>
          <span className={`status-badge ${statConfig.color}`}>
            {statConfig.label}
          </span>
          {crisisCase.isManualTakeover && (
            <span className="takeover-badge">
              已人工接管
            </span>
          )}
        </div>
        <p className="case-description">{crisisCase.description}</p>
      </div>

      <div className="header-right">
        <div className="info-card">
          <div className="info-row">
            <span className="label">来源</span>
            <span className="value">{crisisCase.source}</span>
          </div>
          <div className="info-row">
            <span className="label">上报时间</span>
            <span className="value">
              {new Date(crisisCase.reportedAt).toLocaleString()}
            </span>
          </div>
          <div className="info-row">
            <span className="label">追踪次数</span>
            <span className="value">{crisisCase.trackingCount} 次</span>
          </div>
        </div>

        {activeTakeover && (
          <div className="takeover-card">
            <div className="takeover-title">当前接管</div>
            <div className="takeover-counselor">
              {activeTakeover.takeoverCounselorName}
            </div>
            <div className="takeover-reason">
              原因：{getTakeoverReasonText(activeTakeover.reason as TakeoverReason)}
            </div>
            <div className="takeover-time">
              接管时间：{new Date(activeTakeover.takenOverAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TakeoverInfo: React.FC<{
  takeoverRecords: ITakeoverRecord[];
}> = ({ takeoverRecords }) => {
  if (takeoverRecords.length === 0) {
    return (
      <div className="section-card">
        <h3 className="section-title">接管记录</h3>
        <div className="empty-state">暂无接管记录</div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <h3 className="section-title">接管记录</h3>
      <div className="takeover-list">
        {takeoverRecords.map((record) => (
          <div
            key={record.id}
            className={`takeover-item ${record.isActive ? 'active' : ''}`}
          >
            <div className="takeover-header">
              <span className="takeover-counselor">
                {record.takeoverCounselorName}
              </span>
              <span className={`takeover-status ${record.isActive ? 'active' : 'released'}`}>
                {record.isActive ? '接管中' : '已释放'}
              </span>
            </div>
            <div className="takeover-detail">
              <span>原因：</span>
              <span>{getTakeoverReasonText(record.reason as TakeoverReason)}</span>
            </div>
            {record.reasonDescription && (
              <div className="takeover-detail">
                <span>说明：</span>
                <span>{record.reasonDescription}</span>
              </div>
            )}
            <div className="takeover-detail">
              <span>接管时间：</span>
              <span>{new Date(record.takenOverAt).toLocaleString()}</span>
            </div>
            {record.originalCounselorName && (
              <div className="takeover-detail">
                <span>原咨询师：</span>
                <span>{record.originalCounselorName}</span>
              </div>
            )}
            {!record.isActive && (
              <>
                <div className="takeover-detail">
                  <span>释放时间：</span>
                  <span>{record.releasedAt ? new Date(record.releasedAt).toLocaleString() : '-'}</span>
                </div>
                <div className="takeover-detail">
                  <span>释放原因：</span>
                  <span>{record.releaseReason || '-'}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const EscalationHistory: React.FC<{
  assessments: IRiskAssessment[];
}> = ({ assessments }) => {
  return (
    <div className="section-card">
      <h3 className="section-title">升级原因 / 风险评估</h3>
      {assessments.length === 0 ? (
        <div className="empty-state">暂无评估记录</div>
      ) : (
        <div className="assessment-list">
          {assessments.map((assessment, index) => (
            <div key={assessment.id} className="assessment-item">
              <div className="assessment-header">
                <span className="assessment-index">第 {index + 1} 次</span>
                <span className={`risk-level ${assessment.riskLevel}`}>
                  {getRiskLevelText(assessment.riskLevel as RiskLevel)}
                </span>
              </div>
              <div className="assessment-scores">
                <div className="score-item">
                  <span className="score-label">总分</span>
                  <span className="score-value">{assessment.overallScore}</span>
                </div>
                <div className="score-item">
                  <span className="score-label">自伤</span>
                  <span className="score-value">{assessment.selfHarmScore}</span>
                </div>
                <div className="score-item">
                  <span className="score-label">自杀</span>
                  <span className="score-value">{assessment.suicideScore}</span>
                </div>
                <div className="score-item">
                  <span className="score-label">抑郁</span>
                  <span className="score-value">{assessment.depressionScore}</span>
                </div>
              </div>
              <div className="assessment-time">
                {new Date(assessment.assessmentDate).toLocaleString()}
              </div>
              {assessment.notes && (
                <div className="assessment-notes">{assessment.notes}</div>
              )}
              {assessment.triggeredCrisis && (
                <div className="assessment-trigger">⚡ 触发危机预警</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DailyTrackingStatus: React.FC<{
  summary?: any;
}> = ({ summary }) => {
  if (!summary) {
    return (
      <div className="section-card">
        <h3 className="section-title">每日追踪</h3>
        <div className="empty-state">暂无追踪数据</div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <h3 className="section-title">每日追踪</h3>
      <div className="tracking-status">
        <div className="tracking-item">
          <span className="tracking-label">累计追踪</span>
          <span className="tracking-value">{summary.totalTrackingDays} 天</span>
        </div>
        <div className="tracking-item">
          <span className="tracking-label">连续稳定</span>
          <span className="tracking-value">{summary.consecutiveStableDays} 天</span>
        </div>
        <div className="tracking-item">
          <span className="tracking-label">上次追踪</span>
          <span className="tracking-value">
            {summary.lastTrackingDate
              ? new Date(summary.lastTrackingDate).toLocaleDateString()
              : '未开始'}
          </span>
        </div>
        <div className="tracking-item">
          <span className="tracking-label">下次追踪</span>
          <span className="tracking-value">
            {summary.nextTrackingDate
              ? new Date(summary.nextTrackingDate).toLocaleDateString()
              : '-'}
          </span>
        </div>
        <div className={`tracking-status-badge ${summary.needsAttention ? 'attention' : 'normal'}`}>
          {summary.needsAttention ? '⚠ 需要关注' : '✓ 状态正常'}
        </div>
        {summary.pendingTrackings > 0 && (
          <div className="pending-badge">
            {summary.pendingTrackings} 条待处理
          </div>
        )}
      </div>
    </div>
  );
};

const CrisisTimeline: React.FC<{
  timeline: ICrisisTimeline[];
}> = ({ timeline }) => {
  const typeConfig: Record<string, { icon: string; color: string; label: string }> = {
    assessment: { icon: '📊', color: 'blue', label: '评估' },
    appointment: { icon: '📅', color: 'green', label: '预约' },
    referral: { icon: '🔄', color: 'orange', label: '转介' },
    tracking: { icon: '📝', color: 'purple', label: '追踪' },
    takeover: { icon: '🤝', color: 'red', label: '接管' },
    status_change: { icon: '🔔', color: 'gray', label: '状态变更' },
    note: { icon: '📌', color: 'yellow', label: '备注' },
  };

  return (
    <div className="section-card">
      <h3 className="section-title">事件时间线</h3>
      {timeline.length === 0 ? (
        <div className="empty-state">暂无时间线记录</div>
      ) : (
        <div className="timeline">
          {timeline.map((item) => {
            const config = typeConfig[item.type] || typeConfig.note;
            return (
              <div key={item.id} className="timeline-item">
                <div className={`timeline-dot ${config.color}`}>
                  {config.icon}
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-type">{config.label}</span>
                    <span className="timeline-time">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="timeline-title">{item.title}</div>
                  <div className="timeline-description">{item.description}</div>
                  {item.actorName && (
                    <div className="timeline-actor">操作人：{item.actorName}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const FollowUpProgress: React.FC<{
  followUps: IFollowUp[];
}> = ({ followUps }) => {
  const total = followUps.length;
  const completed = followUps.filter(
    (f) => f.status === 'completed' || f.status === 'skipped',
  ).length;
  const pending = total - completed;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const overdue = followUps.filter((f) => {
    if (f.status === 'completed' || f.status === 'skipped') return false;
    return new Date(f.scheduledDate) < new Date();
  }).length;

  return (
    <div className="section-card">
      <h3 className="section-title">
        回访进度
        <span className="progress-summary">
          {completed}/{total} 已完成
          {overdue > 0 && <span className="overdue-badge">{overdue} 个逾期</span>}
        </span>
      </h3>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {followUps.length === 0 ? (
        <div className="empty-state">暂无回访计划</div>
      ) : (
        <div className="followup-list">
          {followUps.map((followUp) => {
            const isOverdue =
              (followUp.status !== 'completed' && followUp.status !== 'skipped') &&
              new Date(followUp.scheduledDate) < new Date();

            const statusConfig: Record<string, { label: string; color: string }> = {
              pending: { label: '待处理', color: 'gray' },
              in_progress: { label: '进行中', color: 'blue' },
              completed: { label: '已完成', color: 'green' },
              skipped: { label: '已跳过', color: 'gray' },
              overdue: { label: '已逾期', color: 'red' },
            };

            const status = isOverdue ? 'overdue' : followUp.status;
            const config = statusConfig[status] || statusConfig.pending;

            return (
              <div key={followUp.id} className="followup-item">
                <div className="followup-header">
                  <span className="followup-number">
                    第 {followUp.followUpNumber} 次回访
                  </span>
                  <span className={`followup-status ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <div className="followup-info">
                  <span className="followup-type">
                    {getFollowUpTypeText(followUp.type as any)}
                  </span>
                  <span className="followup-date">
                    {new Date(followUp.scheduledDate).toLocaleDateString()}
                    {followUp.scheduledTime && ` ${followUp.scheduledTime}`}
                  </span>
                </div>
                <div className="followup-assignee">
                  负责人：{followUp.assigneeName}
                </div>
                {followUp.isMandatory && (
                  <span className="mandatory-badge">强制回访</span>
                )}
                {followUp.result && (
                  <div className="followup-result">
                    结果：{followUp.result}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AppointmentHistory: React.FC<{
  appointments: IAppointment[];
}> = ({ appointments }) => {
  return (
    <div className="section-card">
      <h3 className="section-title">预约记录</h3>
      {appointments.length === 0 ? (
        <div className="empty-state">暂无预约记录</div>
      ) : (
        <div className="appointment-list">
          {appointments.map((apt) => (
            <div key={apt.id} className="appointment-item">
              <div className="appointment-date">
                {new Date(apt.date).toLocaleDateString()}
              </div>
              <div className="appointment-time">
                {apt.startTime} - {apt.endTime}
              </div>
              <div className="appointment-counselor">
                咨询师：{apt.counselorId}
              </div>
              <span className={`appointment-status ${apt.status}`}>
                {getAppointmentStatusText(apt.status as any)}
              </span>
              {apt.takenOver && (
                <span className="appointment-takenover">已接管</span>
              )}
              {apt.isNightDuty && (
                <span className="appointment-night">夜间咨询</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ReferralHistory: React.FC<{
  referrals: IReferralRecord[];
}> = ({ referrals }) => {
  return (
    <div className="section-card">
      <h3 className="section-title">转介记录</h3>
      {referrals.length === 0 ? (
        <div className="empty-state">暂无转介记录</div>
      ) : (
        <div className="referral-list">
          {referrals.map((referral) => (
            <div key={referral.id} className="referral-item">
              <div className="referral-header">
                <span className="referral-type">{referral.referralType}</span>
                <span className={`referral-status ${referral.isAccepted ? 'accepted' : 'pending'}`}>
                  {referral.isAccepted ? '已接受' : '待接受'}
                </span>
              </div>
              <div className="referral-detail">
                转介至：{referral.referredToName || referral.referredTo}
              </div>
              <div className="referral-detail">
                转介原因：{referral.referralReason}
              </div>
              <div className="referral-time">
                {new Date(referral.referralDate).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function getTakeoverReasonText(reason: TakeoverReason): string {
  const reasonMap: Record<TakeoverReason, string> = {
    [TakeoverReason.HIGH_RISK]: '高风险个案',
    [TakeoverReason.CRITICAL_RISK]: '极高风险个案',
    [TakeoverReason.STUDENT_REQUEST]: '学生申请',
    [TakeoverReason.COUNSELOR_REFERRAL]: '咨询师转介',
    [TakeoverReason.ADMIN_ASSIGN]: '管理员指派',
    [TakeoverReason.MULTIPLE_CRISIS]: '多次危机事件',
    [TakeoverReason.NIGHT_EMERGENCY]: '夜间紧急情况',
  };
  return reasonMap[reason] || reason;
}

function getRiskLevelText(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    [RiskLevel.LOW]: '低风险',
    [RiskLevel.MEDIUM]: '中风险',
    [RiskLevel.HIGH]: '高风险',
    [RiskLevel.CRITICAL]: '极高风险',
  };
  return map[level] || level;
}

function getFollowUpTypeText(type: string): string {
  const map: Record<string, string> = {
    phone: '电话回访',
    online: '线上回访',
    offline: '线下面谈',
    message: '消息回访',
  };
  return map[type] || type;
}

function getAppointmentStatusText(status: string): string {
  const map: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    waitlist: '等待列表',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    no_show: '未到',
    rescheduled: '已改约',
    transferred: '已转介',
    taken_over: '已接管',
  };
  return map[status] || status;
}
