
import { CameraIcon, LeafIcon, PaletteIcon, BrainCircuitIcon, ChefHatIcon, TrendingUpIcon } from 'lucide-react';

const features = [
  {
    icon: <CameraIcon className="h-6 w-6" />,
    title: "AI Food Recognition",
    description: "Take a photo or upload an image of your food and let our AI instantly identify the ingredients."
  },
  {
    icon: <LeafIcon className="h-6 w-6" />,
    title: "Nutritional Insights",
    description: "Get detailed macro & micronutrients breakdown and health information about your food."
  },
  {
    icon: <ChefHatIcon className="h-6 w-6" />,
    title: "Recipe Recommendations",
    description: "Discover healthy recipe ideas based on ingredients you already have in your inventory."
  },
  {
    icon: <PaletteIcon className="h-6 w-6" />,
    title: "Food Inventory",
    description: "Keep track of all your identified food items in one place for easy meal planning."
  },
  {
    icon: <BrainCircuitIcon className="h-6 w-6" />,
    title: "Personalized Suggestions",
    description: "Get food recommendations tailored to your dietary preferences and nutritional needs."
  },
  {
    icon: <TrendingUpIcon className="h-6 w-6" />,
    title: "Health Tracking",
    description: "Monitor your dietary patterns and nutritional intake with intuitive statistics."
  },
];

const Features = () => {
  return (
    <section className="py-20" id="features">
      <div className="container px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Empowering Your Food Choices
          </h2>
          <p className="text-muted-foreground text-lg">
            Nutrify combines cutting-edge AI with nutritional science to help you make informed decisions about what you eat.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card rounded-xl p-6 border border-border/40 shadow-subtle hover:shadow-elevated transition-shadow group relative overflow-hidden"
            >
              {/* Accent corner */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5 text-primary relative">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
