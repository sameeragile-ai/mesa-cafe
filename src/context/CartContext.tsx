import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Product, ModifierOption } from '../data/products';

export interface SelectedModifier {
  groupId: string;
  groupName: string;
  option: ModifierOption;
}

export interface CartItem {
  id: string; // Unique key generated from productId + selected options
  product: Product;
  quantity: number;
  selectedModifiers: SelectedModifier[];
  itemUnitPrice: number; // Base price + modifier additions
  totalPrice: number; // itemUnitPrice * quantity
}

interface CartState {
  items: CartItem[];
  orderNote: string;
}

type CartAction =
  | {
      type: 'ADD_ITEM';
      payload: {
        product: Product;
        quantity: number;
        modifiers: SelectedModifier[];
      };
    }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'INCREASE_QUANTITY'; payload: { id: string } }
  | { type: 'DECREASE_QUANTITY'; payload: { id: string } }
  | { type: 'SET_ORDER_NOTE'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE_CART'; payload: CartState };

// Helper to format currency accurately using en-GB GBP
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Generate unique line item ID
export function generateCartItemId(
  productId: string,
  modifiers: SelectedModifier[]
): string {
  if (!modifiers || modifiers.length === 0) return productId;
  const modKey = modifiers
    .slice()
    .sort((a, b) => a.groupId.localeCompare(b.groupId))
    .map((m) => `${m.groupId}:${m.option.id}`)
    .join('|');
  return `${productId}_${modKey}`;
}

// Calculate price in integer pence
function calculateUnitPrice(
  basePrice: number,
  modifiers: SelectedModifier[]
): number {
  const basePence = Math.round(basePrice * 100);
  const modPence = modifiers.reduce(
    (acc, m) => acc + Math.round(m.option.priceModifier * 100),
    0
  );
  return (basePence + modPence) / 100;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, modifiers } = action.payload;
      const itemId = generateCartItemId(product.id, modifiers);
      const unitPrice = calculateUnitPrice(product.price, modifiers);

      const existingIndex = state.items.findIndex((item) => item.id === itemId);

      let newItems: CartItem[];
      if (existingIndex > -1) {
        newItems = [...state.items];
        const existing = newItems[existingIndex];
        const newQty = existing.quantity + quantity;
        const totalPence = Math.round(unitPrice * 100) * newQty;
        newItems[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: totalPence / 100,
        };
      } else {
        const totalPence = Math.round(unitPrice * 100) * quantity;
        newItems = [
          ...state.items,
          {
            id: itemId,
            product,
            quantity,
            selectedModifiers: modifiers,
            itemUnitPrice: unitPrice,
            totalPrice: totalPence / 100,
          },
        ];
      }
      return { ...state, items: newItems };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    case 'INCREASE_QUANTITY': {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === action.payload.id) {
            const newQty = item.quantity + 1;
            const totalPence = Math.round(item.itemUnitPrice * 100) * newQty;
            return {
              ...item,
              quantity: newQty,
              totalPrice: totalPence / 100,
            };
          }
          return item;
        }),
      };
    }

    case 'DECREASE_QUANTITY': {
      return {
        ...state,
        items: state.items
          .map((item) => {
            if (item.id === action.payload.id) {
              const newQty = item.quantity - 1;
              if (newQty <= 0) return null;
              const totalPence = Math.round(item.itemUnitPrice * 100) * newQty;
              return {
                ...item,
                quantity: newQty,
                totalPrice: totalPence / 100,
              };
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
      };
    }

    case 'SET_ORDER_NOTE': {
      return { ...state, orderNote: action.payload };
    }

    case 'CLEAR_CART': {
      return { items: [], orderNote: '' };
    }

    case 'HYDRATE_CART': {
      return action.payload;
    }

    default:
      return state;
  }
}

const LOCAL_STORAGE_KEY = 'mesa_cart_v1';

interface CartContextValue {
  items: CartItem[];
  orderNote: string;
  totalItemsCount: number;
  subtotal: number;
  subtotalFormatted: string;
  isCartDrawerOpen: boolean;
  activeToast: string | null;
  modifierModalProduct: Product | null;
  isModifierModalOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  openModifierModal: (product: Product) => void;
  closeModifierModal: () => void;
  addItem: (
    product: Product,
    quantity?: number,
    modifiers?: SelectedModifier[]
  ) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  setOrderNote: (note: string) => void;
  clearCart: () => void;
  dismissToast: () => void;
  getItemQuantity: (productId: string) => number;
  handleAddToCartWithModifiers: (product: Product) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    orderNote: '',
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [modifierModalProduct, setModifierModalProduct] = useState<Product | null>(null);

  // Hydrate from localStorage on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.items)) {
          dispatch({ type: 'HYDRATE_CART', payload: parsed });
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved cart from localStorage:', e);
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [state]);

  const totalItemsCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Integer pence calculation for subtotal
  const totalPence = state.items.reduce(
    (sum, item) => sum + Math.round(item.itemUnitPrice * 100) * item.quantity,
    0
  );
  const subtotal = totalPence / 100;
  const subtotalFormatted = formatCurrency(subtotal);

  const addItem = (
    product: Product,
    quantity = 1,
    modifiers: SelectedModifier[] = []
  ) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity, modifiers },
    });

    // Show toast
    setActiveToast(`${product.name} added to cart`);
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const increaseQuantity = (id: string) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: { id } });
  };

  const decreaseQuantity = (id: string) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: { id } });
  };

  const setOrderNote = (note: string) => {
    dispatch({ type: 'SET_ORDER_NOTE', payload: note });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (productId: string) => {
    return state.items
      .filter((item) => item.product.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const dismissToast = () => setActiveToast(null);

  const openModifierModal = (product: Product) => {
    setModifierModalProduct(product);
  };

  const closeModifierModal = () => {
    setModifierModalProduct(null);
  };

  const handleAddToCartWithModifiers = (product: Product) => {
    if (product.modifierGroups && product.modifierGroups.length > 0) {
      openModifierModal(product);
    } else {
      addItem(product, 1, []);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        orderNote: state.orderNote,
        totalItemsCount,
        subtotal,
        subtotalFormatted,
        isCartDrawerOpen,
        activeToast,
        modifierModalProduct,
        isModifierModalOpen: !!modifierModalProduct,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        openModifierModal,
        closeModifierModal,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        setOrderNote,
        clearCart,
        dismissToast,
        getItemQuantity,
        handleAddToCartWithModifiers,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
