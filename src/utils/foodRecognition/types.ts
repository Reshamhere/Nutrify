// This file contains the types and interfaces used in the food recognition module.
export interface FoodItem {
  name: string;
  quantity?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodDetectionResult {
  foods: FoodItem[];
  primaryFood: FoodItem;
}
