// This file contains the types and interfaces used in the food recognition module.
export interface FoodItem {
  name: string;
  quantity?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface FoodDetectionResult {
  foods: FoodItem[];
  primaryFood: FoodItem;
}

export interface InventoryItem {
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