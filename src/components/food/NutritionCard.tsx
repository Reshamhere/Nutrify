
import { useState } from 'react';
import { CircleCheck, Info, PlusCircle, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import { getNutrientData } from '../../utils/nutrientData';

interface FoodData {
  name: string;
  confidence: number;
}

interface NutritionCardProps {
  foodData: FoodData;
}

const NutritionCard = ({ foodData }: NutritionCardProps) => {
  const [adding, setAdding] = useState(false);
  
  // Get nutrition data for the detected food
  const nutrientData = getNutrientData(foodData.name);
  
  const handleAddToInventory = () => {
    setAdding(true);
    
    // Simulate adding to inventory
    setTimeout(() => {
      // Add to local storage
      const inventory = JSON.parse(localStorage.getItem('foodInventory') || '[]');
      
      // Check if food already exists
      const exists = inventory.some((item: {name: string}) => item.name === foodData.name);
      
      if (!exists) {
        inventory.push({
          id: Date.now(),
          name: foodData.name,
          dateAdded: new Date().toISOString(),
          nutrients: nutrientData
        });
        
        localStorage.setItem('foodInventory', JSON.stringify(inventory));
        toast.success(`${foodData.name} added to inventory`);
      } else {
        toast.info(`${foodData.name} is already in your inventory`);
      }
      
      setAdding(false);
    }, 800);
  };
  
  return (
    <div className="bg-card rounded-lg border border-border/60 shadow-subtle overflow-hidden h-full">
      <div className="bg-primary/5 p-4 border-b border-border/60">
        <div className="flex justify-between items-center">
          <div>
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
              <CircleCheck className="h-3 w-3 mr-1" />
              {(foodData.confidence * 100).toFixed(0)}% Confidence
            </div>
            <h3 className="text-xl font-semibold capitalize">{foodData.name}</h3>
          </div>
          <button
            onClick={handleAddToInventory}
            disabled={adding}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {adding ? (
              <span className="flex items-center">
                Adding...
              </span>
            ) : (
              <span className="flex items-center">
                <PlusCircle className="h-4 w-4 mr-1.5" />
                Add to Inventory
              </span>
            )}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Nutrition Facts (per 100g)</h4>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Calories</span>
              <span className="text-sm font-medium">{nutrientData.calories} kcal</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">Protein</span>
              <span className="text-sm font-medium">{nutrientData.protein}g</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">Carbs</span>
              <span className="text-sm font-medium">{nutrientData.carbs}g</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">Fat</span>
              <span className="text-sm font-medium">{nutrientData.fat}g</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">Fiber</span>
              <span className="text-sm font-medium">{nutrientData.fiber}g</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">Sugar</span>
              <span className="text-sm font-medium">{nutrientData.sugar}g</span>
            </div>
          </div>
        </div>
        
        {/* Health benefits */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-2">
            <Info className="h-3.5 w-3.5 mr-1.5" />
            Health Benefits
          </h4>
          <ul className="text-sm space-y-1">
            {nutrientData.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CircleCheck className="h-4 w-4 text-primary shrink-0 mr-2 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Dietary suitability */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-2">
            <Utensils className="h-3.5 w-3.5 mr-1.5" />
            Dietary Suitability
          </h4>
          <div className="flex flex-wrap gap-2">
            {nutrientData.dietarySuitability.map((diet, index) => (
              <span
                key={index}
                className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-secondary text-foreground"
              >
                {diet}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionCard;
