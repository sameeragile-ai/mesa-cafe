/**
 * MESA Glasgow - Single Source of Truth for Navigation
 * Rendered across Desktop Navbar, Mobile Menu, and Footer.
 */

export interface NavItem {
  label: string;
  type: 'route' | 'section';
  route: string;
  sectionId?: 'story' | 'gallery' | 'visit';
  href: string; // Used for direct links / URL fragments
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    type: 'route',
    route: '/',
    href: '/',
  },
  {
    label: 'Menu',
    type: 'route',
    route: '/menu',
    href: '/menu',
  },
  {
    label: 'Order Online',
    type: 'route',
    route: '/order',
    href: '/order',
  },
  {
    label: 'Our Story',
    type: 'section',
    route: '/',
    sectionId: 'story',
    href: '/#story',
  },
  {
    label: 'Gallery',
    type: 'section',
    route: '/',
    sectionId: 'gallery',
    href: '/#gallery',
  },
  {
    label: 'Visit',
    type: 'section',
    route: '/',
    sectionId: 'visit',
    href: '/#visit',
  },
];
