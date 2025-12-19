import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ProductCarousel } from './components/ProductCarousel';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AboutModal } from './components/AboutModal';
import { CartSidebar } from './components/CartSidebar';
import { CartProvider, useCart } from './contexts/CartContext';
import { supabase } from './lib/supabase';
import type { ProductWithVariants } from './lib/database.types';
import { Loader2, AlertCircle } from 'lucide-react';

function AppContent() {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithVariants | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('smartphones');
  const [showAbout, setShowAbout] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');

  const { clearCart } = useCart();

  // استعادة الإعدادات
  useEffect(() => {
    try {
      const savedDarkMode = localStorage.getItem('darkMode');
      const savedLanguage = localStorage.getItem('language');

      if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
      if (savedLanguage === 'fr' || savedLanguage === 'ar') {
        setLanguage(savedLanguage);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // جلب المنتجات
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category', selectedCategory)
        .order('is_featured', { ascending: false });

      if (productsError) throw productsError;

      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*');

      if (variantsError) throw variantsError;

      const productsWithVariants: ProductWithVariants[] = (productsData ?? []).map(
        (product) => ({
          ...product,
          variants: (variantsData ?? []).filter(
            (variant) => variant.product_id === product.id
          ),
        })
      );

      setProducts(productsWithVariants);
    } catch (err: any) {
      console.error('Supabase error:', err);
      setError(
        language === 'fr'
          ? 'Erreur lors du chargement des produits'
          : 'حدث خطأ أثناء تحميل المنتجات'
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  const toggleLanguage = () => {
    const newLang = language === 'fr' ? 'ar' : 'fr';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleCheckout = () => {
    setShowCart(false);
    clearCart();
  };

  const content = {
    fr: {
      loading: 'Chargement des produits...',
      errorTitle: 'Erreur de chargement',
      retry: 'Réessayer',
      noProducts: 'Aucun produit disponible pour le moment.',
    },
    ar: {
      loading: 'جاري تحميل المنتجات...',
      errorTitle: 'خطأ في التحميل',
      retry: 'أعد المحاولة',
      noProducts: 'لا توجد منتجات متاحة حالياً.',
    },
  };

  const t = content[language];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
            {t.loading}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {t.errorTitle}
          </h2>
          <p className={`mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {error}
          </p>
          <button
            onClick={fetchProducts}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        language={language}
        toggleLanguage={toggleLanguage}
        onAboutClick={() => setShowAbout(true)}
        onCartClick={() => setShowCart(true)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="pt-16 px-4">
        {products.length > 0 ? (
          <ProductCarousel
            products={products}
            onProductClick={setSelectedProduct}
            darkMode={darkMode}
            language={language}
          />
        ) : (
          <p className={`text-center py-10 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.noProducts}
          </p>
        )}
      </main>

      <WhatsAppButton darkMode={darkMode} language={language} />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        darkMode={darkMode}
        language={language}
      />

      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        darkMode={darkMode}
        language={language}
      />

      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        darkMode={darkMode}
        language={language}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
