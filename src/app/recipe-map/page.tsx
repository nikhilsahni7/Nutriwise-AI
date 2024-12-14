// app/page.tsx
"use client";

import React, { useState, useCallback, useEffect, ChangeEvent } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecipesDialog } from "@/components/recipe-dailog";
// types/index.ts
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

const continents = [
  { name: "African", coordinates: { lat: 1.6508, lng: 10.2679 } },
  { name: "European", coordinates: { lat: 54.526, lng: 15.2551 } },
  { name: "North American", coordinates: { lat: 54.526, lng: -105.2551 } },
  { name: "South American", coordinates: { lat: -8.7832, lng: -55.4915 } },
  { name: "Indian Subcontinent", coordinates: { lat: 20.5937, lng: 78.9629 } },
];

export default function SocialConnectMap() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const fetchRecipes = async (continent: string | null = null) => {
    try {
      const response = await fetch(
        `/api/recipes-map${
          continent ? `?continent=${encodeURIComponent(continent)}` : ""
        }&limit=10`
      );
      const data = await response.json();
      if (data.payload && Array.isArray(data.payload.data)) {
        setRecipes(data.payload.data);
        setFilteredRecipes(data.payload.data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    if (selectedContinent) {
      fetchRecipes(selectedContinent);
    }
  }, [selectedContinent]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    mapInstance.setCenter({ lat: 20.0, lng: 0.0 });
    mapInstance.setZoom(2);
    setMap(mapInstance);
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    const filtered = recipes.filter(
      (recipe) =>
        recipe.Recipe_title.toLowerCase().includes(value.toLowerCase()) ||
        recipe.Region.toLowerCase().includes(value.toLowerCase()) ||
        recipe.Sub_region.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader2 className="w-16 h-16 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        onLoad={onLoad}
        options={{
          mapTypeId: "roadmap",
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {continents.map((continent) => (
          <Marker
            key={continent.name}
            position={continent.coordinates}
            onClick={() => setSelectedContinent(continent.name)}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="60" viewBox="0 0 40 60">
                  <path d="M20 0 C8.954 0 0 8.954 0 20 C0 35 20 60 20 60 C20 60 40 35 40 20 C40 8.954 31.046 0 20 0 Z" fill="#FF6347" />
                  <text x="20" y="35" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="white">🍲</text>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(40, 60),
              anchor: new google.maps.Point(20, 60),
            }}
          />
        ))}
      </GoogleMap>

      <div className="absolute top-4 left-4 flex space-x-2 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsModalOpen(true)}
          className="bg-white hover:bg-gray-100"
        >
          <Search className="h-6 w-6 text-gray-700" />
        </Button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Search Recipes</CardTitle>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <Input
              placeholder="Search recipes"
              value={searchQuery}
              onChange={handleSearch}
            />
            <ScrollArea className="mt-4">
              {filteredRecipes.map((recipe) => (
                <Card key={recipe.Recipe_id} className="mb-4">
                  <CardHeader>
                    <CardTitle>{recipe.Recipe_title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {recipe.Region}, {recipe.Sub_region}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <RecipesDialog
        isOpen={selectedContinent !== null}
        onClose={() => setSelectedContinent(null)}
        title={selectedContinent || ""}
        recipes={filteredRecipes}
      />
    </div>
  );
}
