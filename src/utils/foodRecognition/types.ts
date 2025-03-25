
import * as tf from '@tensorflow/tfjs';

export interface FoodDetectionResult {
  name: string;
  confidence: number;
}

export interface ModelState {
  model: tf.GraphModel | null;
  isInitialized: boolean;
}

export const FOOD_CLASSES = [
  'apple', 'banana', 'broccoli', 'carrot', 'chicken', 
  'rice', 'pasta', 'salmon', 'avocado', 'eggs'
];
