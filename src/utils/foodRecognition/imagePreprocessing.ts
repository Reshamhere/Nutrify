
import * as tf from '@tensorflow/tfjs';

/**
 * Preprocess the image for the model
 */
export const preprocessImage = (canvas: HTMLCanvasElement): tf.Tensor => {
  // Get image data from canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Convert to tensor and preprocess
  return tf.tidy(() => {
    // Convert to tensor
    const tensor = tf.browser.fromPixels(imgData)
      // Resize to match model input
      .resizeBilinear([224, 224])
      // Normalize pixel values to [-1, 1]
      .toFloat()
      .sub(127.5)
      .div(127.5)
      .expandDims(0);
    
    return tensor;
  });
};

/**
 * Find the indices of the top k values in an array
 */
export const findTopKIndices = (arr: number[], k: number): number[] => {
  return Array.from(arr.keys())
    .sort((a, b) => arr[b] - arr[a])
    .slice(0, k);
};
