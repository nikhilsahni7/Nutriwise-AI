"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { toast } from "sonner";

function MealTracker() {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [mealType, setMealType] = useState<string>("");
  const [portions, setPortions] = useState("1");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile || !mealType) {
      toast.error("Please select an image and meal type");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("imageFile", imageFile);
      formData.append("mealType", mealType.toLowerCase());
      formData.append("portions", portions);

      const response = await fetch("/api/meals/confirm", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload meal");
      }

      toast.success("Meal logged successfully!");
      resetForm();

      setTimeout(() => {
        window.location.href = "/main/dashboard"; 
      }, 250);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to log meal"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview("");
    setMealType("");
    setPortions("1");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-4xl">Track Your Meal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Select value={mealType} onValueChange={setMealType}>
          <SelectTrigger>
            <SelectValue placeholder="Select meal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BREAKFAST">Breakfast</SelectItem>
            <SelectItem value="LUNCH">Lunch</SelectItem>
            <SelectItem value="DINNER">Dinner</SelectItem>
            <SelectItem value="SNACK">Snack</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <Label>Portions</Label>
          <Input
            type="number"
            value={portions}
            onChange={(e) => setPortions(e.target.value)}
            min="0.25"
            step="0.25"
          />
        </div>

        <div className="space-y-2">
          <Label>Upload Food Image</Label>
          <div className="flex flex-col items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <Label
              htmlFor="image-upload"
              className="flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
            >
              <Upload className="w-8 h-8" />
              <span>Click to upload image</span>
            </Label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-w-md rounded-lg"
              />
            )}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={loading || !imageFile || !mealType}
        >
          {loading ? "Processing..." : "Track Meal"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default MealTracker;
