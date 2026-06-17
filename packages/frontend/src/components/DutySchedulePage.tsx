import React, { useState } from 'react';
import {
  DutyShiftType,
  DutyStatus,
} from '@shared/enums';
import {
  IDutySchedule,
} from '@shared/interfaces';

interface DutySchedulePageProps {
  dutySchedules: IDutySchedule[];
  onRefresh?: () => void;
}

export const DutySchedulePage: React.FC<DutySchedulePageProps> = ({
  dutySchedules,
  onRefresh,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [shiftTypeFilter, setShiftTypeFilter] = useState<DutyShiftType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');

  const shiftTypeConfig: Record<DutyShiftType, { color: string; label: string; icon: string }> = {
    [DutyShiftType.MORNING]: { color: 'yellow', label: '早班', icon: '🌅' },
    [DutyShiftType.AFTERNOON]: { color: 'blue', label: '午班', icon: '☀️' },
    [DutyShiftType.NIGHT]: { color: 'purple', label: '夜班', icon: '🌙' },
    [DutyShiftType.WEEKEND]: { color: 'orange', label: '周末班', icon: '📅' },
    [DutyShiftType.HOLIDAY]: { color: 'red', label: '节假日', icon: '🎉' },
  };

  const statusConfig: Record<DutyStatus, { color: string; label: string }> = {
    [DutyStatus.SCHEDULED]: { color: 'blue', label: '已排班' },
    [DutyStatus.IN_PROGRESS]: { color: 'green', label: '值班中' },
    [DutyStatus.COMPLETED]: { color: 'gray', label: '已完成' },
    [DutyStatus.CANCELLED]: { color: 'red', label: '已取消' },
    [DutyStatus.SWAPPED]: { color: 'purple', label: '已换班' },
  };

  const filteredSchedules = dutySchedules.filter((s) => {
    if (shiftTypeFilter !== 'all' && s.shiftType !== shiftTypeFilter) return false;
    return true;
  });

  const todaySchedules = dutySchedules.filter((s) => {
    const scheduleDate = new Date(s.date).toISOString().split('T')[0];
    return scheduleDate === selectedDate;
  });

  const nightDutySchedules = todaySchedules.filter(
    (s) => s.shiftType === DutyShiftType.NIGHT,
  );

  const stats = {
    total: dutySchedules.length,
    today: todaySchedules.length,
    nightToday: nightDutySchedules.length,
    inProgress: todaySchedules.filter(
      (s) => s.status === DutyStatus.IN_PROGRESS,
    ).length,
  };

  return (
    <div className="duty-schedule-page">
      <div className="page-header">
        <h1 className="page-title">夜间值班管理</h1>
        <div className="page-actions">
          <button className="btn btn-primary">新建排班</button>
          <button className="btn btn-secondary">批量排班</button>
          {onRefresh && (
            <button className="btn btn-secondary" onClick={onRefresh}>
              刷新
            </button>
          )}
        </div>
      </div>

      <div className="stats-cards">
        <StatCard label="总排班数" value={stats.total} color="blue" icon="📅" />
        <StatCard label="今日值班" value={stats.today} color="green" icon="👥" />
        <StatCard label="今日夜班" value={stats.nightToday} color="purple" icon="🌙" />
        <StatCard label="值班中" value={stats.inProgress} color="orange" icon="🔴" />
      </div>

      <div className="filter-bar">
        <div className="filter-left">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <select
            value={shiftTypeFilter}
            onChange={(e) => setShiftTypeFilter(e.target.value as any)}
          >
            <option value="all">全部班次</option>
            <option value={DutyShiftType.MORNING}>早班</option>
            <option value={DutyShiftType.AFTERNOON}>午班</option>
            <option value={DutyShiftType.NIGHT}>夜班</option>
            <option value={DutyShiftType.WEEKEND}>周末班</option>
            <option value={DutyShiftType.HOLIDAY}>节假日</option>
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

      <div className="today-duty-section">
        <h3 className="section-title">
          今日值班 ({selectedDate}
        </h3>
        <div className="today-duty-list">
          {todaySchedules.length === 0 ? (
            <div className="empty-state">今日暂无排班</div>
          ) : (
            todaySchedules.map((schedule) => (
              <DutyCard
                key={schedule.id}
                schedule={schedule}
                shiftTypeConfig={shiftTypeConfig}
                statusConfig={statusConfig}
              />
            ))
          )}
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <CalendarView
          schedules={filteredSchedules}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          shiftTypeConfig={shiftTypeConfig}
        />
      ) : (
        <ListView
          schedules={filteredSchedules}
          shiftTypeConfig={shiftTypeConfig}
          statusConfig={statusConfig}
        />
      )}

      <div className="duty-actions-section">
        <h3 className="section-title">值班操作</h3>
        <div className="action-buttons">
          <button className="btn btn-action">开始值班</button>
          <button className="btn btn-action">结束值班</button>
          <button className="btn btn-action">申请换班</button>
          <button className="btn btn-action">代班记录</button>
        </div>
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

const DutyCard: React.FC<{
  schedule: IDutySchedule;
  shiftTypeConfig: Record<DutyShiftType, { color: string; label: string; icon: string }>;
  statusConfig: Record<DutyStatus, { color: string; label: string }>;
}> = ({ schedule, shiftTypeConfig, statusConfig }) => {
  const shiftConfig = shiftTypeConfig[schedule.shiftType] || shiftTypeConfig[DutyShiftType.DAY];
  const statConfig = statusConfig[schedule.status] || statusConfig[DutyStatus.SCHEDULED];

  return (
    <div className={`duty-card ${shiftConfig.color}`}>
      <div className="card-header">
        <div className="shift-info">
          <span className="shift-icon">{shiftConfig.icon}</span>
          <span className="shift-type">{shiftConfig.label}</span>
        </div>
        <span className={`status-tag ${statConfig.color}`}>
          {statConfig.label}
        </span>
      </div>

      <div className="counselor-info">
        <div className="counselor-avatar">
          {schedule.counselorName?.charAt(0) || '咨'}
        </div>
        <div className="counselor-details">
          <div className="counselor-name">{schedule.counselorName}</div>
          <div className="counselor-title">{schedule.counselorTitle || '咨询师'}</div>
        </div>
      </div>

      <div className="time-info">
        <span className="time-label">值班时间</span>
        <span className="time-value">
          {schedule.startTime} - {schedule.endTime}
        </span>
      </div>

      {schedule.notes && (
        <div className="notes">备注：{schedule.notes}</div>
      )}

      {schedule.status === DutyStatus.IN_PROGRESS && (
        <div className="current-duty-badge">
          🟢 值班中
        </div>
      )}
    </div>
  );
};

const CalendarView: React.FC<{
  schedules: IDutySchedule[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  shiftTypeConfig: Record<DutyShiftType, { color: string; label: string; icon: string }>;
}> = ({ schedules, selectedDate, onDateChange, shiftTypeConfig }) => {
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

  const getSchedulesForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedules.filter((s) => {
      const sDate = new Date(s.date).toISOString().split('T')[0];
      return sDate === dateStr;
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
        {calendarDays.map((day, index) => {
          const daySchedules = day ? getSchedulesForDay(day) : [];
          const isToday = day === date.getDate();
          const isWeekend = day !== null && (index % 7 === 0 || index % 7 === 6);

          return (
            <div
              key={index}
              className={`calendar-cell ${day ? '' : 'empty'} ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''}`}
              onClick={() => {
                if (day) {
                  const d = new Date(year, month, day);
                  onDateChange(d.toISOString().split('T')[0]);
                }
              }}
            >
              {day && (
                <>
                  <div className="day-number">{day}</div>
                  <div className="day-events">
                    {daySchedules.slice(0, 2).map((s) => {
                      const config = shiftTypeConfig[s.shiftType] || shiftTypeConfig[DutyShiftType.DAY];
                      return (
                        <div
                          key={s.id}
                          className={`calendar-event ${config.color}`}
                        >
                          {config.icon} {s.counselorName}
                        </div>
                      );
                    })}
                    {daySchedules.length > 2 && (
                      <div className="more-events">
                        +{daySchedules.length - 2}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ListView: React.FC<{
  schedules: IDutySchedule[];
  shiftTypeConfig: Record<DutyShiftType, { color: string; label: string; icon: string }>;
  statusConfig: Record<DutyStatus, { color: string; label: string }>;
}> = ({ schedules, shiftTypeConfig, statusConfig }) => {
  const sortedSchedules = [...schedules].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div className="duty-list">
      {sortedSchedules.map((schedule) => (
        <DutyCard
          key={schedule.id}
          schedule={schedule}
          shiftTypeConfig={shiftTypeConfig}
          statusConfig={statusConfig}
        />
      ))}
    </div>
  );
};
