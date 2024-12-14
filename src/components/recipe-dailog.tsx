// components/recipe-dialog.tsx
import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface Recipe {
  Recipe_id: string;
  Recipe_title: string;
  cook_time: string;
  prep_time: string;
  img_url: string;
  url: string;
  Continent: string;
  Region: string;
  Sub_region: string;
  Calories: string;
  total_time: string;
  Utensils: string;
  Processes: string;
}

interface RecipesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  recipes: Recipe[];
}

export function RecipesDialog({
  isOpen,
  onClose,
  title,
  recipes,
}: RecipesDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-50 w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {recipes.length === 0 ? (
              <p className="text-center text-gray-500">No recipes found.</p>
            ) : (
              recipes.map((recipe) => (
                <Card key={recipe.Recipe_id} className="recipe-card">
                  <CardHeader>
                    <CardTitle>{recipe.Recipe_title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={recipe.img_url}
                      alt={recipe.Recipe_title}
                      className="w-full h-40 object-cover rounded"
                    />
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        {recipe.Region}, {recipe.Sub_region}
                      </p>
                      <p>
                        <strong>Cook Time:</strong> {recipe.cook_time} mins |{" "}
                        <strong>Prep Time:</strong> {recipe.prep_time} mins
                      </p>
                      <p>
                        <strong>Total Time:</strong> {recipe.total_time} mins
                      </p>
                      <p>
                        <strong>Calories:</strong> {recipe.Calories}
                      </p>
                      <p>
                        <strong>Utensils:</strong> {recipe.Utensils}
                      </p>
                      <p>
                        <strong>Processes:</strong> {recipe.Processes}
                      </p>
                      <a
                        href={recipe.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded"
                      >
                        View Recipe
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
