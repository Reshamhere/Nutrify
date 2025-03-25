
import { FOOD_CLASSES } from './types';

/**
 * Map ImageNet predictions to our food classes using heuristics
 */
export const mapToFoodClass = (
  topIndices: number[], 
  predictions: number[], 
  canvas: HTMLCanvasElement
): { name: string; confidence: number } => {
  // ImageNet indices for food categories (approximate mapping)
  const appleIndices = [948, 949, 950, 951, 952, 953];
  const bananaIndices = [954, 955];
  const broccoliIndices = [924, 925, 926];
  const carrotIndices = [918, 919, 920];
  
  // Check if any of our target foods match the top predictions
  for (const index of topIndices) {
    if (appleIndices.includes(index)) {
      return { name: 'apple', confidence: predictions[index] };
    } else if (bananaIndices.includes(index)) {
      return { name: 'banana', confidence: predictions[index] };
    } else if (broccoliIndices.includes(index)) {
      return { name: 'broccoli', confidence: predictions[index] };
    } else if (carrotIndices.includes(index)) {
      return { name: 'carrot', confidence: predictions[index] };
    }
  }
  
  // If no direct mapping, use color analysis as a fallback
  return fallbackClassify(canvas);
};

/**
 * Fallback classification using color analysis
 */
export const fallbackClassify = (canvas: HTMLCanvasElement): { name: string; confidence: number } => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { name: 'unknown food', confidence: 0.5 };
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const pixelCount = data.length / 4;
  
  // Calculate color dominance
  let redSum = 0, greenSum = 0, blueSum = 0;
  let yellowCount = 0, orangeCount = 0, greenCount = 0, redCount = 0, brownCount = 0, whiteCount = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    redSum += r;
    greenSum += g;
    blueSum += b;
    
    // Better color detection with improved thresholds
    if (r > 180 && g > 180 && b < 100) yellowCount++;
    if (r > 180 && g > 80 && g < 170 && b < 80) orangeCount++;
    if (g > 130 && g > r * 1.2 && g > b * 1.2) greenCount++;
    if (r > 180 && r > g * 1.5 && r > b * 1.5) redCount++;
    if (r > 100 && r < 180 && g > 40 && g < 120 && b < 80) brownCount++;
    if (r > 200 && g > 200 && b > 200) whiteCount++;
  }
  
  // Calculate percentages
  const yellowPercent = yellowCount / pixelCount;
  const orangePercent = orangeCount / pixelCount;
  const greenPercent = greenCount / pixelCount;
  const redPercent = redCount / pixelCount;
  const brownPercent = brownCount / pixelCount;
  const whitePercent = whiteCount / pixelCount;
  
  const avgRed = redSum / pixelCount;
  const avgGreen = greenSum / pixelCount;
  const avgBlue = blueSum / pixelCount;
  
  // Determine dominant color signature
  let food = 'unknown food';
  let confidence = 0.5;
  
  // Improved classification logic with better thresholds
  if (yellowPercent > 0.15 && avgRed > 150 && avgGreen > 150 && avgBlue < 120) {
    food = 'banana';
    confidence = 0.7 + yellowPercent;
  } else if (greenPercent > 0.2) {
    if (avgGreen/avgRed > 1.3) {
      food = 'broccoli';
      confidence = 0.7 + greenPercent * 0.5;
    } else {
      food = 'avocado';
      confidence = 0.7 + greenPercent * 0.3;
    }
  } else if (orangePercent > 0.1) {
    food = 'carrot';
    confidence = 0.7 + orangePercent;
  } else if (redPercent > 0.15) {
    food = 'apple';
    confidence = 0.7 + redPercent;
  } else if (brownPercent > 0.25) {
    food = 'chicken';
    confidence = 0.6 + brownPercent * 0.5;
  } else if (whitePercent > 0.4) {
    food = 'rice';
    confidence = 0.7 + whitePercent * 0.3;
  } else if (brownPercent > 0.1 && whitePercent > 0.1) {
    food = 'pasta';
    confidence = 0.65;
  } else if (avgRed > 160 && avgGreen < 130 && avgBlue > 110) {
    food = 'salmon';
    confidence = 0.75;
  } else if (whitePercent > 0.3 && yellowPercent > 0.1) {
    food = 'eggs';
    confidence = 0.7;
  }
  
  // Cap confidence at 0.95
  confidence = Math.min(0.95, confidence);
  
  return { name: food, confidence };
};
