
import { toast } from 'sonner';
import { getNutrientData as getLocalNutrientData } from '../utils/nutrientData';

export interface FoodItem {
  id: string;
  name: string;
  category?: string;
}

export interface NutrientInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  benefits: string[];
  dietarySuitability: string[];
}

// We'll implement a service to fetch data from an open food API
// and fall back to our local database when needed
export const fetchFoodItems = async (): Promise<FoodItem[]> => {
  try {
    // First, try to fetch from the Open Food Facts API
    const response = await fetch('https://world.openfoodfacts.org/api/v0/product_categories.json');
    
    if (!response.ok) {
      throw new Error('Failed to fetch food categories');
    }
    
    const data = await response.json();
    
    // Extract and format food categories
    const categories = data.tags || [];
    const foodItems: FoodItem[] = categories
      .filter((cat: any) => cat.products > 100 && cat.name)
      .slice(0, 300) // Limit to 300 items 
      .map((cat: any) => ({
        id: cat.id,
        name: cat.name.toLowerCase(),
        category: cat.name
      }));
    
    // If no items found, throw error
    if (foodItems.length === 0) {
      throw new Error('No food items found');
    }
    
    return foodItems;
  } catch (error) {
    console.error('Error fetching food data from API:', error);
    
    // Fall back to local data
    return getFallbackFoodItems();
  }
};

// Cached food items to avoid repeated API calls
let cachedFoodItems: FoodItem[] | null = null;

export const getAllFoodItems = async (): Promise<FoodItem[]> => {
  try {
    if (cachedFoodItems) {
      return cachedFoodItems;
    }
    
    const items = await fetchFoodItems();
    cachedFoodItems = items;
    return items;
  } catch (error) {
    console.error('Error getting food items:', error);
    toast.error('Error loading food database');
    return getFallbackFoodItems();
  }
};

export const searchFoodItems = async (term: string): Promise<FoodItem[]> => {
  const allItems = await getAllFoodItems();
  
  if (!term || term.length < 2) {
    return [];
  }
  
  return allItems.filter(item => 
    item.name.toLowerCase().includes(term.toLowerCase())
  ).slice(0, 10); // Limit to 10 results for UI performance
};

export const getFoodNutrients = async (foodName: string): Promise<NutrientInfo> => {
  try {
    // Try to fetch from USDA API (using a proxy service to simulate)
    const search = foodName.toLowerCase().trim();
    const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${search}&search_simple=1&action=process&json=1`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch nutrition data');
    }
    
    const data = await response.json();
    
    if (data.products && data.products.length > 0) {
      const product = data.products[0];
      
      // Extract dietary tags
      const dietaryTags: string[] = [];
      if (product.ingredients_analysis_tags) {
        if (product.ingredients_analysis_tags.includes('en:vegan')) dietaryTags.push('Vegan');
        if (product.ingredients_analysis_tags.includes('en:vegetarian')) dietaryTags.push('Vegetarian');
      }
      
      // Add default tags if none found
      if (dietaryTags.length === 0) {
        dietaryTags.push('Unknown');
      }
      
      // Add gluten-free if applicable
      if (product.allergens_tags && !product.allergens_tags.includes('en:gluten')) {
        dietaryTags.push('Gluten-Free');
      }
      
      return {
        calories: product.nutriments?.['energy-kcal_100g'] || 100,
        protein: product.nutriments?.proteins_100g || 0,
        carbs: product.nutriments?.carbohydrates_100g || 0,
        fat: product.nutriments?.fat_100g || 0,
        fiber: product.nutriments?.fiber_100g || 0,
        sugar: product.nutriments?.sugars_100g || 0,
        benefits: [
          'Nutritional information from Open Food Facts',
          product.nutrition_grade_fr ? `Nutrition grade: ${product.nutrition_grade_fr.toUpperCase()}` : 'No nutrition grade available'
        ],
        dietarySuitability: dietaryTags
      };
    }
    
    throw new Error('No nutrition data found');
  } catch (error) {
    console.error('Error fetching food nutrients:', error);
    
    // Fall back to local data
    // return getLocalNutrientData(foodName);
  }
};

// Local fallback data
const getFallbackFoodItems = (): FoodItem[] => {
  return [
    { id: '1', name: 'apple' },
    { id: '2', name: 'banana' },
    { id: '3', name: 'broccoli' },
    { id: '4', name: 'carrot' },
    { id: '5', name: 'salmon' },
    { id: '6', name: 'chicken' },
    { id: '7', name: 'rice' },
    { id: '8', name: 'pasta' },
    { id: '9', name: 'avocado' },
    { id: '10', name: 'eggs' },
    { id: '11', name: 'beef' },
    { id: '12', name: 'pork' },
    { id: '13', name: 'tofu' },
    { id: '14', name: 'spinach' },
    { id: '15', name: 'kale' },
    { id: '16', name: 'quinoa' },
    { id: '17', name: 'almond' },
    { id: '18', name: 'yogurt' },
    { id: '19', name: 'orange' },
    { id: '20', name: 'potato' }
  ];
};

// Import from existing nutrient data and extend


export { getLocalNutrientData };
