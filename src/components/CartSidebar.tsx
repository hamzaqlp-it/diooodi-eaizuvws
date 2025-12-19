import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
  language?: 'fr' | 'ar';
  onCheckout: () => void;
}

export function CartSidebar({ isOpen, onClose, darkMode = false, language = 'fr', onCheckout }: CartSidebarProps) {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const content = {
    fr: {
      title: 'Panier',
      empty: 'Votre panier est vide',
      emptyDesc: 'Ajoutez des produits pour commencer',
      quantity: 'Quantité',
      remove: 'Retirer',
      clear: 'Vider le panier',
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      shippingFrom: 'À partir de 100 DH',
      total: 'Total',
      checkout: 'Commander via WhatsApp',
    },
    ar: {
      title: 'السلة',
      empty: 'سلتك فارغة',
      emptyDesc: 'أضف منتجات للبدء',
      quantity: 'الكمية',
      remove: 'إزالة',
      clear: 'إفراغ السلة',
      subtotal: 'المجموع الفرعي',
      shipping: 'التوصيل',
      shippingFrom: 'من 100 درهم',
      total: 'المجموع',
      checkout: 'اطلب عبر واتساب',
    },
  };

  const t = content[language];

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] ${
          darkMode ? 'bg-slate-900' : 'bg-white'
        } shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className={`flex items-center justify-between p-6 border-b ${
            darkMode ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <ShoppingBag className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {t.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <ShoppingBag className={`w-24 h-24 mb-4 ${
                darkMode ? 'text-slate-700' : 'text-slate-300'
              }`} />
              <h3 className={`text-xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {t.empty}
              </h3>
              <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                {t.emptyDesc}
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.variant.id}
                    className={`p-4 rounded-xl border ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold mb-1 truncate ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {item.product.name}
                        </h3>
                        <p className={`text-sm mb-2 ${
                          darkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {item.variant.color} - {item.variant.storage}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                              className={`p-1 rounded ${
                                darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                              }`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className={`w-8 text-center font-semibold ${
                              darkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                              disabled={item.quantity >= item.variant.stock_quantity}
                              className={`p-1 rounded ${
                                darkMode ? 'bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800' : 'bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.variant.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              darkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className={`mt-3 pt-3 border-t ${
                      darkMode ? 'border-slate-700' : 'border-slate-200'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${
                          darkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {formatPrice(item.variant.price)} × {item.quantity}
                        </span>
                        <span className={`text-lg font-bold ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {formatPrice(item.variant.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`p-6 border-t ${
                darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
              }`}>
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className={`w-full mb-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
                    }`}
                  >
                    {t.clear}
                  </button>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                      {t.subtotal}
                    </span>
                    <span className={`font-semibold ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                      {t.shipping}
                    </span>
                    <span className={`text-sm ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {t.shippingFrom}
                    </span>
                  </div>
                  <div className={`pt-3 border-t ${
                    darkMode ? 'border-slate-800' : 'border-slate-200'
                  } flex justify-between items-center`}>
                    <span className={`text-lg font-bold ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {t.total}
                    </span>
                    <span className={`text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t.checkout}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
