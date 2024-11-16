import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/lib/utils.ts
export function calculateScaledNutrients(nutrients: any, portions: number) {
  return {
    calories: nutrients.calories * portions,
    protein: nutrients.protein * portions,
    carbs: nutrients.carbs * portions,
    fats: nutrients.fats * portions,
    fiber: nutrients.fiber ? nutrients.fiber * portions : null,
    iron: nutrients.iron ? nutrients.iron * portions : null,
    calcium: nutrients.calcium ? nutrients.calcium * portions : null,
    potassium: nutrients.potassium ? nutrients.potassium * portions : null,
    vitaminA: nutrients.vitaminA ? nutrients.vitaminA * portions : null,
    vitaminC: nutrients.vitaminC ? nutrients.vitaminC * portions : null,
  };
}

export function calculateTotalNutrients(meals: any[]) {
  return meals.reduce(
    (acc, meal) => ({
      totalCalories: acc.totalCalories + meal.nutrients.calories,
      totalProtein: acc.totalProtein + meal.nutrients.protein,
      totalCarbs: acc.totalCarbs + meal.nutrients.carbs,
      totalFats: acc.totalFats + meal.nutrients.fats,
    }),
    {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
    }
  );
}
