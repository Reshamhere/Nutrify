import { useState, useEffect } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import NutritionCard from './NutritionCard';
import { searchFoodItems, FoodItem, getFoodNutrients } from '@/./services/foodDataService';

type ExtendedFoodItem = FoodItem & { confidence?: number };

const FoodSearch = () => {
  const [selectedFood, setSelectedFood] = useState<ExtendedFoodItem | null>(null);
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
  const [isUnknownFood, setIsUnknownFood] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }
      
      try {
        setIsLoading(true);
        const results = await searchFoodItems(searchTerm);
        setSuggestions(results);
      } catch (error) {
        console.error('Error searching for food:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce search
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  const handleSelectFood = (food: FoodItem) => {
    if (!food || !food.name) {
      toast.error('Invalid food selection');
      return;
    }
    
    setSelectedFood({ ...food, confidence: 1.0 });
    setSearchTerm(food.name);
    setSuggestions([]);
    setIsUnknownFood(false);
  };
  
  const handleSearchSubmit = async () => {
    if (!searchTerm) return;
    
    setIsLoading(true);
    
    try {
      // Search for suggestions with the full term
      const results = await searchFoodItems(searchTerm);
      
      // Check if we have an exact match
      const exactMatch = results.find(item => 
        item.name.toLowerCase() === searchTerm.toLowerCase()
      );
      
      if (exactMatch) {
        handleSelectFood(exactMatch);
        return;
      }
      
      // Check if we have any results
      if (results.length > 0) {
        // Take the first close match
        handleSelectFood(results[0]);
        return;
      }
      // If no match found, mark as unknown food
      setIsUnknownFood(true);
      toast.error('Unknown food item. Please try again with a different food.');
    } catch (error) {
      console.error('Error submitting search:', error);
      toast.error('Error processing search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-card rounded-xl overflow-hidden border border-border/40 shadow-subtle">
        <div className="p-6 border-b border-border/60">
          <h2 className="text-xl font-semibold mb-4">Food Search</h2>
          
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for food..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                  className="pl-9 w-full"
                />
                
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-md shadow-md z-10">
                    <ul className="py-1 max-h-60 overflow-y-auto">
                      {suggestions.map((food) => (
                        <li 
                          key={food.id} 
                          className="px-3 py-2 hover:bg-muted cursor-pointer capitalize"
                          onClick={() => handleSelectFood(food)}
                        >
                          {food.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <Button
                type="button"
                onClick={handleSearchSubmit}
                disabled={!searchTerm || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                    Searching...
                  </span>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default FoodSearch;
