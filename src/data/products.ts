/**
 * MESA Glasgow - Online Ordering & Retail Products
 * NOTE: All prices below are indicative placeholders and can be adjusted anytime.
 * Prices are stored in GBP (number) and formatted dynamically.
 */

import { IMAGES } from './images';

export interface ModifierOption {
  id: string;
  name: string;
  priceModifier: number; // e.g. 0.50 for +50p, 0 for default
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  options: ModifierOption[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'brunch' | 'sandwiches' | 'sweet' | 'drinks' | 'retail';
  categoryLabel: string;
  dietary?: ('V' | 'VG' | 'GF')[];
  image?: string;
  alt?: string;
  isRetail?: boolean;
  isPopular?: boolean;
  modifierGroups?: ModifierGroup[];
}

// Common Modifiers
const COFFEE_MODIFIERS: ModifierGroup[] = [
  {
    id: 'milk',
    name: 'Milk Choice',
    required: true,
    options: [
      { id: 'whole', name: 'Whole Milk', priceModifier: 0 },
      { id: 'oat', name: 'Organic Oat Milk', priceModifier: 0.5 },
      { id: 'soy', name: 'Soy Milk', priceModifier: 0.5 },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    required: false,
    options: [
      { id: 'reg', name: 'Regular (8oz)', priceModifier: 0 },
      { id: 'large', name: 'Large (12oz)', priceModifier: 0.6 },
    ],
  },
  {
    id: 'shot',
    name: 'Espresso',
    required: false,
    options: [
      { id: 'single', name: 'Standard Double Shot', priceModifier: 0 },
      { id: 'extra', name: 'Add Extra Espresso Shot', priceModifier: 0.7 },
      { id: 'decaf', name: 'Decaf Blend', priceModifier: 0 },
    ],
  },
];

const BREAD_FOOD_MODIFIERS: ModifierGroup[] = [
  {
    id: 'bread',
    name: 'Bread Choice',
    required: false,
    options: [
      { id: 'sourdough', name: 'Standard Sourdough', priceModifier: 0 },
      { id: 'gf-bread', name: 'Gluten-Free Bread', priceModifier: 1.0 },
    ],
  },
  {
    id: 'extras',
    name: 'Add Extras',
    required: false,
    options: [
      { id: 'none', name: 'No extras', priceModifier: 0 },
      { id: 'bacon', name: 'Add Smoked Ayrshire Bacon', priceModifier: 2.0 },
      { id: 'halloumi', name: 'Add Grilled Halloumi', priceModifier: 2.5 },
    ],
  },
];

const COFFEE_BEANS_MODIFIERS: ModifierGroup[] = [
  {
    id: 'grind',
    name: 'Grind Type',
    required: true,
    options: [
      { id: 'whole', name: 'Whole Bean', priceModifier: 0 },
      { id: 'filter', name: 'Filter / Aeropress Grind', priceModifier: 0 },
      { id: 'espresso', name: 'Fine Espresso Grind', priceModifier: 0 },
    ],
  },
];

const GIFT_CARD_MODIFIERS: ModifierGroup[] = [
  {
    id: 'amount',
    name: 'Gift Card Value',
    required: true,
    options: [
      { id: '10', name: '£10 Digital Voucher', priceModifier: 0 },
      { id: '25', name: '£25 Digital Voucher', priceModifier: 15.0 },
      { id: '50', name: '£50 Digital Voucher', priceModifier: 40.0 },
    ],
  },
];

export const PRODUCTS: Product[] = [
  // --- BREAKFAST ---
  {
    id: 'morning-roll',
    name: 'The MESA Morning Roll',
    description: 'Square Lorne sausage, fried runny-yolk egg, melted cheddar & house sauce on a crusty roll.',
    price: 5.5,
    category: 'breakfast',
    categoryLabel: 'Breakfast',
    image: IMAGES.morningRoll.src,
    alt: IMAGES.morningRoll.alt,
    isPopular: true,
    modifierGroups: BREAD_FOOD_MODIFIERS,
  },
  {
    id: 'full-scottish',
    name: 'Full Scottish Breakfast',
    description: 'Free-range eggs, Scottish black pudding, thick-cut ham, house beans, mushrooms & sourdough.',
    price: 13.5,
    category: 'breakfast',
    categoryLabel: 'Breakfast',
    image: IMAGES.fullBreakfast.src,
    alt: IMAGES.fullBreakfast.alt,
    isPopular: true,
    modifierGroups: [
      {
        id: 'extras',
        name: 'Extras',
        required: false,
        options: [
          { id: 'none', name: 'Standard Full Scottish', priceModifier: 0 },
          { id: 'halloumi', name: 'Add Grilled Halloumi', priceModifier: 2.5 },
          { id: 'extra-toast', name: 'Extra Buttered Sourdough', priceModifier: 1.5 },
        ],
      },
    ],
  },
  {
    id: 'duke-st-double-roll',
    name: 'Duke Street Double Roll',
    description: 'Lorne sausage, smoked Ayrshire bacon, potato scone & caramelised onion butter on a crusty roll.',
    price: 6.2,
    category: 'breakfast',
    categoryLabel: 'Breakfast',
    modifierGroups: BREAD_FOOD_MODIFIERS,
  },
  {
    id: 'dennistoun-greens-roll',
    name: 'Dennistoun Greens Roll',
    description: 'Spiced plant patty, hash brown crisp, fried egg, melted cheddar & house red relish.',
    price: 5.8,
    category: 'breakfast',
    categoryLabel: 'Breakfast',
    dietary: ['V'],
    modifierGroups: BREAD_FOOD_MODIFIERS,
  },

  // --- BRUNCH ---
  {
    id: 'tomato-ricotta-toast',
    name: 'Heritage Tomato & Whipped Ricotta Toast',
    description: 'Whipped salted ricotta, colourful heritage tomatoes, cold-pressed olive oil & fresh dill on sourdough.',
    price: 8.5,
    category: 'brunch',
    categoryLabel: 'Brunch',
    dietary: ['V'],
    image: IMAGES.tomatoToast.src,
    alt: IMAGES.tomatoToast.alt,
    isPopular: true,
    modifierGroups: BREAD_FOOD_MODIFIERS,
  },
  {
    id: 'poached-eggs-crumb',
    name: 'Poached Eggs with Crispy Savoury Crumb',
    description: 'Two soft poached eggs blanketed in golden savoury herb-garlic crumb & herb oil on sourdough.',
    price: 9.0,
    category: 'brunch',
    categoryLabel: 'Brunch',
    dietary: ['V'],
    image: IMAGES.eggsCrumb.src,
    alt: IMAGES.eggsCrumb.alt,
    isPopular: true,
    modifierGroups: BREAD_FOOD_MODIFIERS,
  },
  {
    id: 'baked-eggs-cast-iron',
    name: 'Cast Iron Baked Eggs',
    description: 'Baked eggs in bubbling spiced tomato, red pepper stew, crumbled feta & thick grilled sourdough.',
    price: 11.5,
    category: 'brunch',
    categoryLabel: 'Brunch',
    dietary: ['V', 'GF'],
    image: IMAGES.bakedEggs.src,
    alt: IMAGES.bakedEggs.alt,
    modifierGroups: BREAD_FOOD_MODIFIERS,
  },
  {
    id: 'mushrooms-sourdough',
    name: 'Wild Garlic Butter Mushrooms',
    description: 'Pan-roasted king oyster & chestnut mushrooms, thyme, whipped goat cheese & toasted sourdough.',
    price: 10.0,
    category: 'brunch',
    categoryLabel: 'Brunch',
    dietary: ['V', 'VG', 'GF'],
    modifierGroups: BREAD_FOOD_MODIFIERS,
  },

  // --- SANDWICHES ---
  {
    id: 'pulled-meat-slaw',
    name: 'Braised Pulled Meat & Red Slaw Toastie',
    description: 'Slow-cooked braised beef, pickled red cabbage slaw, crisp lettuce & garlic aioli on griddled sourdough.',
    price: 11.0,
    category: 'sandwiches',
    categoryLabel: 'Sandwiches',
    image: IMAGES.slawSandwich.src,
    alt: IMAGES.slawSandwich.alt,
    isPopular: true,
    modifierGroups: BREAD_FOOD_MODIFIERS,
  },
  {
    id: 'ham-cheese-mustard',
    name: 'Ham, Gruyère & Mustard Toastie',
    description: 'Carved ham, melted Scottish mature cheddar, Gruyère and wholegrain mustard on thick-cut sourdough.',
    price: 9.5,
    category: 'sandwiches',
    categoryLabel: 'Sandwiches',
    image: IMAGES.hamSandwich.src,
    alt: IMAGES.hamSandwich.alt,
    modifierGroups: BREAD_FOOD_MODIFIERS,
  },
  {
    id: 'street-pulled-pork',
    name: 'Street-Style Pulled Pork Melt',
    description: 'Juicy slow-cooked barbecue pork, dill gherkins & molten double cheese on crusty bread.',
    price: 10.5,
    category: 'sandwiches',
    categoryLabel: 'Sandwiches',
    image: IMAGES.streetSandwich.src,
    alt: IMAGES.streetSandwich.alt,
    modifierGroups: BREAD_FOOD_MODIFIERS,
  },
  {
    id: 'roast-veg-focaccia',
    name: 'Roasted Pepper & Pesto Sandwich',
    description: 'Charred sweet peppers, grilled courgette, vegan walnut basil pesto & rocket on focaccia.',
    price: 9.0,
    category: 'sandwiches',
    categoryLabel: 'Sandwiches',
    dietary: ['VG'],
  },

  // --- SWEET ---
  {
    id: 'stacked-pancakes',
    name: 'Stacked Pancakes with Chocolate Crumb',
    description: 'Fluffy buttermilk pancakes, dark chocolate crumb, salted caramel drizzle & whipped cream.',
    price: 10.5,
    category: 'sweet',
    categoryLabel: 'Sweet',
    dietary: ['V'],
    image: IMAGES.pancakes.src,
    alt: IMAGES.pancakes.alt,
    isPopular: true,
  },
  {
    id: 'french-toast-peaches',
    name: 'Brioche French Toast & Roasted Peaches',
    description: 'Golden custard brioche, roasted caramelized peaches, blackberries, mascarpone & pure maple.',
    price: 11.0,
    category: 'sweet',
    categoryLabel: 'Sweet',
    dietary: ['V'],
    image: IMAGES.peaches.src,
    alt: IMAGES.peaches.alt,
  },
  {
    id: 'granola-bowl',
    name: 'House Toasted Granola Bowl',
    description: 'Oat & pumpkin seed granola, Greek yoghurt, poached rhubarb & Scottish honey.',
    price: 7.2,
    category: 'sweet',
    categoryLabel: 'Sweet',
    dietary: ['V', 'GF'],
  },

  // --- COFFEE & DRINKS ---
  {
    id: 'flat-white',
    name: 'Flat White',
    description: 'Specialty double espresso roast with silky microfoam.',
    price: 3.5,
    category: 'drinks',
    categoryLabel: 'Coffee & Drinks',
    dietary: ['VG'],
    modifierGroups: COFFEE_MODIFIERS,
  },
  {
    id: 'oat-latte',
    name: 'Oat Milk Latte',
    description: 'Double espresso with Minor Figures organic oat milk.',
    price: 3.8,
    category: 'drinks',
    categoryLabel: 'Coffee & Drinks',
    dietary: ['VG'],
    modifierGroups: COFFEE_MODIFIERS,
  },
  {
    id: 'cortado',
    name: 'Cortado',
    description: 'Equal parts rich espresso and warm textured milk.',
    price: 3.4,
    category: 'drinks',
    categoryLabel: 'Coffee & Drinks',
    modifierGroups: COFFEE_MODIFIERS,
  },
  {
    id: 'batch-filter',
    name: 'Single Origin Batch Filter',
    description: 'Rotating seasonal African or Central American light roast filter.',
    price: 3.2,
    category: 'drinks',
    categoryLabel: 'Coffee & Drinks',
    dietary: ['VG'],
  },
  {
    id: 'iced-latte',
    name: 'Iced Latte',
    description: 'Double espresso poured over ice and your choice of milk.',
    price: 3.9,
    category: 'drinks',
    categoryLabel: 'Coffee & Drinks',
    dietary: ['VG'],
    modifierGroups: COFFEE_MODIFIERS,
  },
  {
    id: 'matcha-latte',
    name: 'Ceremonial Matcha Latte',
    description: 'Single-cultivar stoneground Uji matcha whisked with steamed oat milk.',
    price: 4.2,
    category: 'drinks',
    categoryLabel: 'Coffee & Drinks',
    dietary: ['VG'],
    modifierGroups: COFFEE_MODIFIERS,
  },
  {
    id: 'hot-chocolate',
    name: 'MESA Artisan Hot Chocolate',
    description: 'Melted 70% dark chocolate steamed with velvety milk & sea salt.',
    price: 3.9,
    category: 'drinks',
    categoryLabel: 'Coffee & Drinks',
    dietary: ['V'],
    modifierGroups: COFFEE_MODIFIERS,
  },
  {
    id: 'fresh-juice',
    name: 'Cold-Pressed Orange & Ginger Juice',
    description: 'Freshly squeezed Valencia oranges, crushed ginger & lemon.',
    price: 3.8,
    category: 'drinks',
    categoryLabel: 'Coffee & Drinks',
    dietary: ['VG', 'GF'],
  },

  // --- RETAIL: MESA AT HOME ---
  {
    id: 'mesa-beans-250g',
    name: 'MESA House Blend Coffee Beans (250g)',
    description: 'Our signature Duke Street roast. Notes of milk chocolate, toasted hazelnut, and sweet stone fruit.',
    price: 11.0,
    category: 'retail',
    categoryLabel: 'MESA at Home',
    isRetail: true,
    isPopular: true,
    modifierGroups: COFFEE_BEANS_MODIFIERS,
  },
  {
    id: 'mesa-tote-bag',
    name: 'MESA Heavyweight Canvas Tote Bag',
    description: '100% organic unbleached cotton tote with the embroidered sage green MESA architectural emblem.',
    price: 12.0,
    category: 'retail',
    categoryLabel: 'MESA at Home',
    isRetail: true,
  },
  {
    id: 'mesa-reusable-cup',
    name: 'MESA Ceramic & Cork Reusable Cup (12oz)',
    description: 'Matte sage ceramic travel mug with natural Portuguese cork grip band and spill-proof lid.',
    price: 14.0,
    category: 'retail',
    categoryLabel: 'MESA at Home',
    isRetail: true,
  },
  {
    id: 'mesa-gift-card',
    name: 'MESA Digital Gift Card',
    description: 'The gift of proper East End breakfasts. Valid for all food, specialty coffee, and retail in-store.',
    price: 10.0,
    category: 'retail',
    categoryLabel: 'MESA at Home',
    isRetail: true,
    modifierGroups: GIFT_CARD_MODIFIERS,
  },
];

export const PRODUCT_CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'brunch', label: 'Brunch' },
  { id: 'sandwiches', label: 'Sandwiches' },
  { id: 'sweet', label: 'Sweet' },
  { id: 'drinks', label: 'Coffee & Drinks' },
  { id: 'retail', label: 'MESA at Home' },
];
