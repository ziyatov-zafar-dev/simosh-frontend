
import React from 'react';
import { Product, Language } from '../types';

interface ProductCardProps {
  product: Product;
  lang: Language;
  quantity: number;
  onAddToCart: (p: Product) => void;
  onRemoveOne: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, lang, quantity, onAddToCart, onRemoveOne }) => {
  const labels = {
    uz: { price: 'Xarid Narxi', add: 'Xarid qilish' },
    ru: { price: 'Цена покупки', add: 'Купить' },
    tr: { price: 'Fiyat', add: 'Satın Al' },
    en: { price: 'Retail Price', add: 'Buy Now' }
  };

  const l = labels[lang] || labels['uz'];

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-[3rem] p-4 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden">
      {/* Image Wrapper */}
      <div className="relative aspect-[1/1] overflow-hidden rounded-[2.5rem] mb-6 bg-slate-50 dark:bg-slate-800">
        <img 
          src={product.image} 
          alt={product.name[lang]} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-500/10">
            {product.category}
          </span>
        </div>
      </div>

      <div className="px-3 pb-2 space-y-4 flex flex-col flex-1">
        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-1">
            {product.name[lang]}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2 h-10">
            {product.description[lang]}
          </p>
        </div>

        <div className="pt-4 mt-auto border-t border-slate-50 dark:border-white/5 space-y-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{l.price}</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
              {product.price.toLocaleString()} <span className="text-xs opacity-50 font-medium">UZS</span>
            </span>
          </div>

          <div className="w-full">
            {quantity > 0 ? (
              <div className="flex items-center justify-between bg-slate-100 dark:bg-white/5 p-1 rounded-full border border-slate-200 dark:border-white/10">
                <button 
                  onClick={() => onRemoveOne(product.id)}
                  className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full text-slate-900 dark:text-white hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <i className="fas fa-minus text-sm"></i>
                </button>
                <span className="text-lg font-black dark:text-white">{quantity}</span>
                <button 
                  onClick={() => onAddToCart(product)}
                  className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full text-slate-900 dark:text-white hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                >
                  <i className="fas fa-plus text-sm"></i>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onAddToCart(product)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-full flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 group/btn"
              >
                <i className="fas fa-shopping-basket text-sm group-hover/btn:rotate-6 transition-transform"></i>
                <span className="font-black uppercase tracking-widest text-[11px]">{l.add}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
