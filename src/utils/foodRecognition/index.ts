
import * as tf from '@tensorflow/tfjs';
import { FoodDetectionResult } from './types';
import { initModel, getModelState } from './modelLoader';
import { preprocessImage, findTopKIndices } from './imagePreprocessing';
import { mapToFoodClass, fallbackClassify } from './predictionMapper';

// Re-export the initialization function
export { initModel } from './modelLoader';

/**
 * Classify an image using the loaded model
 */
export const classifyImage = async (canvas: HTMLCanvasElement): Promise<FoodDetectionResult | null> => {
  const { model, isInitialized } = getModelState();
  
  if (!isInitialized) {
    throw new Error('Model not initialized. Call initModel() first.');
  }
  
  try {
    if (model) {
      // Preprocess the image
      const tensor = preprocessImage(canvas);
      
      // Run prediction
      const predictions = await model.predict(tensor) as tf.Tensor;
      
      // Get results
      const data = await predictions.data();
      
      // Cleanup tensors
      tensor.dispose();
      predictions.dispose();
      
      // Get top 5 predictions
      const topIndices = findTopKIndices(Array.from(data), 5);
      
      // Map the prediction to our food classes (with some heuristics)
      const result = mapToFoodClass(topIndices, Array.from(data), canvas);
      
      return result;
    } else {
      // Fallback to advanced color analysis if model loading failed
      return fallbackClassify(canvas);
    }
  } catch (error) {
    console.error('Error during classification:', error);
    // Fallback to color-based classification
    return fallbackClassify(canvas);
  }
};
