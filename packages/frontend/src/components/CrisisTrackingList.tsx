import React, { useState } from 'react';
import {
  CrisisStatus,
  RiskLevel,
  TrackingRecordType,
} from '@shared/enums';
import {
  ICrisisCase,
  IRiskAssessment,
} from '@shared/interfaces';

interface CrisisTrackingListProps {
  crisisCases: ICrisisCase[];
  onSelectCase: (crisisCase: ICrisisCase) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export const CrisisTrackingList: React.FC<CrisisTrackingListProps> = ({
  crisisCases,
  onSelectCase,
  onRefresh,
  loading = false,
}) => {
  const [statusFilter, setStatusFilter] = useState<CrisisStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<RiskLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  const filteredCases = crisisCases.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (severityFilter !== 'all' && c.severity !== severityFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = c.title?.toLowerCase().includes(query);
      const matchStudent = c.studentName?.toLowerCase().includes(query);
      const matchDesc = c.description?.toLowerCase().includes(query);
      if (!matchTitle && !matchStudent && !matchDesc) return false;
    }
    if (showOnlyPending && c.isTrackingClosed) return false;
    return true;
  });

  const stats = {
    total: crisisCases.length,
    tracking: crisisCases.filter((c) => c.status === CrisisStatus.TRACKING).length,
    highRisk: crisisCases.filter(
      (c) =>
        c.severity === RiskLevel.HIGH || c.severity === RiskLevel.CRITICAL,
    ).length,
    manualTakeover: crisisCases.filter((c) => c.isManualTakeover).length,
    pendingTracking: crisisCases.filter((c) => {
      if (c.isTrackingClosed) return false;
      if (!c.lastTrackingDate) return true;
      const last = new Date(c.lastTrackingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return last < today;
    }).length,
  };

  return (
    <div className="crisis-tracking-list">
      <div className="page-header">
        <h1 className="page-title">高危个案追踪</h1>
        <div className="page-actions">
          <button className="btn btn-primary">新建个案</button>
          {onRefresh && (
            <button className="btn btn-secondary" onClick={onRefresh}>
              刷新
            </button>
          )}
        </div>
      </div>

      <div className="stats-cards">
        <StatCard
          label="总个案数"
          value={stats.total}
          color="blue"
          icon="📋"
        />
        <StatCard
          label="追踪中"
          value={stats.tracking}
          color="green"
          icon="🔄"
        />
        <StatCard
          label="高/极高风险"
          value={stats.highRisk}
          color="red"
          icon="⚠️"
        />
        <StatCard
          label="人工接管"
          value={stats.manualTakeover}
          color="orange"
          icon="🤝"
        />
        <StatCard
          label="待追踪"
          value={stats.pendingTracking}
          color="purple"
          icon="📅"
          highlight={stats.pendingTracking > 0}
        />
      </div>

      <div className="filter-bar">
        <div className="filter-left">
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索个案标题、学生姓名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">全部状态</option>
            <option value={CrisisStatus.IDENTIFIED}>已识别</option>
            <option value={CrisisStatus.FIRST_REVIEW}>一审中</option>
            <option value={CrisisStatus.SECOND_REVIEW}>二审中</option>
            <option value={CrisisStatus.APPROVED}>已审批</option>
            <option value={CrisisStatus.TRACKING}>追踪中</option>
            <option value={CrisisStatus.REFERRED}>已转介</option>
            <option value={CrisisStatus.MANUAL_TAKEOVER}>人工接管</option>
            <option value={CrisisStatus.RESOLVED}>已解决</option>
          </select>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
          >
            <option value="all">全部等级</option>
            <option value={RiskLevel.LOW}>低风险</option>
            <option value={RiskLevel.MEDIUM}>中风险</option>
            <option value={RiskLevel.HIGH}>高风险</option>
            <option value={RiskLevel.CRITICAL}>极高风险</option>
          </select>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showOnlyPending}
              onChange={(e) => setShowOnlyPending(e.target.checked)}
            />
            仅显示待追踪
          </label>
        </div>
        <div className="filter-right">
          <span className="result-count">共 {filteredCases.length} 条</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">加载中...</div>
      ) : filteredCases.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>暂无符合条件的个案</p>
        </div>
      ) : (
        <div className="crisis-case-grid">
          {filteredCases.map((crisisCase) => (
            <CrisisCaseCard
              key={crisisCase.id}
              crisisCase={crisisCase}
              onClick={() => onSelectCase(crisisCase)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: number;
  color: string;
  icon: string;
  highlight?: boolean;
}> = ({ label, value, color, icon, highlight = false }) => {
  return (
    <div className={`stat-card ${color} ${highlight ? 'highlight' : ''}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

const CrisisCaseCard: React.FC<{
  crisisCase: ICrisisCase;
  onClick: () => void;
}> = ({ crisisCase, onClick }) => {
  const severityConfig: Record<RiskLevel, { color: string; label: string }> = {
    [RiskLevel.LOW]: { color: 'green', label: '低' },
    [RiskLevel.MEDIUM]: { color: 'yellow', label: '中' },
    [RiskLevel.HIGH]: { color: 'orange', label: '高' },
    [RiskLevel.CRITICAL]: { color: 'red', label: '极高' },
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

  const isOverdue = !crisisCase.isTrackingClosed
    ? (() => {
        if (!crisisCase.lastTrackingDate) return true;
        const last = new Date(crisisCase.lastTrackingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return last < today;
      })()
    : false;

  return (
    <div
      className={`crisis-case-card ${isOverdue ? 'overdue' : ''} ${crisisCase.isManualTakeover ? 'takeover' : ''}`}
      onClick={onClick}
    >
      <div className="card-header">
        <div className="card-tags">
          <span className={`severity-tag ${sevConfig.color}`}>
            {sevConfig.label}风险
          </span>
          <span className={`status-tag ${statConfig.color}`}>
            {statConfig.label}
          </span>
          {crisisCase.isManualTakeover && (
            <span className="takeover-tag">人工接管</span>
          )}
        </div>
        {isOverdue && (
          <span className="overdue-badge">⚠ 待追踪</span>
        )}
      </div>

      <h3 className="card-title">{crisisCase.title}</h3>
      <p className="card-description">{crisisCase.description}</p>

      <div className="card-info">
        <div className="info-row">
          <span className="info-label">学生</span>
          <span className="info-value">{crisisCase.studentName}</span>
        </div>
        <div className="info-row">
          <span className="info-label">上报时间</span>
          <span className="info-value">
            {new Date(crisisCase.reportedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">追踪次数</span>
          <span className="info-value">{crisisCase.trackingCount} 次</span>
        </div>
        {crisisCase.lastTrackingDate && (
          <div className="info-row">
            <span className="info-label">上次追踪</span>
            <span className="info-value">
              {new Date(crisisCase.lastTrackingDate).toLocaleDateString()}
            </span>
          </div>
        )}
        {crisisCase.nextTrackingDate && !crisisCase.isTrackingClosed && (
          <div className="info-row">
            <span className="info-label">下次追踪</span>
            <span className={`info-value ${isOverdue ? 'overdue' : ''}`}>
              {new Date(crisisCase.nextTrackingDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {crisisCase.isTrackingClosed && (
        <div className="card-footer closed">
          <span>✓ 已闭环</span>
        </div>
      )}
    </div>
  );
};
