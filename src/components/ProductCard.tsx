import type { ProductWithVariants } from '../lib/database.types';

interface ProductCardProps {
  product: ProductWithVariants;
  onClick: () => void;
  darkMode?: boolean;
  language?: 'fr' | 'ar';
}

export function ProductCard({ product, onClick, darkMode = false, language = 'fr' }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const uniqueColors = Array.from(
    new Set(product.variants.map(v => v.color_hex))
  ).slice(0, 4);

  const text = {
    fr: {
      new: 'Nouveau',
      from: 'À partir de',
      viewDetails: 'Voir détails',
    },
    ar: {
      new: 'جديد',
      from: 'ابتداءً من',
      viewDetails: 'عرض التفاصيل',
    },
  };

  const t = text[language];

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer ${
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      } rounded-2xl overflow-hidden border hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02]`}
    >
      <div className={`aspect-square ${
        darkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-slate-100 to-slate-200'
      } relative overflow-hidden`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {t.new}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
          {product.brand}
        </div>
        <h3 className={`text-lg font-bold ${
          darkMode ? 'text-white' : 'text-slate-900'
        } mb-2 line-clamp-1`}>
          {product.name}
        </h3>
        <p className={`text-sm ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        } mb-4 line-clamp-2`}>
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className={`text-xs ${
              darkMode ? 'text-slate-500' : 'text-slate-600'
            } mb-1`}>{t.from}</div>
            <div className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {formatPrice(product.base_price)}
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            {uniqueColors.map((hex, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full border-2 ${
                  darkMode ? 'border-slate-600' : 'border-slate-300'
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
            {product.variants.length > 4 && (
              <div className={`text-xs ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              } ml-1`}>
                +{product.variants.length - 4}
              </div>
            )}
          </div>
        </div>

        <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
          {t.viewDetails}
        </button>
      </div>
    </div>
  );
}
