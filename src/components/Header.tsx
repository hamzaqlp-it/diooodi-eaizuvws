import { Smartphone, Menu, Moon, Sun, Info, X, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: 'fr' | 'ar';
  toggleLanguage: () => void;
  onAboutClick: () => void;
  onCartClick: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Header({
  darkMode,
  toggleDarkMode,
  language,
  toggleLanguage,
  onAboutClick,
  onCartClick,
  selectedCategory,
  onCategoryChange,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  const categories = [
    { id: 'smartphones', label: { fr: 'Smartphones', ar: 'هواتف ذكية' } },
    { id: 'computers', label: { fr: 'Ordinateurs', ar: 'حواسيب' } },
    { id: 'accessories', label: { fr: 'Accessoires', ar: 'إكسسوارات' } },
    { id: 'chargers', label: { fr: 'Chargeurs', ar: 'شواحن' } },
    { id: 'powerbanks', label: { fr: 'Power Banks', ar: 'بطاريات محمولة' } },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${
      darkMode ? 'bg-slate-900/95' : 'bg-white/95'
    } backdrop-blur-md border-b ${
      darkMode ? 'border-slate-800' : 'border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-7 h-7 text-blue-400" strokeWidth={2} />
            <span className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              TechMorocco
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryChange(category.id);
                  scrollToSection('featured');
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {category.label[language]}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={onCartClick}
              className={`relative p-2 rounded-lg transition-all ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleLanguage}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
              }`}
            >
              {language === 'fr' ? 'عربية' : 'Français'}
            </button>

            <button
              onClick={onAboutClick}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
              }`}
              aria-label="About"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden py-4 border-t ${
            darkMode ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="space-y-2 mb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryChange(category.id);
                    scrollToSection('featured');
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : darkMode
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {category.label[language]}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  onCartClick();
                  setMobileMenuOpen(false);
                }}
                className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  darkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              <button
                onClick={toggleDarkMode}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  darkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleLanguage}
                className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  darkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                {language === 'fr' ? 'عربية' : 'Français'}
              </button>

              <button
                onClick={() => {
                  onAboutClick();
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  darkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
