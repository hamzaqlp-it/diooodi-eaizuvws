import { MessageCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface WhatsAppButtonProps {
  darkMode?: boolean;
  language?: 'fr' | 'ar';
}

export function WhatsAppButton({ darkMode = false, language = 'fr' }: WhatsAppButtonProps) {
  const { items, getTotalPrice } = useCart();
  const whatsappNumber = '+212600000000';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const generateWhatsAppMessage = () => {
    if (items.length === 0) {
      return language === 'fr'
        ? 'Bonjour! Je suis intéressé par vos produits. Frais de livraison à partir de 100 DH. Livraison en 24-72h partout au Maroc.'
        : 'مرحبا! أنا مهتم بمنتجاتكم. رسوم التوصيل تبدأ من 100 درهم. التوصيل خلال 24-72 ساعة في جميع أنحاء المغرب.';
    }

    const greeting = language === 'fr' ? 'Bonjour!' : 'مرحبا!';
    const orderText = language === 'fr' ? 'Je souhaite commander:' : 'أرغب في طلب:';
    const totalText = language === 'fr' ? 'Total:' : 'المجموع:';
    const shippingText = language === 'fr'
      ? 'Frais de livraison à partir de 100 DH. Livraison en 24-72h partout au Maroc.'
      : 'رسوم التوصيل تبدأ من 100 درهم. التوصيل خلال 24-72 ساعة في جميع أنحاء المغرب.';

    const itemsList = items
      .map(item => `- ${item.product.name} (${item.variant.color}, ${item.variant.storage}) x${item.quantity} - ${formatPrice(item.variant.price * item.quantity)}`)
      .join('\n');

    return `${greeting}\n\n${orderText}\n${itemsList}\n\n${totalText} ${formatPrice(getTotalPrice())}\n\n${shippingText}`;
  };

  const handleClick = () => {
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-2xl transition-all hover:scale-105 group ${
        darkMode ? 'shadow-green-500/20' : 'shadow-green-500/40'
      }`}
    >
      <MessageCircle className="w-6 h-6 group-hover:animate-bounce" />
      <span className="hidden sm:inline">
        {language === 'fr' ? 'Contactez-nous' : 'اتصل بنا'}
      </span>
    </button>
  );
}
