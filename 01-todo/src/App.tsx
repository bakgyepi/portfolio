import { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TopHeader from './TopHeader';
import { getLocalDateString, getMonthlyCalendarGrid, getLastDayOfMonth, getPrevMonthYear, getWeekDates } from './utils/date';
import { useTodos } from './hooks/useTodos';
import type { DayCompletionStats, RoutineItem, Todo, TodoFormData, ViewMode } from './types/todo';
import './App.scss'

function TodoApp() {
  const { todos, setTodos } = useTodos();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());

  // 월간 보기용 연/월 상태
  const [monthViewDate, setMonthViewDate] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  // 수정 제어 대상 ID
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  // 지난달 루틴 가져오기 제어 상태
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedImportIds, setSelectedImportIds] = useState<number[]>([]);

  // 변경사항 로컬 스토리지에 자동 저장
  useEffect(() => {
    localStorage.setItem('todo-routine-list', JSON.stringify(todos));
  }, [todos]);

  // 알림 백그라운드 스케줄러 등록
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const timeStr = now.toTimeString().substring(0, 5); // "HH:MM"
      const todayStr = getLocalDateString(now);

      todos.forEach(item => {
        if (item.type === 'routine' && item.alarmTime === timeStr) {
          const isActiveToday = todayStr >= item.startDate && (!item.endDate || todayStr <= item.endDate);
          const isAlreadyCompleted = item.completedDates.includes(todayStr);

          if (isActiveToday && !isAlreadyCompleted) {
            if (typeof window !== 'undefined') {
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(`⏰ 루틴 실천 시간!`, {
                  body: `${item.emoji} ${item.text}을(를) 시작해 보세요.`,
                  tag: `${item.id}-${todayStr}`
                });
              } else {
                alert(`⏰ 루틴 알림!\n\n${item.emoji} ${item.text}을(를) 실천할 시간입니다! (${timeStr})`);
              }
            }
          }
        }
      });
    };

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    const interval = setInterval(checkAlarms, 60000); // 1분마다 확인
    return () => clearInterval(interval);
  }, [todos]);

  // 일정 등록 저장 콜백
  const handleSaveAdd = (formData: TodoFormData) => {
    const newId = Date.now();
    let newItem: Todo;

    if (formData.type === 'todo') {
      newItem = {
        id: newId,
        type: 'todo',
        emoji: formData.emoji,
        text: formData.text,
        date: selectedDate,
        completed: false
      };
    } else {
      newItem = {
        id: newId,
        type: 'routine',
        emoji: formData.emoji,
        text: formData.text,
        startDate: selectedDate,
        endDate: formData.endDate ?? getLastDayOfMonth(selectedDate),
        completedDates: [],
        alarmTime: formData.alarmTime ?? null
      };
    }

    setTodos([...todos, newItem]);
    setViewMode('list');
  };

  // 일정 수정 저장 콜백
  const handleSaveEdit = (formData: TodoFormData) => {
    setTodos(
      todos.map((todo): Todo => {
        if (todo.id !== editingItemId) return todo;

        if (todo.type === 'todo') {
          return {
            ...todo,
            emoji: formData.emoji,
          };
        }

        return {
          ...todo,
          emoji: formData.emoji,
          endDate: formData.endDate ?? todo.endDate,
          alarmTime: formData.alarmTime ?? null
        };
      })
    );
    setEditingItemId(null);
    setViewMode('list');
  };

  const handleDeleteEdit = () => {
    if (editingItemId === null) return;
    const isConfirmed = window.confirm("설정한 루틴이 전체 삭제됩니다. \n삭제하시겠습니까?");
    if (!isConfirmed) return;

    setTodos(todos.filter(todo => todo.id !== editingItemId));
    setEditingItemId(null);
    setViewMode('list');
  };

  // 완료 상태 토글 함수 (대상 날짜 지정 가능)
  const handleToggleTodo = (id: number, targetDate = selectedDate) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id !== id) return todo;

        if (todo.type === 'todo') {
          return { ...todo, completed: !todo.completed };
        } else {
          const completed = todo.completedDates.includes(targetDate);
          const newCompletedDates = completed
            ? todo.completedDates.filter(d => d !== targetDate)
            : [...todo.completedDates, targetDate];
          return { ...todo, completedDates: newCompletedDates };
        }
      })
    );
  };

  // 지난달 루틴 복사 가져오기 핸들러
  const handleImportRoutines = () => {
    const currentMonthStr = selectedDate.substring(0, 7);
    const currentMonthStart = `${currentMonthStr}-01`;
    const currentMonthEnd = getLastDayOfMonth(currentMonthStart);

    const routinesToImport = lastMonthRoutines.filter(r => selectedImportIds.includes(r.id));

    const importedItems: RoutineItem[] = routinesToImport.map(r => ({
      id: Date.now() + Math.random(),
      type: 'routine',
      emoji: r.emoji,
      text: r.text,
      startDate: currentMonthStart,
      endDate: currentMonthEnd,
      completedDates: [],
      alarmTime: r.alarmTime
    }));

    setTodos([...todos, ...importedItems]);
    setShowImportModal(false);
  };

  // 주간 이동 핸들러
  const handlePrevWeek = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 7);
    setSelectedDate(getLocalDateString(d));
  };

  const handleNextWeek = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 7);
    setSelectedDate(getLocalDateString(d));
  };

  const handleSetToday = () => {
    setSelectedDate(getLocalDateString(new Date()));
  };

  // 월간 이동 핸들러
  const handlePrevMonth = () => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() - 1);
    setMonthViewDate(prev => {
      let nextMonth = prev.month - 1;
      let nextYear = prev.year;
      if (nextMonth < 0) {
        nextMonth = 11;
        nextYear -= 1;
      }
      return { year: nextYear, month: nextMonth };
    });
    setSelectedDate(getLocalDateString(d));
  };

  const handleNextMonth = () => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() + 1);
    setMonthViewDate(prev => {
      let nextMonth = prev.month + 1;
      let nextYear = prev.year;
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear += 1;
      }
      return { year: nextYear, month: nextMonth };
    });
    setSelectedDate(getLocalDateString(d));
  };

  // 날짜별 달성도 계산기 (히트맵용)
  const getDayCompletionStats = (dateString: string): DayCompletionStats => {
    const activeItems = todos.filter(item => {
      if (item.type === 'todo') {
        return item.date === dateString;
      } else {
        return dateString >= item.startDate && (!item.endDate || dateString <= item.endDate);
      }
    });

    if (activeItems.length === 0) return { total: 0, completed: 0, rate: null };

    const completedItems = activeItems.filter(item => {
      if (item.type === 'todo') {
        return item.completed;
      } else {
        return item.completedDates.includes(dateString);
      }
    });

    const rate = (completedItems.length / activeItems.length) * 100;
    return { total: activeItems.length, completed: completedItems.length, rate };
  };

  // 현재 선택된 주 날짜 배열 구하기
  const weekDays = getWeekDates(selectedDate);

  // 선택된 날짜에 활성화된 할 일 및 루틴 필터링
  const filteredItems = todos.filter(item => {
    if (item.type === 'todo') {
      return item.date === selectedDate;
    } else {
      return selectedDate >= item.startDate && (!item.endDate || selectedDate <= item.endDate);
    }
  });

  // 주간 뷰용 루틴 목록 추출 (이번 주 하루라도 걸쳐있는 루틴들)
  const activeRoutinesThisWeek = todos.filter((item): item is RoutineItem => {
    if (item.type !== 'routine') return false;
    return weekDays.some(d => d >= item.startDate && (!item.endDate || d <= item.endDate));
  });

  // 달력 날짜 목록 가져오기
  const calendarWeeks = getMonthlyCalendarGrid(monthViewDate.year, monthViewDate.month);

  // --- 지난달 루틴 가져오기 목록 계산 ---
  const prevMonthStr = getPrevMonthYear(selectedDate);
  const prevMonthStart = `${prevMonthStr}-01`;
  const prevMonthEnd = getLastDayOfMonth(prevMonthStart);

  const currentMonthStr = selectedDate.substring(0, 7);
  const currentMonthStart = `${currentMonthStr}-01`;
  const currentMonthEnd = getLastDayOfMonth(currentMonthStart);

  const currentMonthRoutines = todos.filter((item): item is RoutineItem =>
    item.type === 'routine' &&
    item.startDate <= currentMonthEnd &&
    (!item.endDate || item.endDate >= currentMonthStart)
  );

  const lastMonthRoutines = todos.filter((item): item is RoutineItem => {
    if (item.type !== 'routine') return false;
    const isActiveInPrevMonth = item.startDate <= prevMonthEnd && (!item.endDate || item.endDate >= prevMonthStart);
    if (!isActiveInPrevMonth) return false;

    const alreadyExists = currentMonthRoutines.some(cur => cur.text === item.text);
    return !alreadyExists;
  });

  useEffect(() => {
  if (!selectedDate) return;

  // 1. '2026-06-10' 같은 selectedDate 문자열에서 연, 월을 쪼개냅니다.
  const [yearStr, monthStr] = selectedDate.split('-');
  const newYear = parseInt(yearStr, 10);
  const newMonth = parseInt(monthStr, 10) - 1; // 자바스크립트 Month는 0부터 시작하므로 1을 빼줍니다.

  // 2. 현재 월간 뷰에 세팅된 연/월과 다르다면, selectedDate에 맞춰 월간 뷰 상태를 업데이트합니다.
  if (monthViewDate.year !== newYear || monthViewDate.month !== newMonth) {
    setMonthViewDate({
      year: newYear,
      month: newMonth
    });
  }
}, [selectedDate]);

  return (
    <>
      <div className='main'>
      {/* 2. 일정 추가 화면 */}
      {viewMode === 'add' && (
        <TodoForm
          mode="add"
          selectedDate={selectedDate}
          onSave={handleSaveAdd}
          onCancel={() => setViewMode('list')}
        />
      )}

      {/* 3. 일정 수정 화면 */}
      {viewMode === 'edit' && (
        <TodoForm
          mode="edit"
          selectedDate={selectedDate}
          itemToEdit={todos.find(t => t.id === editingItemId)}
          onSave={handleSaveEdit}
          onCancel={() => {
            setEditingItemId(null);
            setViewMode('list');
          }}
          onDelete={handleDeleteEdit}
        />
      )}


        {/* 1. 할 일 리스트 뷰 */}
        {viewMode === 'list' && (
          <>
            <TopHeader viewMode={viewMode} selectedDate={selectedDate} setViewMode={setViewMode} />
            <div>
              <button
                type="button"
                onClick={() => setViewMode('add')}
                className="btn-add-float">
                +
              </button>
              {/* 주간 칩 바 */}
              <div className="week-chip-bar">
                <button onClick={handlePrevWeek} className="nav-button">&lt;</button>
                <div className="week-scroll">
                  {weekDays.map((d) => {
                    const isSelected = d === selectedDate;
                    const isToday = d === getLocalDateString();
                    const dObj = new Date(d);
                    const dayNum = dObj.getDate();
                    const dayLabel = ['일', '월', '화', '수', '목', '금', '토'][dObj.getDay()];

                    const stats = getDayCompletionStats(d);
                    const hasItems = stats.total > 0;
                    const allDone = hasItems && stats.completed === stats.total;

                    return (
                      <button
                        key={d}
                        onClick={() => setSelectedDate(d)}
                        className="day-button" style={{ background: isSelected ? 'var(--accent, #aa3bff)' : 'transparent', color: isSelected ? '#fff' : (isToday ? 'var(--accent, #aa3bff)' : 'var(--text-h, #000)'), fontWeight: isSelected || isToday ? 'bold' : 'normal' }}
                      >
                        <span className="day-label" style={{ opacity: isSelected ? 0.9 : 0.6 }}>{dayLabel}</span>
                        <span className="day-number">{dayNum}</span>
                        {hasItems && (
                          <div style={{
                            position: 'absolute',
                            bottom: '4px',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: isSelected ? '#fff' : (allDone ? '#10b981' : '#f59e0b')
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>
                <button onClick={handleNextWeek} className="nav-button">&gt;</button>
              </div>

              {/* 리스트 출력 */}
              <div className="list-container">
                <h3 className="list-header">
                  <span>{selectedDate} </span>
                  <div className="header-controls">
                    {/* 지난달 루틴 가져오기 버튼 */}
                    {lastMonthRoutines.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImportIds(lastMonthRoutines.map(r => r.id));
                          setShowImportModal(true);
                        }}
                        className="import-button">
                        지난달 루틴 복사 ({lastMonthRoutines.length})
                      </button>
                    )}
                    {/* <span className="total-count">총 {filteredItems.length}개</span> */}
                    <button onClick={handleSetToday} className="today-button">오늘</button>
                  </div>
                </h3>

                <ul className="items-list">
                  {filteredItems.length === 0 ? (
                    <p className="empty-list">등록된 투두 또는 활성화된 루틴이 없습니다.</p>
                  ) : (
                    filteredItems.map((todo) => {
                      const isCompleted = todo.type === 'todo'
                        ? todo.completed
                        : todo.completedDates.includes(selectedDate);

                      return (
                        <li key={todo.id} className="list-item">
                          <span className="todo-item" style={{ textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? 'var(--text, #aaa)' : 'var(--text-h, #000)', opacity: isCompleted ? 0.6 : 1 }}>
                            <span onClick={() => handleToggleTodo(todo.id)} className="status-mark">{isCompleted ? '✅' : '⬜'}</span>
                            {todo.emoji && <span className="todo-emoji">{todo.emoji}</span>}
                            <span onClick={() => {
                              setEditingItemId(todo.id);
                              setViewMode('edit');
                            }}
                              className="todo-text">{todo.text}</span>

                            {todo.type === 'routine' && (
                              <div className="routine-badges">
                                <span className="badge">🔁 매일 {todo.endDate ? `(~${todo.endDate.substring(5)})` : ''}</span>
                                {todo.alarmTime && (
                                  <span className="badge badge-alarm">⏰ {todo.alarmTime}</span>
                                )}
                              </div>
                            )}
                          </span>
                          {/* <div className="controls-group">
                            {todo.type === 'routine' && (
                              <button
                                onClick={() => {
                                  setEditingItemId(todo.id);
                                  setViewMode('edit');
                                }}
                                className="edit-button">
                                수정
                              </button>
                            )}
                          </div> */}
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            </div>
          </>
        )}


        {/* 4. 주간 대시보드 뷰 */}
        {viewMode === 'weekly' && (
          <>
            <TopHeader viewMode={viewMode} selectedDate={selectedDate} setViewMode={setViewMode} />
            <div>
              <div className="week-chip-bar">
                <button onClick={handlePrevWeek} className="nav-button">&lt;</button>
                <span className="week-title">{weekDays[0]} ~ {weekDays[6]} 주간 루틴</span>
                <button onClick={handleNextWeek} className="nav-button">&gt;</button>
              </div>

              <div className="panel-container">
                {activeRoutinesThisWeek.length === 0 ? (
                  <p style={{ color: 'var(--text, #888)', textAlign: 'center', padding: '24px 0', margin: 0 }}>이번 주에 활성화된 루틴이 없습니다.</p>
                ) : (
                  <div className="table-panel">
                    <div className="table-title">
                      <table className="report-table">
                      <thead>
                        <tr className="table-row-header">
                          <th className="table-th-left">루틴</th>
                        </tr>
                    </thead>
                    <tbody>
                      {activeRoutinesThisWeek.map((routine) => {
                        return (
                          <tr key={routine.id} className="table-row">
                            <td className="table-td" style={{ padding: '10px 8px', fontWeight: '500', color: 'var(--text-h, #000)' }}>
                              <span className="routine-emoji">{routine.emoji}</span>
                              {routine.text}
                            </td>
                          </tr>
                        );
                      })}
                        </tbody>
                      </table>
                    </div>
                    <div className="table-scroll">
                      <table className="report-table">
                        <thead>
                          <tr className="table-row-header">
                            {weekDays.map(d => {
                              const dObj = new Date(d);
                              const dayLabel = ['일', '월', '화', '수', '목', '금', '토'][dObj.getDay()];
                              const dayNum = dObj.getDate();
                              const isSelected = d === selectedDate;
                              return (
                                <th key={d} className="report-day-th" style={{ color: isSelected ? 'var(--accent, #aa3bff)' : 'var(--text, #6b6375)', fontWeight: isSelected ? 'bold' : '500' }}>
                                  <div>{dayLabel}</div>
                                  <div className="date-small">{dayNum}</div>
                                </th>
                              );
                            })}
                            <th style={{ textAlign: 'center', color: 'var(--text-h, #000)' }}>달성</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeRoutinesThisWeek.map((routine) => {
                            let weekCompletedCount = 0;
                            let weekActiveCount = 0;

                            return (
                              <tr key={routine.id} className="table-row">
                                {weekDays.map(d => {
                                  const isActive = d >= routine.startDate && (!routine.endDate || d <= routine.endDate);
                                  const isCompleted = routine.completedDates.includes(d);

                                  if (isActive) {
                                    weekActiveCount++;
                                    if (isCompleted) weekCompletedCount++;
                                  }

                                  return (
                                    <td
                                      key={d}
                                      onClick={() => isActive && handleToggleTodo(routine.id, d)}
                                      style={{
                                        textAlign: 'center',
                                        padding: '6px 0',
                                        cursor: isActive ? 'pointer' : 'default',
                                        background: d === selectedDate ? 'rgba(170, 59, 255, 0.02)' : 'transparent',
                                      }}
                                    >
                                      {!isActive ? (
                                        <span style={{ color: 'var(--border, #eee)', fontSize: '12px' }}>-</span>
                                      ) : isCompleted ? (
                                        <span style={{ fontSize: '16px' }}>✅</span>
                                      ) : (
                                        <span style={{ fontSize: '16px', opacity: 0.2 }}>⬜</span>
                                      )}
                                    </td>
                                  );
                                })}
                                <td style={{ textAlign: 'center', padding: '10px 4px', fontWeight: 'bold', color: 'var(--accent, #aa3bff)' }}>
                                  {weekCompletedCount}/{weekActiveCount}
                                  <div style={{ fontSize: '9px', fontWeight: 'normal', opacity: 0.7 }}>
                                    {weekActiveCount > 0 ? `${Math.round((weekCompletedCount / weekActiveCount) * 100)}%` : '0%'}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* 5. 월간 리포트 뷰 */}
        {viewMode === 'monthly' && (
          <>
            <TopHeader viewMode={viewMode} selectedDate={selectedDate} setViewMode={setViewMode} />
            <div>
              <div className="week-chip-bar">
                <button onClick={handlePrevMonth} className="nav-button">&lt;</button>
                <span className="month-title">
                  {monthViewDate.year}년 {monthViewDate.month + 1}월 달성도
                </span>
                <button onClick={handleNextMonth} className="nav-button">&gt;</button>
              </div>

              <div className="month-container">
                <div className="weekdays-header">
                  <div className="weekday-sun">일</div>
                  <div>월</div>
                  <div>화</div>
                  <div>수</div>
                  <div>목</div>
                  <div>금</div>
                  <div className="weekday-sat">토</div>
                </div>

                <div className="month-rows">
                  {calendarWeeks.map((week, wIdx) => (
                    <div key={wIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                      {week.map((cell, cIdx) => {
                        const stats = getDayCompletionStats(cell.dateString);
                        const hasActiveTasks = stats.total > 0;

                        let cellBackground = 'transparent';
                        let textColor = 'var(--text-h, #000)';

                        if (hasActiveTasks) {
                          const rate = stats.rate ?? 0;
                          if (rate === 0) {
                            cellBackground = 'var(--code-bg, #f4f3ec)';
                          } else if (rate > 0 && rate <= 25) {
                            cellBackground = 'color-mix(in srgb, var(--accent, #aa3bff) 20%, var(--bg, #fff))';
                          } else if (rate > 25 && rate <= 50) {
                            cellBackground = 'color-mix(in srgb, var(--accent, #aa3bff) 45%, var(--bg, #fff))';
                          } else if (rate > 50 && rate <= 75) {
                            cellBackground = 'color-mix(in srgb, var(--accent, #aa3bff) 70%, var(--bg, #fff))';
                          } else {
                            cellBackground = 'var(--accent, #aa3bff)';
                            textColor = '#fff';
                          }
                        }

                        return (
                          <button
                            key={cIdx}
                            onClick={() => {
                              setSelectedDate(cell.dateString);
                              setViewMode('list');
                            }}
                            style={{
                              aspectRatio: '1',
                              border: '1px solid var(--border, #eee)',
                              borderRadius: '6px',
                              padding: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: cellBackground,
                              color: textColor,
                              opacity: cell.isCurrentMonth ? 1 : 0.4,
                              transition: 'transform 0.15s, box-shadow 0.15s',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'scale(1.08)';
                              e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'none';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <span style={{ fontSize: '11px', alignSelf: 'flex-start', fontWeight: cell.isCurrentMonth ? 'bold' : 'normal' }}>
                              {cell.dayNumber}
                            </span>
                            {hasActiveTasks && (
                              <span style={{ fontSize: '9px', opacity: 0.8 }}>
                                {stats.completed}/{stats.total}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>


                {/* 안내 가이드 */}
                <div className="legend">
                  <span>달성률: </span>
                  <div className="legend-swatches">
                    <div className="sw code-bg" title="0%" />
                    <div className="sw" style={{ background: 'color-mix(in srgb, var(--accent, #aa3bff) 20%, var(--bg, #fff))' }} title="1% - 25%" />
                    <div className="sw" style={{ background: 'color-mix(in srgb, var(--accent, #aa3bff) 45%, var(--bg, #fff))' }} title="26% - 50%" />
                    <div className="sw" style={{ background: 'color-mix(in srgb, var(--accent, #aa3bff) 70%, var(--bg, #fff))' }} title="51% - 75%" />
                    <div className="sw" style={{ background: 'var(--accent, #aa3bff)' }} title="76% - 100%" />
                  </div>
                </div>
              </div>

            </div>
          </>
        )}

        {/* --- 지난달 루틴 복사 모달 다이얼로그 --- */}
        {showImportModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: 'var(--bg, #fff)',
              border: '1px solid var(--border, #eee)',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: 'var(--shadow, 0 10px 15px -3px rgba(0,0,0,0.1))'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: 'var(--text-h, #000)' }}>🔁 이전 달 루틴 복사</h3>
              <p style={{ fontSize: '13px', color: 'var(--text, #6b6375)', marginBottom: '16px', lineHeight: '1.4' }}>
                직전 달({prevMonthStr})에 활성화되었던 루틴들을 이번 달({currentMonthStr}) 목록으로 복사합니다. 기간은 이번 달 말일까지로 자동 연장됩니다.
              </p>

              <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {lastMonthRoutines.map(routine => {
                  const isSelected = selectedImportIds.includes(routine.id);
                  return (
                    <label key={routine.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: '1px solid var(--border, #eee)', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-h, #000)' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedImportIds([...selectedImportIds, routine.id]);
                          } else {
                            setSelectedImportIds(selectedImportIds.filter(id => id !== routine.id));
                          }
                        }}
                      />
                      <span>{routine.emoji}</span>
                      <span style={{ flex: 1 }}>{routine.text}</span>
                      {routine.alarmTime && <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>⏰ {routine.alarmTime}</span>}
                    </label>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowImportModal(false)}
                  style={{ background: 'var(--code-bg, #f4f3ec)', color: 'var(--text-h, #000)', border: '1px solid var(--border, #ccc)', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  취소
                </button>
                <button
                  onClick={handleImportRoutines}
                  disabled={selectedImportIds.length === 0}
                  style={{
                    background: 'var(--accent, #aa3bff)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    opacity: selectedImportIds.length === 0 ? 0.5 : 1
                  }}
                >
                  가져오기 ({selectedImportIds.length}개)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>

  );
}

export default TodoApp;
