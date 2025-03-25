
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        
        {/* Call to action section */}
        <section className="py-20 bg-primary/5">
          <div className="container px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                Ready to Transform Your Eating Habits?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start using Nutrify today to make informed decisions about your nutrition. 
                It's free, open-source, and constantly improving.
              </p>
              <Link 
                to="/detect" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-subtle hover-lift"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
