import { useState } from 'react';
import { toast } from 'sonner';
import { CircleCheck, Info, PlusCircle, Utensils, Loader2 } from 'lucide-react';

interface FoodItem {
  name: string;
  quantity?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  benefits?: string[];
  dietarySuitability?: string[];
}

interface NutritionCardProps {
  foodData: FoodItem[];
  primaryFood: FoodItem;
  onAddToInventory?: () => void;
}

const NutritionCard = ({ foodData, primaryFood, onAddToInventory }: NutritionCardProps) => {
  const [adding, setAdding] = useState(false);
  const [selectedFood, setSelectedFood] = useState(primaryFood);

  const handleAddToInventory = async () => {
    setAdding(true);
    
    try {
      const inventory = JSON.parse(localStorage.getItem('foodInventory') || '[]');
      
      const newItem = {
        id: Date.now(),
        name: selectedFood.name,
        dateAdded: new Date().toISOString(),
        nutrients: {
          calories: selectedFood.calories,
          protein: selectedFood.protein,
          carbs: selectedFood.carbs,
          fat: selectedFood.fat,
          fiber: selectedFood.fiber || 0,
          sugar: selectedFood.sugar || 0,
          benefits: selectedFood.benefits || [],
          dietarySuitability: selectedFood.dietarySuitability || []
        }
      };

      const exists = inventory.some((item: {name: string}) => 
        item.name.toLowerCase() === newItem.name.toLowerCase()
      );
      
      if (!exists) {
        const updatedInventory = [...inventory, newItem];
        localStorage.setItem('foodInventory', JSON.stringify(updatedInventory));
        toast.success(`${newItem.name} added to inventory`);
        onAddToInventory?.();
      } else {
        toast.info(`${newItem.name} is already in your inventory`);
      }
    } catch (error) {
      console.error('Error adding to inventory:', error);
      toast.error('Failed to add to inventory');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border/60 shadow-subtle overflow-hidden h-full">
      <div className="bg-primary/5 p-4 border-b border-border/60">
        <div className="flex justify-between items-center">
          <div>
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
              <CircleCheck className="h-3 w-3 mr-1" />
              High Confidence
            </div>
            <h3 className="text-xl font-semibold capitalize">{selectedFood.name}</h3>
            {selectedFood.quantity && (
              <p className="text-sm text-muted-foreground">Serving: {selectedFood.quantity}</p>
            )}
          </div>
          <button
            onClick={handleAddToInventory}
            disabled={adding}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {adding ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
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
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Nutrition Facts</h4>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Calories</span>
              <span className="text-sm font-medium">{selectedFood.calories} kcal</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">Protein</span>
              <span className="text-sm font-medium">{selectedFood.protein}g</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">Carbs</span>
              <span className="text-sm font-medium">{selectedFood.carbs}g</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">Fat</span>
              <span className="text-sm font-medium">{selectedFood.fat}g</span>
            </div>
            
            {selectedFood.fiber !== undefined && (
              <div className="flex justify-between">
                <span className="text-sm">Fiber</span>
                <span className="text-sm font-medium">{selectedFood.fiber}g</span>
              </div>
            )}
            
            {selectedFood.sugar !== undefined && (
              <div className="flex justify-between">
                <span className="text-sm">Sugar</span>
                <span className="text-sm font-medium">{selectedFood.sugar}g</span>
              </div>
            )}
          </div>
        </div>

        {/* Health Benefits Section */}
        {selectedFood.benefits && selectedFood.benefits.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-2">
              <Info className="h-3.5 w-3.5 mr-1.5" />
              Health Benefits
            </h4>
            <ul className="text-sm space-y-1">
              {selectedFood.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CircleCheck className="h-4 w-4 text-primary shrink-0 mr-2 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dietary Suitability Section */}
        {selectedFood.dietarySuitability && selectedFood.dietarySuitability.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-2">
              <Utensils className="h-3.5 w-3.5 mr-1.5" />
              Dietary Suitability
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedFood.dietarySuitability.map((diet, index) => (
                <span
                  key={index}
                  className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-secondary text-foreground"
                >
                  {diet}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Food selector for multiple items */}
        {foodData.length > 1 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Detected Foods</h4>
            <div className="flex flex-wrap gap-2">
              {foodData.map((food, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedFood(food)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedFood.name === food.name
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  {food.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionCard;