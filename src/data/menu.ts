/**
 * MESA Glasgow Menu Data
 * Signature dishes based on their actual Instagram creations,
 * with realistic indicative pricing (£3.20–£14.00).
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  category: 'breakfast' | 'brunch' | 'sandwiches' | 'sweet' | 'drinks';
  dietary?: ('V' | 'VG' | 'GF')[];
  dietaryNotes?: string;
  isSignature?: boolean;
  isHero?: boolean;
  imageKey?: string;
}

export interface MenuCategory {
  id: 'breakfast' | 'brunch' | 'sandwiches' | 'sweet' | 'drinks';
  name: string;
  tagline: string;
  imageKey: string;
}

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    tagline: 'Proper morning fuel, from classic Lorne rolls to full plates.',
    imageKey: 'fullBreakfast',
  },
  {
    id: 'brunch',
    name: 'Brunch',
    tagline: 'Artisan sourdough, whipped ricotta, and sizzling cast-iron skillets.',
    imageKey: 'tomatoToast',
  },
  {
    id: 'sandwiches',
    name: 'Sandwiches',
    tagline: 'Stuffed hot toasties on thick-cut sourdough with local artisan cheeses.',
    imageKey: 'slawSandwich',
  },
  {
    id: 'sweet',
    name: 'Sweet',
    tagline: 'Tall buttermilk stacks and brioche French toast with seasonal fruit.',
    imageKey: 'pancakes',
  },
  {
    id: 'drinks',
    name: 'Coffee & Drinks',
    tagline: 'Specialty roasts, silky microfoam, matcha, and freshly pressed juices.',
    imageKey: 'boothReel',
  },
];

export const MENU_ITEMS: MenuItem[] = [
  // --- BREAKFAST ---
  {
    id: 'morning-roll',
    name: 'The MESA Morning Roll',
    description: 'Square Lorne sausage, fried runny-yolk egg, melted cheddar & house sauce on a crusty Glasgow morning roll.',
    price: 5.5,
    formattedPrice: '£5.50',
    category: 'breakfast',
    isHero: true,
    isSignature: true,
    dietaryNotes: 'Veggie sausage available on request',
    imageKey: 'morningRoll',
  },
  {
    id: 'full-scottish',
    name: 'Full Scottish Breakfast',
    description: 'Two free-range eggs your way, Scottish black pudding, thick-cut ham, slow-simmered house beans, grilled mushrooms, toast & greens.',
    price: 13.5,
    formattedPrice: '£13.50',
    category: 'breakfast',
    isSignature: true,
    imageKey: 'fullBreakfast',
  },
  {
    id: 'lorne-and-bacon',
    name: 'Duke Street Double Roll',
    description: 'Lorne sausage, smoked Ayrshire streaky bacon, potato scone & caramelised onion butter.',
    price: 6.2,
    formattedPrice: '£6.20',
    category: 'breakfast',
  },
  {
    id: 'veggie-roll',
    name: 'Dennistoun Greens Roll',
    description: 'Spiced plant patty, hash brown crisp, fried egg, melted cheddar, and house red relish.',
    price: 5.8,
    formattedPrice: '£5.80',
    category: 'breakfast',
    dietary: ['V'],
  },

  // --- BRUNCH ---
  {
    id: 'tomato-ricotta-toast',
    name: 'Heritage Tomato & Whipped Ricotta Toast',
    description: 'Whipped salted ricotta, colourful heritage sliced tomatoes, cold-pressed olive oil, Maldon sea salt & fresh dill on griddled sourdough.',
    price: 8.5,
    formattedPrice: '£8.50',
    category: 'brunch',
    dietary: ['V'],
    isSignature: true,
    imageKey: 'tomatoToast',
  },
  {
    id: 'poached-eggs-crumb',
    name: 'Poached Eggs with Crispy Savoury Crumb',
    description: 'Two organic soft-poached eggs on toasted sourdough, blanketed in golden savoury herb-garlic crumb, chives & herb oil.',
    price: 9.0,
    formattedPrice: '£9.00',
    category: 'brunch',
    dietary: ['V'],
    isSignature: true,
    imageKey: 'eggsCrumb',
  },
  {
    id: 'baked-eggs-cast-iron',
    name: 'Cast Iron Baked Eggs',
    description: 'Two eggs gently baked in a bubbling rich tomato, red pepper & smoked paprika stew with herbs and thick grilled sourdough.',
    price: 11.5,
    formattedPrice: '£11.50',
    category: 'brunch',
    dietary: ['V', 'GF'],
    dietaryNotes: 'GF bread option available',
    isSignature: true,
    imageKey: 'bakedEggs',
  },
  {
    id: 'mushrooms-sourdough',
    name: 'Wild Garlic Butter Mushrooms',
    description: 'Pan-roasted king oyster & chestnut mushrooms, thyme, whipped goat cheese, and toasted sourdough.',
    price: 10.0,
    formattedPrice: '£10.00',
    category: 'brunch',
    dietary: ['V', 'VG', 'GF'],
    dietaryNotes: 'Vegan cheese available upon request',
  },

  // --- SANDWICHES ---
  {
    id: 'pulled-meat-slaw',
    name: 'Braised Pulled Meat & Red Slaw Toastie',
    description: 'Slow-cooked braised beef, pickled red cabbage slaw, crisp butterhead lettuce & garlic aioli on crusty toasted sourdough.',
    price: 11.0,
    formattedPrice: '£11.00',
    category: 'sandwiches',
    isSignature: true,
    imageKey: 'slawSandwich',
  },
  {
    id: 'ham-cheese-mustard',
    name: 'Ham, Gruyère & Mustard Toastie',
    description: 'Generously carved ham, melted Scottish mature cheddar, Gruyère and coarse stoneground mustard on thick-cut sourdough.',
    price: 9.5,
    formattedPrice: '£9.50',
    category: 'sandwiches',
    isSignature: true,
    imageKey: 'hamSandwich',
  },
  {
    id: 'tenement-special-sandwich',
    name: 'Street-Style Pulled Pork Melt',
    description: 'Tender pulled pork, house barbecue glaze, dill gherkins and molten double cheese grilled golden.',
    price: 10.5,
    formattedPrice: '£10.50',
    category: 'sandwiches',
    isSignature: true,
    imageKey: 'streetSandwich',
  },
  {
    id: 'roast-veg-focaccia',
    name: 'Roasted Pepper & Pesto Sandwich',
    description: 'Charred sweet peppers, grilled courgette, vegan walnut basil pesto, rocket and pine nuts on house focaccia.',
    price: 9.0,
    formattedPrice: '£9.00',
    category: 'sandwiches',
    dietary: ['VG'],
  },

  // --- SWEET ---
  {
    id: 'stacked-pancakes',
    name: 'Stacked Pancakes with Chocolate Crumb',
    description: 'Tower of fluffy buttermilk pancakes, dark cocoa cookie crumb, warm salted caramel drizzle & vanilla whipped cream.',
    price: 10.5,
    formattedPrice: '£10.50',
    category: 'sweet',
    dietary: ['V'],
    isSignature: true,
    imageKey: 'pancakes',
  },
  {
    id: 'french-toast-peaches',
    name: 'Brioche French Toast & Roasted Peaches',
    description: 'Custard-soaked golden brioche, oven-roasted caramelized peaches, wild blackberries, whipped mascarpone & maple syrup.',
    price: 11.0,
    formattedPrice: '£11.00',
    category: 'sweet',
    dietary: ['V'],
    isSignature: true,
    imageKey: 'peaches',
  },
  {
    id: 'granola-bowl',
    name: 'House Toasted Granola Bowl',
    description: 'Oat and pumpkin seed granola with Greek yoghurt, poached seasonal rhubarb, and local Scottish honey.',
    price: 7.2,
    formattedPrice: '£7.20',
    category: 'sweet',
    dietary: ['V', 'GF'],
  },

  // --- COFFEE & DRINKS ---
  {
    id: 'flat-white',
    name: 'Flat White',
    description: 'Double shot of seasonal specialty espresso with velvety microfoam.',
    price: 3.5,
    formattedPrice: '£3.50',
    category: 'drinks',
    dietary: ['VG'],
  },
  {
    id: 'oat-latte',
    name: 'Oat Milk Latte',
    description: 'Smooth double espresso with Minor Figures organic oat milk.',
    price: 3.8,
    formattedPrice: '£3.80',
    category: 'drinks',
    dietary: ['VG'],
  },
  {
    id: 'cortado',
    name: 'Cortado',
    description: 'Equal parts espresso and warm silky milk in an espresso tumbler.',
    price: 3.4,
    formattedPrice: '£3.40',
    category: 'drinks',
  },
  {
    id: 'batch-filter',
    name: 'Batch Brew Filter',
    description: 'Single-origin rotating African or Central American light roast.',
    price: 3.2,
    formattedPrice: '£3.20',
    category: 'drinks',
    dietary: ['VG'],
  },
  {
    id: 'iced-latte',
    name: 'Iced Latte',
    description: 'Double espresso poured over ice and cold milk of your choice.',
    price: 3.9,
    formattedPrice: '£3.90',
    category: 'drinks',
    dietary: ['VG'],
  },
  {
    id: 'matcha-latte',
    name: 'Uji Ceremonial Matcha Latte',
    description: 'Single-cultivar stoneground Japanese matcha whisked with steamed oat milk.',
    price: 4.2,
    formattedPrice: '£4.20',
    category: 'drinks',
    dietary: ['VG'],
  },
  {
    id: 'hot-chocolate',
    name: 'MESA Artisan Hot Chocolate',
    description: 'Real melted single-origin 70% dark chocolate steamed with whole milk and flaked salt.',
    price: 3.9,
    formattedPrice: '£3.90',
    category: 'drinks',
    dietary: ['V'],
  },
  {
    id: 'fresh-juice',
    name: 'Cold-Pressed Orange & Ginger Juice',
    description: 'Pressed Valencia oranges with fresh root ginger and lemon juice.',
    price: 3.8,
    formattedPrice: '£3.80',
    category: 'drinks',
    dietary: ['VG', 'GF'],
  },
];

export const MENU_SEASONAL_NOTE =
  'Menu changes with the seasons. Ask the team for today’s specials.';
