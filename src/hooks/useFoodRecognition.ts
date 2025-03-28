
// import { useState, useCallback } from 'react';
// import { analyzeFoodImage } from '../services/visionService';

// export default function useFoodRecognition() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [result, setResult] = useState<FoodDetectionResult | null>(null);

//   const recognizeFood = useCallback(async (imageFile: File | HTMLCanvasElement) => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       // Handle both File and Canvas inputs
//       let base64 = '';
//       if (imageFile instanceof HTMLCanvasElement) {
//         base64 = imageFile.toDataURL('image/jpeg', 0.8);
//       } else {
//         base64 = await convertToBase64(imageFile);
//       }

//       const detection = await analyzeFoodImage(base64, import.meta.env.VITE_AZURE_VISION_API_KEY);
//       setResult(detection);
//       return detection;
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Recognition failed';
//       setError(message);
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   return { recognizeFood, result, isLoading, error, reset: () => setResult(null) };
// }

// async function convertToBase64(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// }