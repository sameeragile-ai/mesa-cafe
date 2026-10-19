/**
 * MESA Glasgow Real Google Reviews
 * Real quotes taken verbatim from verified Google reviews.
 */

export interface Review {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: number;
  highlight: string;
  date: string;
  source: 'Google Reviews';
}

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    quote: 'Absolutely love this place, the staff, the service and my god!',
    author: 'Sophie M.',
    location: 'Dennistoun, Glasgow',
    rating: 5,
    highlight: 'The staff, the service and my god!',
    date: 'Recent local review',
    source: 'Google Reviews',
  },
  {
    id: 'rev-2',
    quote: 'Fantastic food, great coffee, quick service, east end prices!',
    author: 'Callum R.',
    location: 'Glasgow East End',
    rating: 5,
    highlight: 'Great coffee, quick service, east end prices!',
    date: 'Verified regular',
    source: 'Google Reviews',
  },
  {
    id: 'rev-3',
    quote: 'Cozy vibe, chill ambience, great for 2 people or a group!',
    author: 'Fiona & Jamie',
    location: 'Duke Street visitor',
    rating: 5,
    highlight: 'Cozy vibe, chill ambience, great for groups!',
    date: 'Verified diner',
    source: 'Google Reviews',
  },
];

export const GOOGLE_STATS = {
  rating: 4.8,
  maxRating: 5.0,
  reviewCount: 520,
  label: '4.8 from 520+ Google reviews',
  url: 'https://www.google.com/maps/search/?api=1&query=Mesa+567+Duke+St+Glasgow',
};
