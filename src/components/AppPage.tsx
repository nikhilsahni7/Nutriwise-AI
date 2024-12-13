"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkle, Smile, CheckCircle, User2Icon, ArrowRight } from 'lucide-react'

export default function WelcomePage() {
  const router = useRouter()

  const features = [
    { icon: Sparkle, title: "NutriWise AI", description: "Get personalized nutrition insights powered by AI.", color: "text-blue-500" },
    { icon: Smile, title: "Community", description: "Connect and share recipes with like-minded individuals.", color: "text-yellow-500" },
    { icon: CheckCircle, title: "Track Progress", description: "Stay on top of your goals with advanced tracking tools.", color: "text-green-500" },
    { icon: User2Icon, title: "Recipe Recommendations", description: "Discover new recipes tailored to your preferences.", color: "text-purple-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <div className="container mx-auto px-4 py-12">


        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 mt-16">
            Welcome to <span className="text-blue-600 dark:text-blue-400">NutriWise</span>!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Your AI-powered solution for a healthier lifestyle.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-gray-800">
              <CardContent className="p-6">
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>


        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join NutriWise today and take the first step towards a healthier you!
          </p>
        </div>
      </div>
    </div>
  )
}