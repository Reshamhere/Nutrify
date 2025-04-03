import { useState, useRef, useEffect } from 'react';

const EDAMAM_APP_ID = 'f7a5d712';
const EDAMAM_APP_KEY = '9c456d19e25ec4a370df4f685f055840';

interface NutrientInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

// Default nutrient data for unknown foods
const defaultNutrientData: NutrientInfo = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
};


export const getNutrientData = async (foodName: string): Promise<NutrientInfo> => {
  // Skip API call for unknown or empty foods
  if (!foodName || foodName.toLowerCase().includes('unknown')) {
    return defaultNutrientData;
  }

  try {
    // Clean the food name - remove anything in parentheses and special characters
    const cleanFoodName = foodName
      .replace(/\(.*?\)/g, '') // Remove anything in parentheses
      .replace(/[^\w\s]/g, '') // Remove special characters
      .trim();

    if (!cleanFoodName) {
      return defaultNutrientData;
    }

    const response = await fetch(
      `https://api.edamam.com/api/nutrition-data?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&ingr=${encodeURIComponent(cleanFoodName)}`
    );

    console.log('Nutrition API response status:', response.status);

    if (!response.ok) {
      // More specific error messages
      if (response.status === 401) {
        throw new Error('Unauthorized - please check your Edamam API credentials');
      }
      if (response.status === 404) {
        return defaultNutrientData;
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Nutrition API response data:', data);

    // Handle cases where the API returns no meaningful data
    if (!data || (!data.calories && !data.totalNutrients)) {
      return defaultNutrientData;
    }

    return {
      calories: Math.round(data.calories || 0),
      protein: Math.round(data.totalNutrients?.PROCNT?.quantity || 0),
      carbs: Math.round(data.totalNutrients?.CHOCDF?.quantity || 0),
      fat: Math.round(data.totalNutrients?.FAT?.quantity || 0),
      fiber: Math.round(data.totalNutrients?.FIBTG?.quantity || 0),
      sugar: Math.round(data.totalNutrients?.SUGAR?.quantity || 0),
    };
  } catch (error) {
    console.error('Error in getNutrientData:', error);
    return defaultNutrientData;
  }
};

// Hook for nutrition data fetching
export const useNutritionData = (foodName: string | null) => {
  const [nutritionData, setNutritionData] = useState<NutrientInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!foodName) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getNutrientData(foodName);
        setNutritionData(data);
      } catch (err) {
        setError('Failed to fetch nutrition data');
        setNutritionData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [foodName]);

  return { nutritionData, isLoading, error };
};

