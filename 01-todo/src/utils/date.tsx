import type { CalendarDay } from '../types/todo';

// 로컬 시간 기준 YYYY-MM-DD 문자열 반환
export const getLocalDateString = (date = new Date()): string => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

// 특정 날짜가 속한 달의 마지막 날짜 문자열 반환
export const getLastDayOfMonth = (dateString: string): string => {
  const parts = dateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10); // 1-based index (e.g. 6 = June)
  const lastDay = new Date(year, month, 0);
  return getLocalDateString(lastDay);
};

// 특정 날짜의 이전 달(YYYY-MM) 문자열 반환
export const getPrevMonthYear = (dateString: string): string => {
  const parts = dateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);

  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }
  return `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;
};

// 기준일이 포함된 월요일~일요일 날짜 배열(YYYY-MM-DD) 반환
export const getWeekDates = (pivotDateString: string): string[] => {
  const pivotDate = new Date(pivotDateString);
  const day = pivotDate.getDay(); // 0: 일요일, 1: 월요일...
  const diffToMonday = day === 0 ? -6 : -(day - 1);

  const monday = new Date(pivotDate);
  monday.setDate(pivotDate.getDate() + diffToMonday);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(getLocalDateString(d));
  }
  return dates;
};

// 월별 달력 그리드(주 단위 2차원 배열) 생성 함수 (일요일~토요일 기준)
export const getMonthlyCalendarGrid = (year: number, month: number): CalendarDay[][] => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startOfWeekDay = firstDayOfMonth.getDay(); // 0 = 일요일, 1 = 월요일...
  const totalDays = lastDayOfMonth.getDate();
  const calendarDays = [];

  // 이전 달 패딩
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startOfWeekDay - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i);
    calendarDays.push({
      dateString: getLocalDateString(d),
      dayNumber: d.getDate(),
      isCurrentMonth: false
    });
  }

  // 이번 달 날짜
  for (let i = 1; i <= totalDays; i++) {
    const d = new Date(year, month, i);
    calendarDays.push({
      dateString: getLocalDateString(d),
      dayNumber: i,
      isCurrentMonth: true
    });
  }

  // 다음 달 패딩
  const totalCells = Math.ceil(calendarDays.length / 7) * 7;
  const nextMonthDaysNeeded = totalCells - calendarDays.length;
  for (let i = 1; i <= nextMonthDaysNeeded; i++) {
    const d = new Date(year, month + 1, i);
    calendarDays.push({
      dateString: getLocalDateString(d),
      dayNumber: i,
      isCurrentMonth: false
    });
  }

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }
  return weeks;
};
