import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const handleFeaturesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      // Already on home page, scroll to features
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
    <footer className="border-t border-border/50 bg-muted/20 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  B
                </div>
                <span className="font-bold text-lg text-foreground">BharatSetu</span>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Connecting communities to information and services.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-foreground/70 hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <a 
                    href="#features" 
                    onClick={handleFeaturesClick}
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <Link to="/about" className="text-foreground/70 hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-foreground/70 hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Explore */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/product-label-auditor" className="text-foreground/70 hover:text-primary transition-colors">
                    Product Auditor
                  </Link>
                </li>
                <li>
                  <Link to="/health-tools" className="text-foreground/70 hover:text-primary transition-colors">
                    Health Tools
                  </Link>
                </li>
                <li>
                  <Link to="/legal-rights" className="text-foreground/70 hover:text-primary transition-colors">
                    Legal Rights
                  </Link>
                </li>
                <li>
                  <Link to="/civicsense-assistant" className="text-foreground/70 hover:text-primary transition-colors">
                    CivicSense
                  </Link>
                </li>
                <li>
                  <Link to="/gynae-care" className="text-foreground/70 hover:text-primary transition-colors">
                    GynaeCare
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-foreground/50">
              © {currentYear} BharatSetu. All rights reserved. | AI of the People, by the People, for the People.
            </p>
            <div className="social-card">
              <a href="#" className="socialContainer containerLinkedIn">
                <svg className="socialSvg" viewBox="0 0 448 512" fill="currentColor">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                </svg>
              </a>
              <a href="#" className="socialContainer containerGitHub">
                <svg className="socialSvg" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
