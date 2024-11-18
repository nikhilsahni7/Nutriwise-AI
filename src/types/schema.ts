// types/schema.ts
export enum Gender {
  male = "male",
  female = "female",
  other = "other",
}

export enum PhysicalActivityLevel {
  low = "low",
  moderate = "moderate",
  high = "high",
}

export enum Goals {
  loseWeight = "loseWeight",
  gainWeight = "gainWeight",
  maintainWeight = "maintainWeight",
}

export enum DietPreference {
  vegetarian = "vegetarian",
  vegan = "vegan",
  paleo = "paleo",
  keto = "keto",
  mediterranean = "mediterranean",
}

export enum Region {
  southAmerican = "southAmerican",
  northAmerican = "northAmerican",
  indianSubcontinent = "indianSubcontinent",
  european = "european",
}

export interface UserProfile {
  yearOfBirth?: number;
  height?: number;
  weight?: number;
  gender?: Gender;
  physicalActivityLevel?: PhysicalActivityLevel;
  goals?: Goals;
  dietPreference?: DietPreference;
  bmi?: number;
  foodAllergies?: string[];
  foodsToAvoid?: string[];
  region?: Region;
}
// types/chat.ts
export interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
  isLoading?: boolean;
}

export interface ChatResponse {
  response: string;
  error?: string;
}

export interface Recipe {
  Recipe_id: string;
  Recipe_title: string;
  img_url: string;
  Region: string;
  Sub_region: string;
  Calories: number;
  "Protein (g)": number;
  "Carbohydrate, by difference (g)": number;
  "Total lipid (fat) (g)": number;
  total_time: number;
  url: string;
}

export interface UserPreferences {
  goals: string;
  dietPreference: string;
  foodAllergies: string[];
  foodsToAvoid: string[];
  physicalActivityLevel: string;
  region: string;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    vitaminC: number;
  };
  sourceUrl: string;
  readyInMinutes: number;
  servings: number;
}

export interface NutritionGaps {
  needsProtein: boolean;
  needsFiber: boolean;
  needsVitaminC: boolean;
  lowCalories: boolean;
  highCalories: boolean;
}

export interface SavedRecipe {
  id: string;
  userId: string;
  recipeId: string;
  name: string;
  image: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  savedAt: Date;
  rating: number | null;
  cooked: boolean;
}
