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

  // استعادة إعدادات المستخدم
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedLanguage = localStorage.getItem('language');

    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
    if (savedLanguage) setLanguage(savedLanguage as 'fr' | 'ar');
  }, []);

  // جلب المنتجات عند تحميل المكوّن أو تغيير الفئة
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // جلب المنتجات حسب الفئة
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category', selectedCategory)
        .order('is_featured', { ascending: false });

      if (productsError) throw productsError;

      // جلب المتغيرات
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*');

      if (variantsError) throw variantsError;

      // دمج المنتجات مع المتغيرات
      const productsWithVariants: ProductWithVariants[] = (productsData || []).map(product => ({
        ...product,
        variants: (variantsData || []).filter(variant => variant.product_id === product.id),
      }));

      setProducts(productsWithVariants);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : (language === 'fr' ? 'Une erreur est survenue' : 'حدث خطأ'));
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
        <section className="py-12 px-4">
          {products.length > 0 ? (
            <ProductCarousel
              products={products}
              onProductClick={setSelectedProduct}
              darkMode={darkMode}
              language={language}
            />
          ) : (
            <div className={`text-center py-12 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <p className="text-lg">{t.noProducts}</p>
            </div>
          )}
        </section>
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

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
