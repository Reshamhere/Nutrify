
import { Link } from 'react-router-dom';
import { Github, Mail, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-muted/30 py-12 mt-20">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 font-semibold text-xl"
            >
              <div className="relative h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">N</span>
              </div>
              <span>Nutrify</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              AI-powered nutrition assistant helping you make healthier food choices.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@nutrify.app" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Home</Link>
              <Link to="/detect" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Detect Food</Link>
              <Link to="/inventory" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Inventory</Link>
            </nav>
          </div>
          
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Terms of Service</Link>
            </nav>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-muted/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nutrify. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for healthy eating
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
