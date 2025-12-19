import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ProductCarousel } from './components/ProductCarousel';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AboutModal } from './components/AboutModal';
import { CartSidebar } from './components/CartSidebar';
import { CartProvider, useCart } from './contexts/CartContext';
// import { supabase } from './lib/supabase';
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

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedLanguage = localStorage.getItem('language');

    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
    if (savedLanguage) setLanguage(savedLanguage as 'fr' | 'ar');
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

 const fetchProducts = async () => {
  setLoading(false);
  setProducts([]);
};

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category', selectedCategory)
        .order('is_featured', { ascending: false });

      if (productsError) {
        console.error('Products error:', productsError);
        throw new Error(language === 'fr' ? 'Erreur lors du chargement des produits' : 'خطأ في تحميل المنتجات');
      }

      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*');

      if (variantsError) {
        console.error('Variants error:', variantsError);
        throw new Error(language === 'fr' ? 'Erreur lors du chargement des variantes' : 'خطأ في تحميل المتغيرات');
      }

      const productsWithVariants: ProductWithVariants[] = (productsData || []).map(product => ({
        ...product,
        variants: (variantsData || []).filter(variant => variant.product_id === product.id),
      }));

      setProducts(productsWithVariants);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : (language === 'fr' ? 'Une erreur est survenue' : 'حدث خطأ'));
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
      title: 'Les Meilleurs Smartphones',
      titleAccent: 'au Maroc',
      subtitle: 'Découvrez notre sélection exclusive de smartphones premium avec garantie officielle',
      shippingTitle: 'Information importante sur la livraison',
      shippingText: 'Frais de livraison à partir de 100 DH. Livraison en 24-72h partout au Maroc. Les frais doivent être payés avant l\'expédition. Le solde restant est dû à la livraison du produit.',
      featuredTitle: 'Nouveautés & Coups de Cœur',
      featuredSubtitle: 'Les derniers modèles des plus grandes marques',
      warranty: 'Garantie Officielle',
      warrantyText: '2 ans de garantie constructeur sur tous nos produits',
      delivery: 'Livraison Rapide',
      deliveryText: 'Livraison partout au Maroc en 24-72h',
      payment: 'Paiement Sécurisé',
      paymentText: 'Plusieurs options de paiement 100% sécurisées',
      whyUs: 'Pourquoi choisir TechMorocco ?',
      whyUsText: 'Leader dans la vente de smartphones au Maroc, nous vous garantissons des produits 100% authentiques, un service client réactif et une expérience d\'achat exceptionnelle. Tous nos appareils sont testés et certifiés avant expédition.',
      footer: '© 2024 TechMorocco. Tous droits réservés.',
      footerText: 'Votre partenaire de confiance pour l\'achat de smartphones au Maroc',
      loading: 'Chargement des produits...',
      errorTitle: 'Erreur de chargement',
      retry: 'Réessayer',
      noProducts: 'Aucun produit disponible dans cette catégorie pour le moment.',
    },
    ar: {
      title: 'أفضل الهواتف الذكية',
      titleAccent: 'في المغرب',
      subtitle: 'اكتشف مجموعتنا الحصرية من الهواتف الذكية المتميزة مع ضمان رسمي',
      shippingTitle: 'معلومات مهمة عن التوصيل',
      shippingText: 'رسوم التوصيل تبدأ من 100 درهم. التوصيل خلال 24-72 ساعة في جميع أنحاء المغرب. يجب دفع الرسوم قبل الشحن. يدفع الرصيد المتبقي عند تسليم المنتج.',
      featuredTitle: 'جديد ومميز',
      featuredSubtitle: 'أحدث الموديلات من أكبر العلامات التجارية',
      warranty: 'ضمان رسمي',
      warrantyText: 'ضمان الشركة المصنعة لمدة سنتين على جميع منتجاتنا',
      delivery: 'توصيل سريع',
      deliveryText: 'التوصيل في جميع أنحاء المغرب خلال 24-72 ساعة',
      payment: 'دفع آمن',
      paymentText: 'خيارات دفع متعددة آمنة 100٪',
      whyUs: 'لماذا تختار TechMorocco؟',
      whyUsText: 'رائدون في بيع الهواتف الذكية في المغرب، نضمن لك منتجات أصلية 100٪، خدمة عملاء سريعة الاستجابة وتجربة تسوق استثنائية. يتم اختبار جميع أجهزتنا والتحقق منها قبل الشحن.',
      footer: '© 2024 TechMorocco. جميع الحقوق محفوظة.',
      footerText: 'شريكك الموثوق لشراء الهواتف الذكية في المغرب',
      loading: 'جاري تحميل المنتجات...',
      errorTitle: 'خطأ في التحميل',
      retry: 'أعد المحاولة',
      noProducts: 'لا توجد منتجات متاحة في هذه الفئة في الوقت الحالي.',
    },
  };

  const t = content[language];

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'} flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'} flex items-center justify-center p-4`}>
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {t.errorTitle}
          </h2>
          <p className={`mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
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

      <main className="pt-16">
        <section className={`relative ${
          darkMode ? 'bg-gradient-to-b from-slate-900 to-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'
        } py-20 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
          {darkMode && (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.08),transparent_50%)]" />
            </>
          )}

          <div className="relative max-w-7xl mx-auto text-center mb-16">
            <h1 className={`text-5xl md:text-6xl font-bold ${
              darkMode ? 'text-white' : 'text-slate-900'
            } mb-6 leading-tight`}>
              {t.title}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {t.titleAccent}
              </span>
            </h1>
            <p className={`text-xl ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            } max-w-2xl mx-auto`}>
              {t.subtitle}
            </p>
          </div>

          <div className="relative max-w-7xl mx-auto mb-12">
            <div className={`bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6 ${
              darkMode ? 'backdrop-blur-sm' : 'bg-orange-50/50'
            }`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${
                    darkMode ? 'text-orange-300' : 'text-orange-800'
                  } mb-2`}>
                    {t.shippingTitle}
                  </h3>
                  <p className={`${
                    darkMode ? 'text-slate-200' : 'text-orange-900'
                  } leading-relaxed`}>
                    <span className="font-semibold">{t.shippingText}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto" id="featured">
            <div className="mb-8">
              <h2 className={`text-2xl md:text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              } mb-2`}>
                {t.featuredTitle}
              </h2>
              <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                {t.featuredSubtitle}
              </p>
            </div>
            {products.length > 0 ? (
              <ProductCarousel
                products={products}
                onProductClick={setSelectedProduct}
                darkMode={darkMode}
                language={language}
              />
            ) : (
              <div className={`text-center py-12 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <p className="text-lg">{t.noProducts}</p>
              </div>
            )}
          </div>
        </section>

        <section className={`py-16 px-4 sm:px-6 lg:px-8 ${
          darkMode ? 'bg-slate-950' : 'bg-slate-50'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className={`text-center p-8 ${
                darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'
              } rounded-xl`}>
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                } mb-2`}>{t.warranty}</h3>
                <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{t.warrantyText}</p>
              </div>

              <div className={`text-center p-8 ${
                darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'
              } rounded-xl`}>
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                } mb-2`}>{t.delivery}</h3>
                <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{t.deliveryText}</p>
              </div>

              <div className={`text-center p-8 ${
                darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'
              } rounded-xl`}>
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                } mb-2`}>{t.payment}</h3>
                <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{t.paymentText}</p>
              </div>
            </div>

            <div className="text-center">
              <h2 className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              } mb-4`}>
                {t.whyUs}
              </h2>
              <p className={`${
                darkMode ? 'text-slate-300' : 'text-slate-600'
              } max-w-3xl mx-auto leading-relaxed`}>
                {t.whyUsText}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className={`${
        darkMode ? 'bg-slate-900 border-t border-slate-800' : 'bg-slate-100 border-t border-slate-200'
      } py-12 px-4`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
            {t.footer}
          </p>
          <p className={`text-sm mt-2 ${
            darkMode ? 'text-slate-500' : 'text-slate-500'
          }`}>
            {t.footerText}
          </p>
        </div>
      </footer>

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

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
