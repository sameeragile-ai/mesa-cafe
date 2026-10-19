/**
 * Generates an .ics calendar file for MESA Glasgow table reservation
 */
export function generateIcsFile({
  guestName,
  partySize,
  dateString,
  timeString,
}: {
  guestName: string;
  partySize: number;
  dateString: string; // YYYY-MM-DD
  timeString: string; // HH:mm
}) {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);

  const startDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  // Default booking window: 1.5 hours
  const endDate = new Date(startDate.getTime() + 90 * 60 * 1000);

  const formatIcsDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const startIcs = formatIcsDate(startDate);
  const endIcs = formatIcsDate(endDate);
  const stampIcs = formatIcsDate(new Date());

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MESA Glasgow//Table Reservation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:mesa-${Date.now()}@mesaglasgow.com`,
    `DTSTAMP:${stampIcs}`,
    `DTSTART:${startIcs}`,
    `DTEND:${endIcs}`,
    `SUMMARY:Table for ${partySize} at MESA Glasgow`,
    `DESCRIPTION:Reservation at MESA Glasgow for ${guestName} (${partySize} guests). Call +44 141 737 5011 if you need to adjust your arrival.`,
    'LOCATION:567 Duke St\\, Glasgow G31 1PY\\, United Kingdom',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `mesa-booking-${dateString}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
