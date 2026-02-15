import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAVIGATION_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'Developer', href: '/developer' },
  { label: 'Technical', href: '/technical' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleFeaturesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (location.pathname === '/') {
      // Already on home page, scroll to features
      // Use a small delay to ensure DOM is ready
      setTimeout(() => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
          // Calculate offset for sticky header
          const headerHeight = 80; // Approximate header height
          const elementPosition = featuresSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 50);
    } else {
      // Navigate to home first, then scroll
      navigate('/');
      // Wait for navigation and DOM update
      setTimeout(() => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
          const headerHeight = 80;
          const elementPosition = featuresSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/95 shadow-md">
      <nav className="px-4 sm:px-6 lg:px-8 flex items-center justify-center h-16 sm:h-20 relative">
        {/* Logo/Brand - Absolute positioned on left */}
        <Link to="/" className="absolute left-4 sm:left-6 lg:left-8 flex items-center gap-2 font-bold text-lg sm:text-xl flex-shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white">
            <Globe2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-foreground hidden sm:inline">BharatSetu</span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex items-center gap-1">
          {NAVIGATION_ITEMS.map((item) => {
            if (item.href === '/#features') {
              return (
                <a
                  key={item.href}
                  href="/#features"
                  onClick={handleFeaturesClick}
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                >
                  {item.label}
                </a>
              );
            }
            return (
            <Link
              key={item.href}
              to={item.href}
              className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
            >
              {item.label}
            </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button - Absolute positioned on right */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden absolute right-4 sm:right-6 p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
          <nav className="px-4 sm:px-6 py-4 flex flex-col gap-2">
            {NAVIGATION_ITEMS.map((item) => {
              if (item.href === '/#features') {
                return (
                  <a
                    key={item.href}
                    href="/#features"
                    onClick={handleFeaturesClick}
                    className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                );
              }
              return (
              <Link
                key={item.href}
                to={item.href}
                className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
