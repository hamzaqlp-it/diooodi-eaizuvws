import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { ProductWithVariants } from '../lib/database.types';

interface ProductCarouselProps {
  products: ProductWithVariants[];
  onProductClick: (product: ProductWithVariants) => void;
  darkMode?: boolean;
  language?: 'fr' | 'ar';
}

export function ProductCarousel({ products, onProductClick, darkMode = false, language = 'fr' }: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollInterval: NodeJS.Timeout;
    let isPaused = false;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isPaused && container) {
          const maxScroll = container.scrollWidth - container.clientWidth;
          const currentScroll = container.scrollLeft;

          if (currentScroll >= maxScroll) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: 2, behavior: 'auto' });
          }
        }
      }, 30);
    };

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    startAutoScroll();

    return () => {
      clearInterval(scrollInterval);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => scroll('left')}
        className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center ${
          darkMode ? 'bg-slate-800/90 hover:bg-slate-700' : 'bg-white/90 hover:bg-slate-100'
        } ${
          darkMode ? 'text-white' : 'text-slate-900'
        } rounded-full shadow-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 -translate-x-6`}
        aria-label={language === 'fr' ? 'Précédent' : 'السابق'}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div
        ref={scrollContainerRef}
        className="hidden md:flex overflow-x-auto scrollbar-hide space-x-6 pb-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-none w-80">
            <ProductCard
              product={product}
              onClick={() => onProductClick(product)}
              darkMode={darkMode}
              language={language}
            />
          </div>
        ))}
      </div>

      <div className="md:hidden grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick(product)}
            darkMode={darkMode}
            language={language}
          />
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center ${
          darkMode ? 'bg-slate-800/90 hover:bg-slate-700' : 'bg-white/90 hover:bg-slate-100'
        } ${
          darkMode ? 'text-white' : 'text-slate-900'
        } rounded-full shadow-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 translate-x-6`}
        aria-label={language === 'fr' ? 'Suivant' : 'التالي'}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
