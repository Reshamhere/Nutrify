import { useState } from 'react';

interface FoodItem {
  name: string;
  quantity?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionCardProps {
  foodData: FoodItem[];
  primaryFood: FoodItem;
}

const NutritionCard = ({ foodData, primaryFood }: NutritionCardProps) => {
  const [selectedFood, setSelectedFood] = useState(primaryFood);

  return (
    <div className="bg-card rounded-lg border border-border/60 shadow-subtle overflow-hidden">
      <div className="bg-primary/5 p-4 border-b border-border/60">
        <h3 className="text-xl font-semibold capitalize">{selectedFood.name}</h3>
        {selectedFood.quantity && (
          <p className="text-sm text-muted-foreground">Serving: {selectedFood.quantity}</p>
        )}
      </div>

      <div className="p-4">
        {/* Food selector for multiple items */}
        {foodData.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Detected Foods:
            </label>
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

        {/* Nutrition facts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/10 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Calories</p>
            <p className="text-lg font-medium">{selectedFood.calories} kcal</p>
          </div>
          <div className="bg-muted/10 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Protein</p>
            <p className="text-lg font-medium">{selectedFood.protein}g</p>
          </div>
          <div className="bg-muted/10 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Carbs</p>
            <p className="text-lg font-medium">{selectedFood.carbs}g</p>
          </div>
          <div className="bg-muted/10 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Fat</p>
            <p className="text-lg font-medium">{selectedFood.fat}g</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionCard;