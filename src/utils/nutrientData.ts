
// This is a simulated nutrition database
// In a real app, this would come from an API or a comprehensive database

interface NutrientInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  benefits: string[];
  dietarySuitability: string[];
}

const nutritionDatabase: Record<string, NutrientInfo> = {
  apple: {
    calories: 52,
    protein: 0.3,
    carbs: 13.8,
    fat: 0.2,
    fiber: 2.4,
    sugar: 10.4,
    benefits: [
      'Rich in antioxidants',
      'Supports heart health',
      'Improves gut bacteria',
      'May help lower cholesterol'
    ],
    dietarySuitability: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Paleo']
  },
  banana: {
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12.2,
    benefits: [
      'Good source of potassium',
      'Supports digestive health',
      'Rich in vitamin B6',
      'Provides energy boost'
    ],
    dietarySuitability: ['Vegan', 'Vegetarian', 'Gluten-Free']
  },
  broccoli: {
    calories: 34,
    protein: 2.8,
    carbs: 6.6,
    fat: 0.4,
    fiber: 2.6,
    sugar: 1.7,
    benefits: [
      'Packed with vitamins and minerals',
      'Contains potent antioxidants',
      'Rich in fiber',
      'Supports detoxification'
    ],
    dietarySuitability: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Keto', 'Paleo']
  },
  carrot: {
    calories: 41,
    protein: 0.9,
    carbs: 9.6,
    fat: 0.2,
    fiber: 2.8,
    sugar: 4.7,
    benefits: [
      'Rich in beta-carotene',
      'Promotes eye health',
      'Boosts immune system',
      'Supports skin health'
    ],
    dietarySuitability: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Paleo']
  },
  salmon: {
    calories: 208,
    protein: 20.4,
    carbs: 0,
    fat: 13.4,
    fiber: 0,
    sugar: 0,
    benefits: [
      'Excellent source of omega-3 fatty acids',
      'High in protein',
      'Rich in B vitamins',
      'Good source of potassium and selenium'
    ],
    dietarySuitability: ['Gluten-Free', 'Keto', 'Paleo']
  },
  chicken: {
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    benefits: [
      'Excellent source of protein',
      'Rich in vitamins and minerals',
      'Supports muscle growth',
      'Low in fat (without skin)'
    ],
    dietarySuitability: ['Gluten-Free', 'Keto', 'Paleo']
  },
  rice: {
    calories: 130,
    protein: 2.7,
    carbs: 28.2,
    fat: 0.3,
    fiber: 0.4,
    sugar: 0.1,
    benefits: [
      'Good source of energy',
      'Easy to digest',
      'Naturally gluten-free',
      'Low in fat'
    ],
    dietarySuitability: ['Vegan', 'Vegetarian', 'Gluten-Free']
  },
  pasta: {
    calories: 158,
    protein: 5.8,
    carbs: 30.9,
    fat: 0.9,
    fiber: 1.8,
    sugar: 0.6,
    benefits: [
      'Good source of complex carbohydrates',
      'Provides sustained energy',
      'Contains essential minerals',
      'Low in sodium and cholesterol'
    ],
    dietarySuitability: ['Vegetarian']
  },
  avocado: {
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
    sugar: 0.7,
    benefits: [
      'Rich in healthy fats',
      'High in fiber',
      'Contains more potassium than bananas',
      'Loaded with antioxidants'
    ],
    dietarySuitability: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Keto', 'Paleo']
  },
  eggs: {
    calories: 155,
    protein: 12.6,
    carbs: 0.6,
    fat: 10.6,
    fiber: 0,
    sugar: 0.6,
    benefits: [
      'Complete source of protein',
      'Rich in choline, which supports brain health',
      'Contains lutein and zeaxanthin for eye health',
      'Good source of vitamin D'
    ],
    dietarySuitability: ['Vegetarian', 'Gluten-Free', 'Keto', 'Paleo']
  }
};

// Default nutrient data for unknown foods
const defaultNutrientData: NutrientInfo = {
  calories: 100,
  protein: 2,
  carbs: 15,
  fat: 2,
  fiber: 1,
  sugar: 5,
  benefits: [
    'Nutritional information not available',
    'Consider researching this food further'
  ],
  dietarySuitability: ['Unknown']
};

export const getNutrientData = (foodName: string): NutrientInfo => {
  const normalizedFoodName = foodName.toLowerCase().trim();
  return nutritionDatabase[normalizedFoodName] || defaultNutrientData;
};
