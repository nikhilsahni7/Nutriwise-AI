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
