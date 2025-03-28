
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Trash2, Search, Info, Clock, Calendar, FilterIcon } from 'lucide-react';

interface FoodItem {
  id: number;
  name: string;
  dateAdded: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    benefits: string[];
    dietarySuitability: string[];
  };
}

const FoodInventory = () => {
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    const storedInventory = localStorage.getItem('foodInventory');
    if (storedInventory) {
      try {
        const parsed = JSON.parse(storedInventory);
        // Ensure all items have proper nutrients structure
        const validated = parsed.map((item: any) => ({
          ...item,
          nutrients: {
            ...item.nutrients,
            dietarySuitability: item.nutrients?.dietarySuitability || [],
            benefits: item.nutrients?.benefits || []
          }
        }));
        setInventory(validated);
      } catch (error) {
        console.error('Error parsing inventory:', error);
      }
    }
  }, []);
  
  const handleRemoveItem = (id: number) => {
    const updatedInventory = inventory.filter(item => item.id !== id);
    setInventory(updatedInventory);
    localStorage.setItem('foodInventory', JSON.stringify(updatedInventory));
    toast.success('Item removed from inventory');
  };
  
  const filterItems = (items: FoodItem[]) => {
    // First apply search filter
    let filtered = items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then apply category filter
    if (filter !== 'all') {
      filtered = filtered.filter(item => 
        item.nutrients.dietarySuitability.some(diet => 
          diet.toLowerCase() === filter.toLowerCase()
        )
      );
    }
    
    return filtered;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const filteredInventory = filterItems(inventory);
  const dietaryCategories = ['All', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Keto', 'Paleo'];
  
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-card rounded-xl overflow-hidden border border-border/40 shadow-subtle">
        <div className="p-6 border-b border-border/60">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-semibold">Food Inventory</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search foods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg border border-input bg-background w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              {/* Filter dropdown */}
              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value.toLowerCase())}
                  className="pl-9 pr-4 py-2 rounded-lg border border-input bg-background appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-auto"
                >
                  {dietaryCategories.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {filteredInventory.length === 0 ? (
          <div className="p-8 text-center">
            {inventory.length === 0 ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Info className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your Inventory is Empty</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start by detecting foods using the camera or uploading images, then add them to your inventory.
                </p>
              </div>
            ) : (
              <div className="text-muted-foreground">
                No items match your search or filter criteria.
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filteredInventory.map((item) => (
              <div key={item.id} className="p-4 hover:bg-muted/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h3 className="text-lg font-medium capitalize">{item.name}</h3>
                      <div className="ml-4 flex gap-2">
                          {(item.nutrients.dietarySuitability || []).slice(0, 2).map((diet, index) => (
                          <span 
                            key={index} 
                            className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground"
                          >
                            {diet}
                          </span>
                        ))}
                        {(item.nutrients.dietarySuitability || []).length > 2 && (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            +{(item.nutrients.dietarySuitability || []).length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <div className="flex items-center mr-4">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(item.dateAdded)}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span>{item.nutrients.calories} kcal</span>
                        <span className="text-muted-foreground/40">•</span>
                        <span>{item.nutrients.protein}g protein</span>
                        <span className="text-muted-foreground/40">•</span>
                        <span>{item.nutrients.carbs}g carbs</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodInventory;
