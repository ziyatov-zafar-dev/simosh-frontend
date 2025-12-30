
import React from 'react';
import { Product, Language } from '../types';

interface ProductCardProps {
  product: Product;
  lang: Language;
  onAddToCart: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, lang, onAddToCart }) => {
  return (
    <div className="bg-white dark:bg-emerald-900/40 rounded-3xl shadow-sm border border-emerald-100 dark:border-emerald-800/50 overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <img src={product.image} alt={product.name[lang]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/95 dark:bg-emerald-900/95 backdrop-blur rounded-full text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase shadow-sm border border-emerald-100 dark:border-emerald-800">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-5 lg:p-6 flex flex-col flex-1">
        <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-emerald-50 mb-2 line-clamp-1">{product.name[lang]}</h3>
        <p className="text-slate-600 dark:text-emerald-200/70 text-sm font-medium mb-4 line-clamp-2 leading-relaxed">{product.description[lang]}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {product.benefits[lang].slice(0, 2).map((benefit, idx) => (
            <span key={idx} className="bg-emerald-100/50 dark:bg-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-[10px] px-2.5 py-1 rounded-lg font-black border border-emerald-200/50 dark:border-emerald-700/50">
              #{benefit}
            </span>
          ))}
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-emerald-100 dark:border-emerald-800/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 dark:text-emerald-400/50 uppercase font-black">Narxi</span>
            <span className="text-base lg:text-lg font-black text-emerald-800 dark:text-emerald-400">
              {product.price.toLocaleString()} <span className="text-xs font-bold">UZS</span>
            </span>
          </div>
          <button 
            onClick={() => onAddToCart(product)} 
            className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none active:scale-90"
          >
            <i className="fas fa-plus lg:text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
