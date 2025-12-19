import { X, Mail, Phone, MapPin, Clock } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
  language?: 'fr' | 'ar';
}

export function AboutModal({ isOpen, onClose, darkMode = false, language = 'fr' }: AboutModalProps) {
  if (!isOpen) return null;

  const content = {
    fr: {
      title: 'À Propos de TechMorocco',
      description: 'TechMorocco est votre destination de confiance pour les smartphones et produits électroniques au Maroc. Nous offrons une sélection premium de produits authentiques avec garantie officielle et service client exceptionnel.',
      mission: 'Notre Mission',
      missionText: 'Fournir aux clients marocains les meilleurs produits technologiques aux prix les plus compétitifs, avec un service de qualité supérieure et une expérience d\'achat sans souci.',
      contact: 'Contactez-nous',
      email: 'Email',
      phone: 'Téléphone',
      whatsapp: 'WhatsApp',
      address: 'Adresse',
      addressText: 'Casablanca, Maroc',
      hours: 'Heures d\'ouverture',
      hoursText: 'Lun-Sam: 9h-19h | Dim: 10h-18h',
      shipping: 'Informations de livraison',
      shippingText: 'Frais de livraison à partir de 100 DH. Livraison en 24-72h partout au Maroc. Les frais doivent être payés avant l\'expédition.',
    },
    ar: {
      title: 'حول TechMorocco',
      description: 'TechMorocco هو وجهتك الموثوقة للهواتف الذكية والمنتجات الإلكترونية في المغرب. نقدم مجموعة مختارة من المنتجات الأصلية بضمان رسمي وخدمة عملاء استثنائية.',
      mission: 'مهمتنا',
      missionText: 'تزويد العملاء المغاربة بأفضل المنتجات التقنية بأسعار تنافسية، مع خدمة عالية الجودة وتجربة شراء خالية من القلق.',
      contact: 'اتصل بنا',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      whatsapp: 'واتساب',
      address: 'العنوان',
      addressText: 'الدار البيضاء، المغرب',
      hours: 'ساعات العمل',
      hoursText: 'الإثنين-السبت: 9ص-7م | الأحد: 10ص-6م',
      shipping: 'معلومات التوصيل',
      shippingText: 'رسوم التوصيل تبدأ من 100 درهم. التوصيل خلال 24-72 ساعة في جميع أنحاء المغرب. يجب دفع الرسوم قبل الشحن.',
    },
  };

  const t = content[language];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className={`relative w-full max-w-3xl ${
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

          <div className="p-8">
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {t.title}
            </h2>

            <p className={`mb-8 leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.description}
            </p>

            <div className={`mb-8 p-6 rounded-xl ${
              darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100'
            }`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {t.mission}
              </h3>
              <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                {t.missionText}
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {t.contact}
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className={`flex items-start gap-3 p-4 rounded-lg ${
                  darkMode ? 'bg-slate-800' : 'bg-slate-100'
                }`}>
                  <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className={`text-sm font-semibold mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {t.email}
                    </div>
                    <a
                      href="mailto:contact@techmorocco.ma"
                      className={`${darkMode ? 'text-white' : 'text-slate-900'} hover:text-blue-400 transition-colors`}
                    >
                      contact@techmorocco.ma
                    </a>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-4 rounded-lg ${
                  darkMode ? 'bg-slate-800' : 'bg-slate-100'
                }`}>
                  <Phone className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className={`text-sm font-semibold mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {t.phone} / {t.whatsapp}
                    </div>
                    <a
                      href="tel:+212600000000"
                      className={`${darkMode ? 'text-white' : 'text-slate-900'} hover:text-blue-400 transition-colors`}
                    >
                      +212 600 000 000
                    </a>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-4 rounded-lg ${
                  darkMode ? 'bg-slate-800' : 'bg-slate-100'
                }`}>
                  <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className={`text-sm font-semibold mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {t.address}
                    </div>
                    <div className={darkMode ? 'text-white' : 'text-slate-900'}>
                      {t.addressText}
                    </div>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-4 rounded-lg ${
                  darkMode ? 'bg-slate-800' : 'bg-slate-100'
                }`}>
                  <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className={`text-sm font-semibold mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {t.hours}
                    </div>
                    <div className={darkMode ? 'text-white' : 'text-slate-900'}>
                      {t.hoursText}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${
              darkMode ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'
            }`}>
              <h3 className={`text-lg font-bold mb-2 ${
                darkMode ? 'text-orange-300' : 'text-orange-800'
              }`}>
                {t.shipping}
              </h3>
              <p className={darkMode ? 'text-orange-200' : 'text-orange-900'}>
                {t.shippingText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
