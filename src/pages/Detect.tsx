
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FoodDetection from '../components/food/FoodDetection';

const Detect = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              AI Food Recognition
            </h1>
            <p className="text-muted-foreground">
              Take a photo or upload an image of your food to instantly identify it and get detailed nutritional insights.
            </p>
          </div>
          
          <FoodDetection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Detect;
