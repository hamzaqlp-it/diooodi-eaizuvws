import { useState, useEffect } from 'react';
import { X, Check, ZoomIn, Package, Truck, Shield, MessageCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { ProductWithVariants, ProductVariant } from '../lib/database.types';

interface ProductDetailModalProps {
  product: ProductWithVariants | null;
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
  language?: 'fr' | 'ar';
}

export function ProductDetailModal({ product, isOpen, onClose, darkMode = false, language = 'fr' }: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedColor(firstVariant.color);
      setSelectedStorage(firstVariant.storage);
      setSelectedVariant(firstVariant);
      setSelectedImage(0);
    }
  }, [product]);

  useEffect(() => {
    if (product && selectedColor && selectedStorage) {
      const variant = product.variants.find(
        v => v.color === selectedColor && v.storage === selectedStorage
      );
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  }, [selectedColor, selectedStorage, product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const uniqueColors = Array.from(
    new Map(product.variants.map(v => [v.color, v])).values()
  );

  const availableStorages = Array.from(
    new Set(
      product.variants
        .filter(v => v.color === selectedColor)
        .map(v => v.storage)
    )
  );

  const text = {
    fr: {
      color: 'Couleur',
      storage: 'Stockage',
      inStock: 'En stock',
      available: 'disponibles',
      outOfStock: 'Rupture de stock',
      shippingNote: 'Note importante',
      shippingText: 'Frais de livraison à partir de 100 DH. Livraison en 24-72h partout au Maroc. Les frais doivent être payés avant l\'expédition. Le solde restant est dû à la livraison du produit.',
      addToCart: 'Ajouter au panier',
      orderWhatsApp: 'Commander via WhatsApp',
      warranty: 'Garantie 2 ans',
      delivery: 'Livraison 24-72h',
      securePayment: 'Paiement sécurisé',
      features: 'Caractéristiques principales',
      specs: 'Spécifications techniques',
      screen: 'Écran',
      processor: 'Processeur',
      camera: 'Caméra',
      battery: 'Batterie',
      os: 'Système',
    },
    ar: {
      color: 'اللون',
      storage: 'السعة التخزينية',
      inStock: 'متوفر',
      available: 'متاح',
      outOfStock: 'غير متوفر',
      shippingNote: 'ملاحظة مهمة',
      shippingText: 'رسوم التوصيل تبدأ من 100 درهم. التوصيل خلال 24-72 ساعة في جميع أنحاء المغرب. يجب دفع الرسوم قبل الشحن. يدفع الرصيد المتبقي عند تسليم المنتج.',
      addToCart: 'أضف إلى السلة',
      orderWhatsApp: 'اطلب عبر واتساب',
      warranty: 'ضمان سنتين',
      delivery: 'توصيل 24-72 ساعة',
      securePayment: 'دفع آمن',
      features: 'الميزات الرئيسية',
      specs: 'المواصفات التقنية',
      screen: 'الشاشة',
      processor: 'المعالج',
      camera: 'الكاميرا',
      battery: 'البطارية',
      os: 'نظام التشغيل',
    },
  };

  const t = text[language];

  const handleWhatsAppOrder = () => {
    const message = language === 'fr'
      ? `Bonjour! Je suis intéressé par ${product.name} - ${selectedColor} - ${selectedStorage}. Prix: ${formatPrice(selectedVariant?.price || 0)}`
      : `مرحبا! أنا مهتم بـ ${product.name} - ${selectedColor} - ${selectedStorage}. السعر: ${formatPrice(selectedVariant?.price || 0)}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/+212600000000?text=${encodedMessage}`, '_blank');
  };

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      addToCart(product, selectedVariant);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className={`relative w-full max-w-6xl ${
          darkMode ? 'bg-slate-900' : 'bg-white'
        } rounded-2xl shadow-2xl overflow-hidden`}>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center ${
              darkMode ? 'bg-slate-800/90 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'
            } rounded-full transition-colors`}
          >
            <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            <div className="space-y-4">
              <div
                className={`relative aspect-square ${
                  darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-100 to-slate-200'
                } rounded-xl overflow-hidden cursor-zoom-in group`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-blue-500 ring-2 ring-blue-500/50'
                        : darkMode
                        ? 'border-slate-700 hover:border-slate-600'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                {product.brand}
              </div>
              <h2 className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              } mb-4`}>
                {product.name}
              </h2>
              <p className={`${
                darkMode ? 'text-slate-300' : 'text-slate-600'
              } mb-6 leading-relaxed`}>
                {product.description}
              </p>

              <div className="mb-6">
                <div className={`text-sm font-semibold ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                } mb-3`}>
                  {t.color}: {selectedColor}
                </div>
                <div className="flex flex-wrap gap-3">
                  {uniqueColors.map((variant) => (
                    <button
                      key={variant.color}
                      onClick={() => setSelectedColor(variant.color)}
                      className={`relative group ${
                        selectedColor === variant.color ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                      } ${darkMode ? 'ring-offset-slate-900' : 'ring-offset-white'}`}
                      style={{ borderRadius: '50%' }}
                    >
                      <div
                        className={`w-12 h-12 rounded-full border-2 ${
                          darkMode ? 'border-slate-600' : 'border-slate-300'
                        } transition-transform group-hover:scale-110`}
                        style={{ backgroundColor: variant.color_hex }}
                      />
                      {selectedColor === variant.color && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white drop-shadow-lg" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className={`text-sm font-semibold ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                } mb-3`}>
                  {t.storage}
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableStorages.map((storage) => (
                    <button
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        selectedStorage === storage
                          ? 'bg-blue-500 text-white ring-2 ring-blue-400'
                          : darkMode
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>

              {selectedVariant && (
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-4xl font-bold ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {formatPrice(selectedVariant.price)}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {selectedVariant.stock_quantity > 0 ? (
                      <span className="text-green-400 font-medium">
                        {t.inStock} ({selectedVariant.stock_quantity} {t.available})
                      </span>
                    ) : (
                      <span className="text-red-400 font-medium">{t.outOfStock}</span>
                    )}
                  </div>
                </div>
              )}

              <div className={`mb-6 p-4 rounded-lg ${
                darkMode ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'
              }`}>
                <p className={`text-sm ${
                  darkMode ? 'text-orange-200' : 'text-orange-900'
                }`}>
                  <span className="font-semibold">{t.shippingNote}:</span> {t.shippingText}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
                  className={`w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 ${
                    darkMode ? 'disabled:text-slate-500' : 'disabled:text-slate-400'
                  } text-white font-bold text-lg rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {t.addToCart}
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
                  className={`w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-slate-700 ${
                    darkMode ? 'disabled:text-slate-500' : 'disabled:text-slate-400'
                  } text-white font-bold text-lg rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  <MessageCircle className="w-5 h-5" />
                  {t.orderWhatsApp}
                </button>
              </div>

              <div className={`grid grid-cols-3 gap-4 mb-6 pt-6 border-t ${
                darkMode ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div className="text-center">
                  <Package className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className={`text-xs ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>{t.warranty}</div>
                </div>
                <div className="text-center">
                  <Truck className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className={`text-xs ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>{t.delivery}</div>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className={`text-xs ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>{t.securePayment}</div>
                </div>
              </div>

              <div className={`mb-6 pt-6 border-t ${
                darkMode ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <h3 className={`text-lg font-bold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                } mb-3`}>
                  {t.features}
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className={`flex items-start gap-2 text-sm ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`pt-6 border-t ${
                darkMode ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <h3 className={`text-lg font-bold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                } mb-3`}>
                  {t.specs}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <div className={`text-xs uppercase mb-1 ${
                        darkMode ? 'text-slate-500' : 'text-slate-500'
                      }`}>
                        {key === 'screen' ? t.screen :
                         key === 'processor' ? t.processor :
                         key === 'camera' ? t.camera :
                         key === 'battery' ? t.battery :
                         key === 'os' ? t.os : key}
                      </div>
                      <div className={`text-sm font-medium ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
