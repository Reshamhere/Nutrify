
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FoodInventory from '../components/food/FoodInventory';

const Inventory = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              Food Inventory
            </h1>
            <p className="text-muted-foreground">
              Keep track of all your identified food items in one place for easy meal planning and nutrition tracking.
            </p>
          </div>
          
          <FoodInventory />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Inventory;
