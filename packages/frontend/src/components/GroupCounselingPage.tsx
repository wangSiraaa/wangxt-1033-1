import React, { useState } from 'react';
import {
  GroupCounselingStatus,
  GroupMemberStatus,
  RoomType,
} from '@shared/enums';
import {
  IGroupCounseling,
  IGroupCounselingMember,
  IRoom,
} from '@shared/interfaces';

interface GroupCounselingListProps {
  groupCounselings: IGroupCounseling[];
  rooms: IRoom[];
  onSelectGroup: (group: IGroupCounseling) => void;
  onRefresh?: () => void;
}

export const GroupCounselingList: React.FC<GroupCounselingListProps> = ({
  groupCounselings,
  rooms,
  onSelectGroup,
  onRefresh,
}) => {
  const [statusFilter, setStatusFilter] = useState<GroupCounselingStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );

  const statusConfig: Record<GroupCounselingStatus, { color: string; label: string }> = {
    [GroupCounselingStatus.DRAFT]: { color: 'gray', label: '草稿' },
    [GroupCounselingStatus.PUBLISHED]: { color: 'blue', label: '已发布' },
    [GroupCounselingStatus.REGISTRATION]: { color: 'green', label: '报名中' },
    [GroupCounselingStatus.IN_PROGRESS]: { color: 'purple', label: '进行中' },
    [GroupCounselingStatus.COMPLETED]: { color: 'green', label: '已完成' },
    [GroupCounselingStatus.CANCELLED]: { color: 'red', label: '已取消' },
  };

  const filteredGroups = groupCounselings.filter((g) => {
    if (statusFilter !== 'all' && g.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: groupCounselings.length,
    inProgress: groupCounselings.filter(
      (g) => g.status === GroupCounselingStatus.IN_PROGRESS,
    ).length,
    registration: groupCounselings.filter(
      (g) => g.status === GroupCounselingStatus.REGISTRATION,
    ).length,
    completed: groupCounselings.filter(
      (g) => g.status === GroupCounselingStatus.COMPLETED,
    ).length,
  };

  const confidentialRooms = rooms.filter((r) => r.isConfidential);

  return (
    <div className="group-counseling-page">
      <div className="page-header">
        <h1 className="page-title">团体咨询管理</h1>
        <div className="page-actions">
          <button className="btn btn-primary">新建团体</button>
          {onRefresh && (
            <button className="btn btn-secondary" onClick={onRefresh}>
              刷新
            </button>
          )}
        </div>
      </div>

      <div className="stats-cards">
        <StatCard label="总团体数" value={stats.total} color="blue" icon="👥" />
        <StatCard
          label="报名中"
          value={stats.registration}
          color="green"
          icon="📝"
        />
        <StatCard
          label="进行中"
          value={stats.inProgress}
          color="purple"
          icon="🔄"
        />
        <StatCard
          label="已完成"
          value={stats.completed}
          color="gray"
          icon="✅"
        />
      </div>

      <div className="filter-bar">
        <div className="filter-left">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">全部状态</option>
            <option value={GroupCounselingStatus.DRAFT}>草稿</option>
            <option value={GroupCounselingStatus.PUBLISHED}>已发布</option>
            <option value={GroupCounselingStatus.REGISTRATION}>报名中</option>
            <option value={GroupCounselingStatus.IN_PROGRESS}>进行中</option>
            <option value={GroupCounselingStatus.COMPLETED}>已完成</option>
            <option value={GroupCounselingStatus.CANCELLED}>已取消</option>
          </select>
        </div>
        <div className="filter-right">
          <div className="view-toggle">
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              列表
            </button>
            <button
              className={viewMode === 'calendar' ? 'active' : ''}
              onClick={() => setViewMode('calendar')}
            >
              日历
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="group-list">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={() => onSelectGroup(group)}
              statusConfig={statusConfig}
            />
          ))}
        </div>
      ) : (
        <CalendarView
          groups={filteredGroups}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onSelectGroup={onSelectGroup}
        />
      )}

      <div className="confidential-rooms-section">
        <h3 className="section-title">保密房间占用情况</h3>
        <RoomOccupancy rooms={confidentialRooms} groups={groupCounselings} />
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: number;
  color: string;
  icon: string;
}> = ({ label, value, color, icon }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

const GroupCard: React.FC<{
  group: IGroupCounseling;
  onClick: () => void;
  statusConfig: Record<GroupCounselingStatus, { color: string; label: string }>;
}> = ({ group, onClick, statusConfig }) => {
  const config = statusConfig[group.status] || statusConfig[GroupCounselingStatus.DRAFT];
  const enrollmentRate = group.maxMembers
    ? Math.round((group.currentMembers / group.maxMembers) * 100)
    : 0;

  return (
    <div className="group-card" onClick={onClick}>
      <div className="card-header">
        <span className={`status-tag ${config.color}`}>{config.label}</span>
        {group.isConfidentialRoom && (
          <span className="confidential-tag">🔒 保密房间</span>
        )}
      </div>

      <h3 className="card-title">{group.title}</h3>
      <p className="card-description">{group.description}</p>

      <div className="card-info">
        <div className="info-row">
          <span className="info-label">主题</span>
          <span className="info-value">{group.theme}</span>
        </div>
        <div className="info-row">
          <span className="info-label">带领者</span>
          <span className="info-value">{group.leaderName}</span>
        </div>
        <div className="info-row">
          <span className="info-label">开始时间</span>
          <span className="info-value">
            {new Date(group.startDate).toLocaleDateString()}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">结束时间</span>
          <span className="info-value">
            {new Date(group.endDate).toLocaleDateString()}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">房间</span>
          <span className="info-value">{group.roomName || '未安排'}</span>
        </div>
      </div>

      {group.maxMembers && (
        <div className="enrollment-progress">
          <div className="progress-info">
            <span>报名人数</span>
            <span>
              {group.currentMembers}/{group.maxMembers}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${enrollmentRate}%` }}
            />
          </div>
        </div>
      )}

      <div className="card-meta">
        <span>共 {group.sessionCount} 次活动</span>
        <span>{group.duration} 分钟/次</span>
      </div>
    </div>
  );
};

const CalendarView: React.FC<{
  groups: IGroupCounseling[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onSelectGroup: (group: IGroupCounseling) => void;
}> = ({ groups, selectedDate, onDateChange, onSelectGroup }) => {
  const date = new Date(selectedDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const getGroupsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return groups.filter((g) => {
      const start = new Date(g.startDate);
      const end = new Date(g.endDate);
      const current = new Date(dateStr);
      return current >= start && current <= end;
    });
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button
          onClick={() => {
            const d = new Date(year, month - 1, 1);
            onDateChange(d.toISOString().split('T')[0]);
          }}
        >
          ◀
        </button>
        <span className="calendar-title">{year}年{month + 1}月</span>
        <button
          onClick={() => {
            const d = new Date(year, month + 1, 1);
            onDateChange(d.toISOString().split('T')[0]);
          }}
        >
          ▶
        </button>
      </div>

      <div className="calendar-weekdays">
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-cell ${day ? '' : 'empty'} ${day === date.getDate() ? 'today' : ''}`}
          >
            {day && (
              <>
                <div className="day-number">{day}</div>
                <div className="day-events">
                  {getGroupsForDay(day).slice(0, 2).map((group) => (
                    <div
                      key={group.id}
                      className="calendar-event"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectGroup(group);
                      }}
                    >
                      {group.title}
                    </div>
                  ))}
                  {getGroupsForDay(day).length > 2 && (
                    <div className="more-events">
                      +{getGroupsForDay(day).length - 2}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const RoomOccupancy: React.FC<{
  rooms: IRoom[];
  groups: IGroupCounseling[];
}> = ({ rooms, groups }) => {
  const today = new Date().toISOString().split('T')[0];

  const getRoomOccupancy = (roomId: string) => {
    return groups.filter((g) => {
      if (g.roomId !== roomId) return false;
      const start = new Date(g.startDate);
      const end = new Date(g.endDate);
      const todayDate = new Date(today);
      return todayDate >= start && todayDate <= end;
    });
  };

  return (
    <div className="room-occupancy">
      <div className="room-list">
        {rooms.map((room) => {
          const occupied = getRoomOccupancy(room.id);
          return (
            <div key={room.id} className="room-item">
              <div className="room-info">
                <span className="room-name">{room.name}</span>
                <span className="room-type">
                  {room.type === RoomType.GROUP ? '团体室' : room.type === RoomType.INDIVIDUAL ? '个体室' : '多功能室'}
                </span>
                {room.isConfidential && (
                  <span className="confidential-badge">保密</span>
                )}
              </div>
              <div className="room-status">
                {occupied.length > 0 ? (
                  <span className="status-occupied">
                    占用中 ({occupied.length}个团体)
                  </span>
                ) : (
                  <span className="status-available">空闲</span>
                )}
              </div>
              <div className="room-capacity">容量：{room.capacity}人</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
