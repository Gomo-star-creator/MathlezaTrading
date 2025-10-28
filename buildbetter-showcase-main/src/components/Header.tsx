import { Button } from "@/components/ui/button";
import { Building2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  

  useEffect(() => {
    try { document.documentElement.style.scrollBehavior = 'smooth'; } catch {}
    const sectionIds = ['home','services','projects','about','contact'];
    const navSelector = 'a[data-nav], a[data-nav-link], a[data-nav-link]';
    const getNavLinks = () => Array.from(document.querySelectorAll('a[data-nav], a[data-nav-link]'));
    const setActiveForHash = (hash) => {
      const id = (hash || '').replace('#','');
      if (!id) return;
      getNavLinks().forEach(link => {
        try {
          const href = link.getAttribute('href') || link.getAttribute('to') || '';
          if (href.includes('#' + id)) {
            link.classList.add('active-nav');
          } else {
            link.classList.remove('active-nav');
          }
        } catch {}
      });
    };
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.45 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id) setActiveForHash('#' + id);
        }
      });
    }, observerOptions);
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const setActiveByPath = () => {
      const path = window.location.pathname || '/';
      getNavLinks().forEach(link => {
        try {
          const href = link.getAttribute('href') || link.getAttribute('to') || '';
          const base = href.split('#')[0] || '/';
          if (base === path || base === path + '/') {
            link.classList.add('active-nav');
          } else {
            // remove active if not matching a section
            if (!href.includes('#')) link.classList.remove('active-nav');
          }
        } catch {}
      });
    };
    setActiveByPath();
    window.addEventListener('popstate', setActiveByPath);
    window.addEventListener('hashchange', () => setActiveForHash(window.location.hash));
    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', setActiveByPath);
      window.removeEventListener('hashchange', () => setActiveForHash(window.location.hash));
    };
  
    // Special handling for Contact nav: scroll to bottom/end of page where contact section lives
    const handleContactClick = (href) => {
      try {
        // href may be '/#contact' or '#contact'
        const hash = (href || '').split('#')[1] || '';
        if (hash !== 'contact') return false;
        if (window.location.pathname !== '/') {
          // navigate to homepage with hash so page can load then hashchange will handle scroll
          window.location.href = '/#contact';
          return true; // navigation triggered
        } else {
          // already on homepage: scroll contact into view aligning to bottom of viewport if possible
          const el = document.getElementById('contact');
          if (el) {
            // try to align element bottom to viewport bottom
            try {
              el.scrollIntoView({ behavior: 'smooth', block: 'end' });
            } catch {
              // fallback to scrolling to document bottom
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
            return true;
          } else {
            // fallback: scroll to bottom
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            return true;
          }
        }
      } catch (e) { return false; }
    };

    // Attach enhanced click handlers to nav links (especially ones pointing to #contact)
    try {
      const navLinks = Array.from(document.querySelectorAll('a[data-nav]'));
      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.includes('#contact')) {
          // remove existing click handler if any (to avoid duplicates)
          link.addEventListener('click', function(e){ 
            // If handleContactClick handles it, prevent default
            const handled = handleContactClick(href);
            if (handled) e.preventDefault();
            // close menu if present
            try { setIsMenuOpen(false); } catch (err) {}
          });
        }
      });
    } catch { }
    
    // On hashchange, if hash is contact, ensure we scroll to bottom (useful after navigation to '/#contact')
    const _hashHandler = () => {
      try {
        const hash = window.location.hash.replace('#','');
        if (hash === 'contact') {
          const el = document.getElementById('contact');
          if (el) {
            try { el.scrollIntoView({ behavior: 'smooth', block: 'end' }); }
            catch { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }
          } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }
        }
      } catch {}
    };
    window.addEventListener('hashchange', _hashHandler);
    // Also trigger on initial load if URL has #contact
    try { if (window.location.hash.replace('#','') === 'contact') { setTimeout(_hashHandler, 100); } } catch {}
}, []);

  // inject minimal style for active nav
  try {
    if (!document.getElementById('active-nav-style')) {
      const s = document.createElement('style');
      s.id = 'active-nav-style';
      s.innerHTML = '.active-nav{font-weight:600;text-decoration:underline;}';
      document.head.appendChild(s);
    }
  } catch {}
const navItems = [
    { label: "Home", href: "#home", isAnchor: true },
    { label: "Services", href: "#services", isAnchor: true },
    { label: "Projects", href: "#projects", isAnchor: true },
    { label: "About", href: "#about", isAnchor: true },
    { label: "Machine Hire", href: "/machine-hire", isAnchor: false },
    { label: "Contact", href: "#contact", isAnchor: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Mathleza Trading</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.isAnchor ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
                 data-nav onClick={(e) => {
                      try {
                        const href = item.href || '';
                        if (href.startsWith('#')) {
                          const id = href.replace('#','');
                          if (window.location.pathname !== '/') {
                            // navigate to home with hash
                            window.location.href = '/#' + id;
                            return;
                          } else {
                            e.preventDefault();
                            const el = document.getElementById(id);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                      } catch (err) { /* ignore */ }
                      try { setIsMenuOpen(false); } catch (e) {}
                    }}>
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="hero" className="hidden sm:inline-flex">
              Get Quote
            </Button>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                item.isAnchor ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              <Button variant="hero" className="mt-4 w-full">
                Get Quote
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;