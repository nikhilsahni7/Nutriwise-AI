"use client"

import React, { useState, useCallback, useEffect, ChangeEvent } from "react"
import { GoogleMap, useJsApiLoader, Marker, OverlayView } from "@react-google-maps/api"
import { motion, AnimatePresence } from "framer-motion"
import { FaUtensils, FaInfoCircle } from "react-icons/fa"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Filter, LogOut, Settings, Search, X, Menu, Plus, ZoomIn, ZoomOut, Compass, Clock, Utensils, FlameIcon as Fire, ChefHat, ExternalLink } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import CountUp from "react-countup"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"

// Map styles
const mapStyles = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "on" }, { saturation: -20 }, { lightness: -10 }],
  },
]

interface PageProps {
  params?: { [key: string]: string | string[] }
  searchParams?: { [key: string]: string | string[] }
}

interface Meal {
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
  location: {
    coordinates: [number, number]
    address: string
  }
}

const continents = [
  { name: "African", coordinates: { lat: 1.6508, lng: 10.2679 } },
  { name: "European", coordinates: { lat: 54.526, lng: 15.2551 } },
  { name: "North American", coordinates: { lat: 54.526, lng: -105.2551 } },
  { name: "South American", coordinates: { lat: -8.7832, lng: -55.4915 } },
  { name: "Indian Subcontinent", coordinates: { lat: 20.5937, lng: 78.9629 } },
]

export default function MealMap({ params, searchParams }: PageProps) {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [hoveredMeal, setHoveredMeal] = useState<Meal | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [meals, setMeals] = useState<Meal[]>([])
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [isMealPanelOpen, setIsMealPanelOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  // Removed: const [location, setLocation] = useState("")
  const router = useRouter()

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  const fetchRecipes = useCallback(async (continent: string | null = null) => {
    try {
      const response = await fetch(
        `/api/recipes-map${continent ? `?continent=${encodeURIComponent(continent)}` : ""}&limit=10`
      )
      const data = await response.json()
      if (data.payload && Array.isArray(data.payload.data)) {
        setMeals(data.payload.data)
        setFilteredMeals(data.payload.data)
      }
    } catch (error) {
      console.error("Error fetching recipes:", error)
    }
  }, [])

  useEffect(() => {
    if (selectedContinent) {
      fetchRecipes(selectedContinent)
    } else {
      fetchRecipes()
    }
  }, [selectedContinent, fetchRecipes])

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    mapInstance.setCenter({ lat: 20.0, lng: 0.0 })
    mapInstance.setZoom(2)
    setMap(mapInstance)
  }, [])

  const mapOptions = {
    mapTypeId: "roadmap",
    disableDefaultUI: true,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: mapStyles,
  }

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
    const filtered = meals.filter(
      (meal) =>
        meal.Recipe_title.toLowerCase().includes(value.toLowerCase()) ||
        meal.Region.toLowerCase().includes(value.toLowerCase()) ||
        meal.Sub_region.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredMeals(filtered)
  }, [meals])

  const handleFilterContinent = useCallback(
    (continent: string | null) => {
      setSelectedContinent(continent)
    },
    []
  )

  const handleSelectSuggestion = (value: string) => {
    setSearchQuery(value)
    const filtered = meals.filter(
      (meal) =>
        meal.Recipe_title.toLowerCase().includes(value.toLowerCase()) ||
        meal.Region.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredMeals(filtered)
  }

  const truncateText = (text: string, wordLimit: number): string => {
    const words = text.split(" ")
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + " ..."
    }
    return text
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleMarkerClick = (meal: Meal) => {
    setSelectedMeal(meal)
    setIsMealPanelOpen(true)
    setIsSearchOpen(false)
    setIsMenuOpen(false)
    if (map) {
      map.panTo({
        lat: meal.location.coordinates[1],
        lng: meal.location.coordinates[0],
      })
    }
  }

  const handleZoomIn = () => {
    if (map) map.setZoom(map.getZoom()! + 1)
  }

  const handleZoomOut = () => {
    if (map) map.setZoom(map.getZoom()! - 1)
  }

  const handleResetView = () => {
    if (map && meals.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      meals.forEach((meal) =>
        bounds.extend({
          lat: meal.location.coordinates[1],
          lng: meal.location.coordinates[0],
        })
      )
      map.fitBounds(bounds)
    }
  }

  if (loadError) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <p className="text-xl text-white font-medium">
          Error loading map: Looks like a Network Issue
        </p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-white animate-spin mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Loading...
          </h2>
          <p className="text-lg text-blue-300">
            Discovering delicious meals around the world
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full relative bg-gray-900">
      <div className="absolute top-0 z-30 left-0 w-full h-[20%] bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 z-10 left-0 w-full h-[20%] bg-gradient-to-b from-transparent to-black/70 pointer-events-none"></div>
      {isClient && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          zoom={10}
          onLoad={onLoad}
          options={mapOptions}
        >
          {filteredMeals.map((meal) => (
            <React.Fragment key={meal.Recipe_id}>
              {meal.location?.coordinates && (
                <Marker
                  position={{
                    lat: meal.location.coordinates[1],
                    lng: meal.location.coordinates[0],
                  }}
                  onClick={() => handleMarkerClick(meal)}
                  onMouseOver={() => setHoveredMeal(meal)}
                  onMouseOut={() => setHoveredMeal(null)}
                  icon={{
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="60" viewBox="0 0 40 60">
                        <path d="M20 0 C8.954 0 0 8.954 0 20 C0 35 20 60 20 60 C20 60 40 35 40 20 C40 8.954 31.046 0 20 0 Z" fill="#FF6347" />
                        <text x="20" y="24" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" dominant-baseline="middle">🍲</text>
                      </svg>
                    `)}`,
                    scaledSize: new google.maps.Size(40, 60),
                    anchor: new google.maps.Point(20, 60),
                  }}
                />
              )}

              {hoveredMeal === meal && (
                <OverlayView
                  position={{
                    lat: meal.location.coordinates[1],
                    lng: meal.location.coordinates[0],
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <Card className="relative w-48 bg-white border-[3px] border-red-500 border-opacity-50 backdrop-blur-sm hover:scale-105 transition-transform duration-300 ease-in-out rounded-md">
                    <CardHeader className="p-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-black font-semibold line-clamp-2">
                          {meal.Recipe_title}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="text-sm p-1 bg-red-100 text-red-600 rounded-md"
                        >
                          🍲
                        </Badge>
                      </div>
                      <CardDescription className="text-red-500 text-xs font-medium line-clamp-1">
                        {meal.Region}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3">
                      <p className="text-gray-700 text-xs mb-1 line-clamp-2">
                        {meal.Processes}
                      </p>
                      <p className="text-gray-500 text-xs italic line-clamp-2">
                        {meal.Sub_region}
                      </p>
                    </CardContent>
                  </Card>
                </OverlayView>
              )}
            </React.Fragment>
          ))}
        </GoogleMap>
      )}

      {/* Total Meals Section */}
      <div className="sm:ml-4 mb-2">
        <div
          className="text-sm font-semibold text-white bg-red-600 px-4 py-2 rounded-full"
          style={{ boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)" }}
        >
          Total Meals:{" "}
          <CountUp
            start={0}
            end={filteredMeals.length}
            duration={2}
            separator=","
            enableScrollSpy={true}
          />
        </div>
      </div>

      {/* Map Controls */}
      {!isMobileDevice && (
        <div className="absolute bottom-8 right-6 z-10 flex space-x-3 justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white hover:bg-gray-100"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white hover:bg-gray-100"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white hover:bg-gray-100"
                  onClick={handleResetView}
                >
                  <Compass className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

     

      {/* Search and Menu Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-4">
          {/* Search Button */}
          <Button
            className="relative py-7 px-6 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-[0_0.25rem_0_rgb(220,38,38),0_0.75rem_0.5rem_rgba(220,38,38,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-[0.2rem] active:shadow-[0_0.1rem_0.3rem_rgba(220,38,38,0.5)] flex items-center"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setIsMealPanelOpen(false);
              setIsMenuOpen(false);
            }}
          >
            <Search className="mr-2 h-6 w-6" />
            Search Meals
          </Button>
        </div>
      </div>

      {/* Search Menu */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Search Meals</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <Input
              type="text"
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="mb-4"
            />
            <ScrollArea className="h-[calc(100vh-120px)]">
              {filteredMeals.map((meal) => (
                <Card
                  key={meal.Recipe_id}
                  className="mb-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleMarkerClick(meal)}
                >
                  <CardHeader>
                    <CardTitle>{meal.Recipe_title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <Image
                        src={meal.img_url || "/placeholder.svg?height=200&width=400"}
                        alt={meal.Recipe_title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {meal.Region}, {meal.Sub_region}
                    </p>
                    <p className="text-sm text-gray-600">
                      Prep time: {meal.prep_time} | Cook time: {meal.cook_time}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meal Details Panel */}
      <AnimatePresence>
        {isMealPanelOpen && selectedMeal && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 overflow-hidden"
          >
            <Card className="h-full relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMealPanelOpen(false)}
                className="absolute top-4 right-4 z-10"
              >
                <X size={24} />
              </Button>
              <CardHeader className="pb-0">
                <div className="aspect-w-16 aspect-h-9 mb-4 rounded-t-lg overflow-hidden">
                  <Image
                    src={selectedMeal.img_url || "/placeholder.svg?height=200&width=400"}
                    alt={selectedMeal.Recipe_title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 mt-2">{selectedMeal.Recipe_title}</CardTitle>
                <p className="text-sm text-gray-600">{selectedMeal.Region}, {selectedMeal.Sub_region}</p>
              </CardHeader>
              <CardContent className="pb-4 mt-4">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Clock className="w-5 h-5" />
                      <span>Prep: {selectedMeal.prep_time} | Cook: {selectedMeal.cook_time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Fire className="w-5 h-5" />
                      <span>{selectedMeal.Calories} calories</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Utensils className="w-5 h-5" />
                      <span>{selectedMeal.Utensils}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Cooking Process</h3>
                      <p className="text-gray-700">{selectedMeal.Processes}</p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
              <div className="absolute bottom-4 left-4 right-4 flex space-x-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.open(selectedMeal.url, '_blank')}
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