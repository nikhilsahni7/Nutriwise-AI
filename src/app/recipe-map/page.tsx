"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Loader2, MapPin, List, Clock, Utensils, FlameIcon as Fire, ChefHat, ExternalLink } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"

export interface Recipe {
  Recipe_id: string
  Recipe_title: string
  cook_time: string
  prep_time: string
  img_url: string
  url: string
  Continent: string
  Region: string
  Sub_region: string
  Calories: string
  total_time: string
  Utensils: string
  Processes: string
}

const continents = [
  { name: "African", coordinates: { lat: 1.6508, lng: 10.2679 } },
  { name: "European", coordinates: { lat: 54.526, lng: 15.2551 } },
  { name: "North American", coordinates: { lat: 54.526, lng: -105.2551 } },
  { name: "South American", coordinates: { lat: -8.7832, lng: -55.4915 } },
  { name: "Indian Subcontinent", coordinates: { lat: 20.5937, lng: 78.9629 } },
]

export default function SocialConnectMap() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const mapRef = useRef<google.maps.Map | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  const fetchRecipes = useCallback(async (continent: string | null = null) => {
    try {
      const response = await fetch(
        `/api/recipes-map${continent ? `?continent=${encodeURIComponent(continent)}` : ""}&limit=10`
      )
      const data = await response.json()
      if (data.payload && Array.isArray(data.payload.data)) {
        setRecipes(data.payload.data)
        setFilteredRecipes(data.payload.data)
      }
    } catch (error) {
      console.error("Error fetching recipes:", error)
    }
  }, [])

  useEffect(() => {
    if (selectedContinent) {
      fetchRecipes(selectedContinent)
    }
  }, [selectedContinent, fetchRecipes])

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    mapInstance.setCenter({ lat: 20.0, lng: 0.0 })
    mapInstance.setZoom(2)
    setMap(mapInstance)
    mapRef.current = mapInstance
  }, [])

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
    const filtered = recipes.filter(
      (recipe) =>
        recipe.Recipe_title.toLowerCase().includes(value.toLowerCase()) ||
        recipe.Region.toLowerCase().includes(value.toLowerCase()) ||
        recipe.Sub_region.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredRecipes(filtered)
  }, [recipes])

  const handleMarkerClick = useCallback((continent: string) => {
    setSelectedContinent(continent)
    const continentData = continents.find((c) => c.name === continent)
    if (continentData && mapRef.current) {
      mapRef.current.panTo(continentData.coordinates)
      mapRef.current.setZoom(4)
    }
    // Simulate selecting a random recipe from the continent
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]
    setSelectedRecipe(randomRecipe)
  }, [recipes])

  const handleCloseSearch = useCallback(() => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setFilteredRecipes(recipes)
  }, [recipes])

  const handleRecipeClick = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe)
  }, [])

  if (loadError) {
    return <div>Error loading maps</div>
  }

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader2 className="w-16 h-16 text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {viewMode === "map" && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={onLoad}
          options={{
            mapTypeId: "roadmap",
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
              {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [{ color: "#7c93a3" }, { lightness: "-10" }],
              },
              {
                featureType: "administrative.country",
                elementType: "geometry",
                stylers: [{ visibility: "on" }],
              },
              {
                featureType: "administrative.country",
                elementType: "geometry.stroke",
                stylers: [{ color: "#a0a4a5" }],
              },
              {
                featureType: "administrative.province",
                elementType: "geometry.stroke",
                stylers: [{ color: "#62838e" }],
              },
              {
                featureType: "landscape",
                elementType: "geometry.fill",
                stylers: [{ color: "#dde3e3" }],
              },
              {
                featureType: "landscape.man_made",
                elementType: "geometry.stroke",
                stylers: [{ color: "#3f4a51" }, { weight: "0.30" }],
              },
              {
                featureType: "poi",
                elementType: "all",
                stylers: [{ visibility: "simplified" }],
              },
              {
                featureType: "road.highway",
                elementType: "all",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "transit",
                elementType: "all",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{ color: "#a3c7df" }],
              },
            ],
          }}
        >
          {continents.map((continent) => (
            <Marker
              key={continent.name}
              position={continent.coordinates}
              onClick={() => handleMarkerClick(continent.name)}
              onMouseOver={() => setHoveredMarker(continent.name)}
              onMouseOut={(e) => {
                // Check if mouse is leaving the entire marker area and InfoWindow
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget || !relatedTarget.closest(".info-window")) {
                  setHoveredMarker(null);
                }
              }}
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
          {hoveredMarker && (
            <InfoWindow
              position={continents.find((c) => c.name === hoveredMarker)?.coordinates}
              onCloseClick={() => setHoveredMarker(null)}
            >
              <div
                className="bg-white p-4 rounded-lg shadow-lg info-window"
                onMouseEnter={() => setHoveredMarker(hoveredMarker)} // Keep InfoWindow open while hovering
                onMouseLeave={() => setHoveredMarker(null)} // Close InfoWindow when leaving
              >
                <h3 className="font-bold text-lg mb-2">{hoveredMarker} Cuisine</h3>
                <p className="text-sm text-gray-600">
                  Click to explore delicious recipes from this region!
                </p>
                <div className="mt-2 flex items-center text-yellow-500">
                  <span className="material-icons w-4 h-4 mr-1">restaurant_menu</span>
                  <span className="text-xs">Discover unique flavors</span>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}


      {viewMode === "list" && (
        <div className="h-full w-full bg-gray-100 p-4 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.Recipe_id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleRecipeClick(recipe)}>
                <CardHeader>
                  <CardTitle>{recipe.Recipe_title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <Image
                      src={recipe.img_url || "/placeholder.svg?height=200&width=400"}
                      alt={recipe.Recipe_title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {recipe.Region}, {recipe.Sub_region}
                  </p>
                  <p className="text-sm text-gray-600">
                    Prep time: {recipe.prep_time} | Cook time: {recipe.cook_time}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 flex space-x-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsSearchOpen(true)}
          className="bg-white hover:bg-gray-100 shadow-md"
        >
          <Search className="h-6 w-6 text-gray-700" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
          className="bg-white hover:bg-gray-100 shadow-md"
        >
          {viewMode === "map" ? (
            <List className="h-6 w-6 text-gray-700" />
          ) : (
            <MapPin className="h-6 w-6 text-gray-700" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Search Recipes</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleCloseSearch}>
                <X size={24} />
              </Button>
            </div>
            <Input
              placeholder="Search recipes"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="mb-4"
            />
            <ScrollArea className="h-[calc(100vh-120px)]">
              {filteredRecipes.map((recipe) => (
                <Card key={recipe.Recipe_id} className="mb-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleRecipeClick(recipe)}>
                  <CardHeader>
                    <CardTitle>{recipe.Recipe_title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <Image
                        src={recipe.img_url || "/placeholder.svg?height=200&width=400"}
                        alt={recipe.Recipe_title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {recipe.Region}, {recipe.Sub_region}
                    </p>
                    <p className="text-sm text-gray-600">
                      Prep time: {recipe.prep_time} | Cook time: {recipe.cook_time}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 20,
            }}
            className="fixed items-center top-16 right-4 h-[calc(100vh-30vh)] w-[60vh] max-w-md bg-white rounded-3xl shadow-lg z-50 overflow-hidden border-4 border-red-500"
          >
            <Card className="h-full">
              <CardHeader className="relative pb-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedRecipe(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </Button>
                <div className="aspect-w-16 h-16 mb-4 rounded-2xl overflow-hidden">
                  <Image
                    src={selectedRecipe.img_url || "/placeholder.svg?height=200&width=400"}
                    alt={selectedRecipe.Recipe_title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 mt-2">{selectedRecipe.Recipe_title}</CardTitle>
                <p className="text-sm text-gray-600">{selectedRecipe.Region}, {selectedRecipe.Sub_region}</p>
              </CardHeader>
              <CardContent className="pb-4 mt-4">
                <ScrollArea className="h-[calc(100vh-400px)]">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Clock className="w-5 h-5" />
                      <span>Prep: {selectedRecipe.prep_time} | Cook: {selectedRecipe.cook_time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Fire className="w-5 h-5" />
                      <span>{selectedRecipe.Calories} calories</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Utensils className="w-5 h-5" />
                      <span>{selectedRecipe.Utensils}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Cooking Process</h3>
                      <p className="text-gray-700">{selectedRecipe.Processes}</p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
              <div className="absolute bottom-4 left-4 right-4 flex space-x-4 mt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.open(selectedRecipe.url, '_blank')}
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        View Recipe
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open full recipe in a new tab</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        <ChefHat className="w-5 h-5 mr-2" />
                        Cook Now
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start guided cooking process</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}