
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Home, Leaf, Menu, X, ChefHat } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { name: 'Detect', path: '/detect', icon: <Camera className="h-4 w-4" /> },
    { name: 'Inventory', path: '/inventory', icon: <Leaf className="h-4 w-4" /> },
    { name: 'Tools', path: '/tools', icon: <ChefHat className="h-4 w-4" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 ${
        scrolled ? 'py-3 glass' : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold text-xl"
        >
          <div className="relative h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">N</span>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white border-2 border-primary animate-pulse-subtle"></div>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Nutrify
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-secondary text-foreground/80 hover:text-foreground'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-0 bg-background/95 backdrop-blur-sm z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '64px' }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6 p-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-6 py-3 rounded-full text-base flex items-center gap-3 transition-all ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'bg-secondary/50 text-foreground/90 hover:bg-secondary'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
