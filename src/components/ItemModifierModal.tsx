import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check } from 'lucide-react';
import { Product, ModifierOption } from '../data/products';
import { SelectedModifier, formatCurrency, useCart } from '../context/CartContext';
import { SmartImage } from './SmartImage';

interface ItemModifierModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemModifierModal: React.FC<ItemModifierModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addItem, openCartDrawer } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);

  // Initialize default options when product opens
  useEffect(() => {
    if (product?.modifierGroups) {
      const defaults: SelectedModifier[] = [];
      product.modifierGroups.forEach((group) => {
        if (group.options.length > 0) {
          defaults.push({
            groupId: group.id,
            groupName: group.name,
            option: group.options[0],
          });
        }
      });
      setSelectedModifiers(defaults);
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSelectOption = (
    groupId: string,
    groupName: string,
    option: ModifierOption
  ) => {
    setSelectedModifiers((prev) => {
      const filtered = prev.filter((item) => item.groupId !== groupId);
      return [...filtered, { groupId, groupName, option }];
    });
  };

  // Calculate live item price
  const basePricePence = Math.round(product.price * 100);
  const modPence = selectedModifiers.reduce(
    (sum, m) => sum + Math.round(m.option.priceModifier * 100),
    0
  );
  const unitPrice = (basePricePence + modPence) / 100;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedModifiers);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-[#1F2420]/60 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Sheet Container */}
        <motion.div
          className="relative w-full max-w-lg bg-[#FBF8F2] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col border border-[#2F3E2C]/10"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#2F3E2C]/10 bg-white/70">
            <h3 className="font-serif italic text-2xl text-[#2F3E2C]">
              Customise Item
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200/60 text-[#2F3E2C] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
            {/* Product summary */}
            <div className="flex gap-4 items-center pb-4 border-b border-[#2F3E2C]/10">
              {product.image ? (
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#2F3E2C]/10">
                  <SmartImage
                    src={product.image}
                    alt={product.alt || product.name}
                    aspectRatio="aspect-square"
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#4F6B47] to-[#2F3E2C] flex items-center justify-center shrink-0 text-[#FBF8F2]">
                  <img
                    src="/images/mesa-logo.png"
                    alt="MESA logo"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              )}

              <div>
                <h4 className="font-serif text-xl text-[#2F3E2C] leading-snug">
                  {product.name}
                </h4>
                <p className="text-xs text-stone-600 line-clamp-2 mt-0.5">
                  {product.description}
                </p>
                <span className="font-serif text-base font-semibold text-[#4F6B47] mt-1 block">
                  Base {formatCurrency(product.price)}
                </span>
              </div>
            </div>

            {/* Modifier Groups */}
            {product.modifierGroups?.map((group) => {
              const currentSelected = selectedModifiers.find(
                (m) => m.groupId === group.id
              );

              return (
                <div key={group.id} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#2F3E2C]">
                      {group.name}
                    </span>
                    {group.required && (
                      <span className="text-[10px] uppercase tracking-widest text-[#4F6B47] font-semibold bg-[#DCE5D3]/60 px-2 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.options.map((option) => {
                      const isSelected = currentSelected?.option.id === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            handleSelectOption(group.id, group.name, option)
                          }
                          className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#2F3E2C] text-[#FBF8F2] border-[#2F3E2C] shadow-xs'
                              : 'bg-white text-[#2F3E2C] border-[#2F3E2C]/10 hover:border-[#4F6B47]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'border-white bg-[#4F6B47]'
                                  : 'border-stone-300'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span className="font-medium">{option.name}</span>
                          </div>

                          {option.priceModifier > 0 && (
                            <span
                              className={`text-[11px] font-semibold ${
                                isSelected ? 'text-[#F4C9A8]' : 'text-[#4F6B47]'
                              }`}
                            >
                              +{formatCurrency(option.priceModifier)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Controls: Quantity Stepper & Add Button */}
          <div className="p-4 sm:p-5 border-t border-[#2F3E2C]/10 bg-white/80 flex items-center gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-2 bg-[#F6F1E7] border border-[#2F3E2C]/15 rounded-full p-1 shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-7 h-7 rounded-full bg-white text-[#2F3E2C] flex items-center justify-center hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-semibold tabular-nums text-[#2F3E2C]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-7 h-7 rounded-full bg-white text-[#2F3E2C] flex items-center justify-center hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart Button with Live Updating Price */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-[#4F6B47] to-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:from-[#2F3E2C] hover:to-[#4F6B47] transition-all shadow-md flex items-center justify-between cursor-pointer"
            >
              <span>Add to Cart</span>
              <span className="font-mono">{formatCurrency(totalPrice)}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
