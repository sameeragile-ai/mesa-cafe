import { toZonedTime } from 'date-fns-tz';
import { BUSINESS_INFO } from '../data/business';

export const TIMEZONE = 'Europe/London';

export interface OpenStatus {
  isOpen: boolean;
  statusText: string;
  todayScheduleText: string;
  closesOrOpensText: string;
  isTodaySaturday: boolean;
}

/**
 * Returns current date and time in London timezone
 */
export function getLondonNow(): Date {
  return toZonedTime(new Date(), TIMEZONE);
}

/**
 * Computes live open/closed status for MESA Glasgow in Europe/London timezone
 */
export function getLiveStatus(customNow?: Date): OpenStatus {
  const now = customNow || getLondonNow();
  const dayIndex = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  // Opening is always 09:00 AM (540 mins)
  const openMinutes = 9 * 60; // 540

  // Closing: Saturday 16:00 (960 mins), other days 15:30 (930 mins)
  const isSaturday = dayIndex === 6;
  const closeMinutes = isSaturday ? 16 * 60 : 15 * 60 + 30;
  const closeFormatted = isSaturday ? '4:00 PM' : '3:30 PM';

  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  let statusText = '';
  let closesOrOpensText = '';

  if (isOpen) {
    statusText = `Open now · closes ${closeFormatted}`;
    closesOrOpensText = `Closes at ${closeFormatted}`;
  } else {
    // Determine when it opens next
    if (currentMinutes < openMinutes) {
      statusText = 'Closed · opens 9:00 AM today';
      closesOrOpensText = 'Opens 9:00 AM today';
    } else {
      // It opens tomorrow at 9:00 AM
      statusText = 'Closed · opens 9:00 AM tomorrow';
      closesOrOpensText = 'Opens 9:00 AM tomorrow';
    }
  }

  const todaySchedule = BUSINESS_INFO.schedule.find((s) => s.dayIndex === dayIndex);
  const todayScheduleText = todaySchedule ? todaySchedule.displayHours : '9:00 AM – 3:30 PM';

  return {
    isOpen,
    statusText,
    todayScheduleText,
    closesOrOpensText,
    isTodaySaturday: isSaturday,
  };
}

/**
 * Generates available 30-minute booking time slots for a given date
 * Sun–Fri: 9:00 to 15:00
 * Sat: 9:00 to 15:30
 */
export function getBookingSlotsForDate(selectedDate: Date): { time: string; available: boolean }[] {
  const dayIndex = selectedDate.getDay();
  const isSaturday = dayIndex === 6;
  const lastHour = isSaturday ? 15 : 15;
  const lastMinute = isSaturday ? 30 : 0;

  const slots: { time: string; available: boolean }[] = [];
  const now = getLondonNow();
  const isToday =
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate();

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let h = 9;
  let m = 0;

  while (true) {
    const slotTotalMinutes = h * 60 + m;
    const maxTotalMinutes = lastHour * 60 + lastMinute;

    if (slotTotalMinutes > maxTotalMinutes) break;

    const formattedTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    
    // If today, disable past time slots with 30 min buffer
    const isPast = isToday && slotTotalMinutes <= currentMinutes + 15;

    slots.push({
      time: formattedTime,
      available: !isPast,
    });

    m += 30;
    if (m >= 60) {
      h += 1;
      m = 0;
    }
  }

  return slots;
}
