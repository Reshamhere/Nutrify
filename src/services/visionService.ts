import axios from "axios";

interface FoodItem {
  name: string;
  quantity?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodDetectionResult {
  foods: FoodItem[];
  primaryFood: FoodItem;
}

export async function analyzeFoodImageWithNutrition(
  base64Image: string, 
  apiKey: string
): Promise<FoodDetectionResult> {
  const endpoint = "https://zerocarbonocr.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview";

  const payload = {
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: `You are a food recognition and nutrition analysis AI. 
                  Identify all food items and estimate their nutrition for typical serving sizes.
                  Respond with this exact JSON format only:
                  {
                    "foods": [
                      {
                        "name": "food name",
                        "quantity": "estimated serving size",
                        "calories": number,
                        "protein": number,
                        "carbs": number,
                        "fat": number
                      }
                    ]
                  }`
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: base64Image,
            },
          },
        ],
      },
    ],
    temperature: 0.2,
    top_p: 0.95,
    max_tokens: 1000,
    response_format: { type: "json_object" },
  };

  try {
    interface VisionApiResponse {
      choices: {
        message: {
          content: string;
        };
      }[];
    }

    const { data } = await axios.post(endpoint, payload, {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
    });

    const result = JSON.parse((data as VisionApiResponse).choices[0]?.message?.content);
    
    if (!result?.foods?.length) {
      throw new Error("No foods detected");
    }

    return {
      foods: result.foods,
      primaryFood: result.foods[0] // First food is considered primary
    };
  } catch (error) {
    console.error("Vision API error:", error);
    throw new Error(`Food analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}