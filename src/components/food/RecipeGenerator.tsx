import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Utensils, Leaf, CheckCircle2, ExternalLink } from 'lucide-react';

export const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<null | { label: string; calories: number; yield: number; ingredientLines: string[]; totalNutrients: { PROCNT?: { quantity: number }; CHOCDF?: { quantity: number }; FAT?: { quantity: number } }; url: string; source: string }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch inventory items on component mount
  useEffect(() => {
    const storedInventory = localStorage.getItem('foodInventory');
    if (storedInventory) {
      try {
        const inventory = JSON.parse(storedInventory);
        const itemNames = inventory.map((item: { name: string }) => item.name);
        setInventoryItems(itemNames);
      } catch (error) {
        console.error('Error parsing inventory:', error);
      }
    }
  }, []);

  const handleCheckboxChange = (item: string) => {
    setSelectedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const addSelectedToInput = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items from your inventory first",
        variant: "destructive"
      });
      return;
    }
    setIngredients(prev => 
      prev ? `${prev}, ${selectedItems.join(', ')}` : selectedItems.join(', ')
    );
    setSelectedItems([]);
  };

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      toast({
        title: "No ingredients",
        description: "Please enter some ingredients first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setRecipe(null);

    try {
      const APP_ID = '49e49439'; 
      const APP_KEY = '9863f70d52b56622fc2307650179a111';
      const query = ingredients.split(',').map(i => i.trim()).join(',');
      
      const response = await fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );

      if (!response.ok) throw new Error('Failed to fetch recipes');

      const data = await response.json();
      
      if (data.hits?.length > 0) {
        setRecipe(data.hits[0].recipe); // Now storing the full recipe object
      } else {
        toast({
          title: "No recipes found",
          description: "Try different ingredients or combinations",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recipe Generator</h2>
        
        {/* Inventory Selection */}
        {inventoryItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Select from your inventory:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
              {inventoryItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`item-${index}`}
                    checked={selectedItems.includes(item)}
                    onCheckedChange={() => handleCheckboxChange(item)}
                  />
                  <label htmlFor={`item-${index}`} className="text-sm capitalize">
                    {item}
                  </label>
                </div>
              ))}
            </div>
            <Button 
              size="sm" 
              onClick={addSelectedToInput}
              disabled={selectedItems.length === 0}
            >
              Add Selected to Ingredients
            </Button>
          </div>
        )}

        {/* Manual Input */}
        <div className="space-y-2">
          <h3 className="font-medium">
            {inventoryItems.length > 0 ? 'Or enter manually:' : 'Enter ingredients:'}
          </h3>
          <Textarea
            placeholder="Enter ingredients separated by commas (e.g., chicken, rice, tomatoes)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="min-h-[100px]"
          />
          <p className="text-sm text-muted-foreground">
            Separate items with commas for best results
          </p>
        </div>
      </div>

      <Button 
        onClick={generateRecipe}
        disabled={isLoading || !ingredients.trim()}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Recipe'
        )}
      </Button>
      
      {recipe && (
        <div className="mt-6 p-6 bg-muted/10 rounded-lg border border-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-2xl font-bold text-primary">{recipe.label}</h3>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {Math.round(recipe.calories / recipe.yield)} kcal/serving
              </span>
              <span className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm font-medium">
                Serves {recipe.yield}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients Column */}
            <div>
              <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" />
                Ingredients
              </h4>
              <ul className="space-y-3">
                {recipe.ingredientLines.map((ingredient: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                    <span className="capitalize">{ingredient.toLowerCase()}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nutrition Column */}
            <div>
              <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Nutrition (per serving)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg border border-border/40">
                  <p className="text-muted-foreground text-sm">Calories</p>
                  <p className="text-2xl font-bold">{Math.round(recipe.calories / recipe.yield)}</p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border/40">
                  <p className="text-muted-foreground text-sm">Protein</p>
                  <p className="text-2xl font-bold">
                    {Math.round((recipe.totalNutrients.PROCNT?.quantity || 0) / recipe.yield)}g
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border/40">
                  <p className="text-muted-foreground text-sm">Carbs</p>
                  <p className="text-2xl font-bold">
                    {Math.round((recipe.totalNutrients.CHOCDF?.quantity || 0) / recipe.yield)}g
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border/40">
                  <p className="text-muted-foreground text-sm">Fat</p>
                  <p className="text-2xl font-bold">
                    {Math.round((recipe.totalNutrients.FAT?.quantity || 0) / recipe.yield)}g
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Source */}
          <div className="mt-8 pt-6 border-t border-border/40">
            <a
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Full Recipe Instructions
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              Recipe source: {recipe?.source}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};