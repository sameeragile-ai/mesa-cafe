/**
 * MESA Glasgow Image Assets
 * All images live in /public/images/ for reliable bundling and static deployment.
 */

export interface ImageAsset {
  src: string;
  alt: string;
  title: string;
  caption?: string;
  aspect?: string;
  objectPosition?: string;
}

export const LOGO_IMAGE = {
  src: '/images/mesa-logo.png',
  alt: 'MESA Glasgow logo',
  description: 'Circular badge with textured sage-green background and white architectural isometric M monogram'
};

export const IMAGES: Record<string, ImageAsset> = {
  logo: {
    src: '/images/mesa-logo.png',
    alt: 'MESA Glasgow official circular emblem',
    title: 'MESA Glasgow Logo',
  },
  founders: {
    src: '/images/founders.jpg',
    alt: 'The two friends behind MESA Glasgow outside the café on Duke Street',
    title: 'The Two Friends Behind MESA',
    caption: 'Duke Street, Dennistoun – founded with an ethos of generous, honest breakfasts.',
    objectPosition: 'center 20%',
  },
  tomatoToast: {
    src: '/images/tomato-toast.jpg',
    alt: 'Sourdough toast topped with whipped ricotta, heritage tomatoes and dill at MESA Glasgow',
    title: 'Heritage Tomato & Whipped Ricotta Toast',
    caption: 'Whipped ricotta, heritage sliced tomatoes, cold-pressed olive oil & garden dill on sourdough.',
    objectPosition: 'center center',
  },
  boothReel: {
    src: '/images/booth-reel.jpg',
    alt: 'Guests laughing in a wooden booth at MESA Glasgow café',
    title: 'Neighborhood Warmth in Dennistoun',
    caption: 'Cozy booths, good conversation, and proper coffee.',
    objectPosition: 'center center',
  },
  slawSandwich: {
    src: '/images/slaw-sandwich.jpg',
    alt: 'Toasted sandwich packed with pulled beef, red cabbage slaw and crisp lettuce',
    title: 'Braised Pulled Meat & Red Slaw Toastie',
    caption: 'Slow-cooked braised meat, crunchy red slaw, and melted cheese on griddled sourdough.',
    objectPosition: 'center center',
  },
  hamSandwich: {
    src: '/images/ham-sandwich.jpg',
    alt: 'Thick-cut ham, melted cheese and whole grain mustard toastie on sourdough',
    title: 'Ham, Gruyère & Grain Mustard Toastie',
    caption: 'Carved ham, molten cheese pull, and stoneground mustard on thick sourdough.',
    objectPosition: 'center center',
  },
  pancakes: {
    src: '/images/pancakes.jpg',
    alt: 'Stacked fluffy pancakes topped with dark chocolate crumb and salted caramel',
    title: 'Stacked Pancakes with Chocolate Crumb & Salted Caramel',
    caption: 'Fluffy buttermilk stack, rich salted caramel drip, whipped cream & dark chocolate crumb.',
    objectPosition: 'center center',
  },
  eggsCrumb: {
    src: '/images/eggs-crumb.jpg',
    alt: 'Poached eggs on sourdough with crispy golden savoury crumb at MESA Glasgow',
    title: 'Poached Eggs with Crispy Savoury Crumb',
    caption: 'Free-range poached eggs, herb oil, and golden sourdough crumb on grilled sourdough.',
    objectPosition: 'center center',
  },
  streetSandwich: {
    src: '/images/street-sandwich.jpg',
    alt: 'Halved pulled-meat toastie against the backdrop of Glasgow red sandstone tenements',
    title: 'Duke Street Pulled Meat Special',
    caption: 'East End comfort food against the iconic Glasgow tenement streetscape.',
    objectPosition: 'center center',
  },
  morningRoll: {
    src: '/images/morning-roll.jpg',
    alt: 'The MESA Morning Roll with Lorne sausage, runny egg, cheese and house brown sauce',
    title: 'The MESA Morning Roll',
    caption: 'The cult East End hero: square Lorne sausage, fried runny egg, cheddar & house sauce.',
    objectPosition: 'center 40%',
  },
  peaches: {
    src: '/images/peaches.jpg',
    alt: 'Brioche French toast with roasted caramelized peaches, blackberries and cream',
    title: 'Brioche French Toast with Roasted Peaches',
    caption: 'Caramelised summer peaches, fresh berries, mascarpone cream & pure maple syrup.',
    objectPosition: 'center center',
  },
  fullBreakfast: {
    src: '/images/full-breakfast.jpg',
    alt: 'Full Scottish breakfast with black pudding, eggs, bacon ham, beans and sourdough',
    title: 'The Full Scottish Breakfast',
    caption: 'Free-range eggs, Scottish black pudding, thick-cut ham, house beans, sourdough & greens.',
    objectPosition: 'center center',
  },
  bakedEggs: {
    src: '/images/baked-eggs.jpg',
    alt: 'Baked eggs in cast iron skillet with rich tomato sauce, feta and grilled sourdough',
    title: 'Skillet Baked Eggs & Sourdough',
    caption: 'Slow-simmered spiced tomatoes, crumbled feta, garden herbs, and toasted sourdough.',
    objectPosition: 'center center',
  },
};
