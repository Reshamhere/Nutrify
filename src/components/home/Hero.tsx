
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-28 pb-20 min-h-[90vh] flex items-center">
      {/* Abstract background element */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-tr from-primary/10 to-primary/5 blur-3xl opacity-50"></div>
      </div>
      
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            <span>AI-Powered Nutrition Assistant</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in [animation-delay:150ms]">
            Identify Food &<br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80">
              Unlock Nutrition Insights
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg text-muted-foreground mb-8 animate-fade-in [animation-delay:300ms]">
            Nutrify uses advanced AI to recognize food from images, provide nutritional information, 
            and offer personalized recommendations for healthier eating habits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in [animation-delay:450ms]">
            <Link 
              to="/detect" 
              className="relative inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-subtle hover-lift overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-primary-foreground/0 to-primary-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="flex items-center">
                Start Detecting
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link 
              to="/inventory" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-secondary text-foreground font-medium hover-lift"
            >
              View Inventory
            </Link>
          </div>
        </div>
        
        {/* Preview image */}
        <div className="mt-20 max-w-3xl mx-auto animate-fade-in [animation-delay:600ms]">
          <div className="relative">
            {/* App preview mockup frame */}
            <div className="rounded-2xl overflow-hidden shadow-intense bg-gradient-to-tr from-white to-gray-50 p-1">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-secondary relative">
                {/* App screenshot mockup (placeholder) */}
                <div className="absolute inset-0 flex flex-col bg-white rounded-xl overflow-hidden">
                  <div className="h-10 bg-gray-100 flex items-center px-4 border-b border-gray-200/50">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4 p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="h-40 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                        <span className="text-muted-foreground text-sm">Camera Preview</span>
                      </div>
                      <div className="h-28 rounded-lg bg-primary/5 border border-primary/20 p-3">
                        <div className="h-5 w-24 bg-primary/20 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
                        <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <div className="h-12 bg-gray-100 rounded-lg"></div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="h-5 w-32 bg-primary/10 rounded mb-3"></div>
                        <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
                        <div className="h-4 w-2/3 bg-gray-100 rounded mb-2"></div>
                        <div className="flex mt-4 space-x-2">
                          <div className="h-6 w-20 rounded-full bg-primary/20"></div>
                          <div className="h-6 w-20 rounded-full bg-gray-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-primary/10 blur-xl"></div>
            <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-primary/5 blur-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
