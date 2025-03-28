import { FoodItem, FoodDetectionResult } from './types';
import { analyzeFoodImageWithNutrition } from '../../services/visionService';
import { fallbackClassify } from './predictionMapper';

const AZURE_VISION_API_KEY = import.meta.env.VITE_AZURE_VISION_API_KEY;

export const classifyImage = async (canvas: HTMLCanvasElement): Promise<FoodDetectionResult> => {
  try {
    // Convert canvas to base64 with compression
    const base64 = await new Promise<string>((resolve) => {
      canvas.toBlob(
        (blob) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob!);
        },
        'image/jpeg',
        0.8 // 80% quality for smaller file size
      );
    });

    // Use GPT-4 Vision API with retry logic
    let retries = 2;
    while (retries > 0) {
      try {
        const result = await analyzeFoodImageWithNutrition(base64, AZURE_VISION_API_KEY);
        return result;
      } catch (error) {
        if (retries === 1) throw error; // Only throw on last retry
        retries--;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      }
    }

    throw new Error('Max retries exceeded');
  } catch (error) {
    console.error('Vision API failed, using fallback:', error);
    // Fallback to color analysis with adjusted return type
    const fallbackResult = fallbackClassify(canvas);
    return {
      foods: [{
        name: fallbackResult.name,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }],
      primaryFood: {
        name: fallbackResult.name,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    };
  }
};

// Empty initialization function (kept for backward compatibility)
export const initModel = async (): Promise<void> => {
  console.log('Using GPT-4 Vision API - no model initialization required');
  return Promise.resolve();
};