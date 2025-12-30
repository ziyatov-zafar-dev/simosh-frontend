
import React from 'react';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ProductCardProps {
  product: Product;
  lang: Language;
  quantity: number;
  onAddToCart: (p: Product) => void;
  onRemoveOne: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, lang, quantity, onAddToCart, onRemoveOne }) => {
  const priceLabel = lang === 'ru' ? 'Цена' : lang === 'tr' ? 'Fiyat' : lang === 'en' ? 'Price' : 'Narxi';

  return (
    <div className="bg-white dark:bg-[#0b121d] rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-white/5 overflow-hidden group hover:shadow-[0_40px_100px_rgba(16,185,129,0.1)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full relative">
      <div className="relative h-72 lg:h-80 overflow-hidden m-4 rounded-[2.5rem]">
        <img src={product.image} alt={product.name[lang]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute top-5 left-5 z-20">
          <span className="px-5 py-2 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-xl rounded-full text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest shadow-lg">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-8 lg:p-10 flex flex-col flex-1">
        <div className="mb-6">
          <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter leading-tight">{product.name[lang]}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm lg:text-base font-medium line-clamp-2 leading-relaxed">{product.description[lang]}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-10">
          {product.benefits[lang].slice(0, 2).map((benefit, idx) => (
            <span key={idx} className="bg-emerald-500/5 text-emerald-600 dark:text-emerald-500 text-[10px] px-4 py-1.5 rounded-xl font-black uppercase tracking-widest border border-emerald-500/10">
              #{benefit}
            </span>
          ))}
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-8 border-t border-slate-50 dark:border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 dark:text-emerald-700 font-black uppercase tracking-widest mb-1">{priceLabel}</span>
            <span className="text-2xl lg:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
              {product.price.toLocaleString()} <span className="text-xs font-bold opacity-60">UZS</span>
            </span>
          </div>

          {quantity > 0 ? (
            <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-2xl p-1 shadow-inner border border-slate-100 dark:border-white/5">
              <button 
                onClick={() => onRemoveOne(product.id)}
                className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white bg-white dark:bg-white/10 rounded-xl shadow-sm hover:bg-emerald-500 hover:text-white transition-all font-black text-xl"
              >
                &minus;
              </button>
              <span className="px-4 text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                {quantity}
              </span>
              <button 
                onClick={() => onAddToCart(product)}
                className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white bg-white dark:bg-white/10 rounded-xl shadow-sm hover:bg-emerald-500 hover:text-white transition-all font-black text-xl"
              >
                +
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onAddToCart(product)} 
              className="w-16 h-16 bg-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-600/30"
            >
              <i className="fas fa-plus text-2xl"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
