/**
 * MESA Glasgow Business Details
 * Exact verified information for MESA Glasgow in Dennistoun.
 */

export interface DayHours {
  day: string;
  dayShort: string;
  dayIndex: number; // 0 = Sunday, 1 = Monday, etc.
  openTime: string; // '09:00'
  closeTime: string; // '15:30' or '16:00'
  lastBookingTime: string;
  displayHours: string;
}

export const BUSINESS_INFO = {
  name: 'MESA Glasgow',
  wordmark: 'MESA',
  tagline: 'Proper breakfasts on Duke Street.',
  shortDescription:
    'Specialty coffee, loaded morning rolls and seasonal brunch plates crafted in Dennistoun, Glasgow.',
  subDescription:
    'Independent brunch café & specialty coffee spot run by two friends, serving generous, honest food at East End prices.',
  neighbourhood: 'Dennistoun, East End of Glasgow',
  address: '567 Duke St, Glasgow G31 1PY, United Kingdom',
  addressShort: '567 Duke St, Dennistoun, G31 1PY',
  postcode: 'G31 1PY',
  city: 'Glasgow',
  country: 'United Kingdom',
  phone: '+44 141 737 5011',
  phoneDisplay: '0141 737 5011',
  phoneTel: 'tel:+441417375011',
  email: 'hello@mesaglasgow.com',
  instagram: 'https://www.instagram.com/mesa_glasgow/',
  instagramHandle: '@mesa_glasgow',
  instagramFollowers: '21.3K',
  facebook: 'https://www.facebook.com/pages/category/Restaurant/Mesa-Glasgow-237756133844331',
  googleRating: 4.8,
  reviewCount: 520,
  priceRange: '£10–20 per person',
  typicalVisit: '30 min – 1.5 hrs',
  googleMapsQueryUrl: 'https://www.google.com/maps/search/?api=1&query=Mesa+567+Duke+St+Glasgow',
  googleMapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=567+Duke+St+Glasgow+G31+1PY',
  googleMapsEmbedUrl: 'https://www.google.com/maps?q=567+Duke+St,+Glasgow+G31+1PY&output=embed',
  foundersStory: 'Two friends who opened a neighbourhood café on Duke Street to serve the breakfast they’d want themselves: generous, honest, good value, made properly, with East End prices.',
  schedule: [
    {
      day: 'Monday',
      dayShort: 'Mon',
      dayIndex: 1,
      openTime: '09:00',
      closeTime: '15:30',
      lastBookingTime: '15:00',
      displayHours: '9:00 AM – 3:30 PM',
    },
    {
      day: 'Tuesday',
      dayShort: 'Tue',
      dayIndex: 2,
      openTime: '09:00',
      closeTime: '15:30',
      lastBookingTime: '15:00',
      displayHours: '9:00 AM – 3:30 PM',
    },
    {
      day: 'Wednesday',
      dayShort: 'Wed',
      dayIndex: 3,
      openTime: '09:00',
      closeTime: '15:30',
      lastBookingTime: '15:00',
      displayHours: '9:00 AM – 3:30 PM',
    },
    {
      day: 'Thursday',
      dayShort: 'Thu',
      dayIndex: 4,
      openTime: '09:00',
      closeTime: '15:30',
      lastBookingTime: '15:00',
      displayHours: '9:00 AM – 3:30 PM',
    },
    {
      day: 'Friday',
      dayShort: 'Fri',
      dayIndex: 5,
      openTime: '09:00',
      closeTime: '15:30',
      lastBookingTime: '15:00',
      displayHours: '9:00 AM – 3:30 PM',
    },
    {
      day: 'Saturday',
      dayShort: 'Sat',
      dayIndex: 6,
      openTime: '09:00',
      closeTime: '16:00',
      lastBookingTime: '15:30',
      displayHours: '9:00 AM – 4:00 PM',
    },
    {
      day: 'Sunday',
      dayShort: 'Sun',
      dayIndex: 0,
      openTime: '09:00',
      closeTime: '15:30',
      lastBookingTime: '15:00',
      displayHours: '9:00 AM – 3:30 PM',
    },
  ] as DayHours[],
};
