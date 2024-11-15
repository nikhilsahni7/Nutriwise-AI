'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

const formSchema = z.object({
  yearOfBirth: z.number().min(1900, {
    message: "Please Enter a valid year of birth.",
  }).max(2024, {
    message: "Please enter a valid year of birth.",
  }),
  region: z.string().min(2, {
    message: "Please select a region.",
  }),
  weight: z.number().min(20, {
    message: "Weight must be at least 20 kg.",
  }).max(500, {
    message: "Please enter a valid weight.",
  }),
  height: z.number().min(80, {
    message: "Please enter a valid height.",
  }).max(300, {
    message: "Please enter a valid weight.",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender.",
  }),
  activityLevel: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Please select a physical activity level.",
  }),
})

export default function SetupPage1({setSetupPageNum}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearOfBirth: undefined,
      region: "",
      weight: undefined,
      height: undefined,
      gender: undefined,
      activityLevel: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {

    console.log(values)
    // Here you would typically send the data to your backend
    // and then navigate to the next stage
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Account Setup</CardTitle>
        <CardDescription>Let's get to know you better to personalize your nutrition plan.</CardDescription>
      </CardHeader> 
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="yearOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of Birth</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2001" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormDescription>Your age helps us tailor recommendations.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Indian Subcontinent">Indian Subcontinent</SelectItem>
                      <SelectItem value="North American">North American</SelectItem>
                      <SelectItem value="South American">South American</SelectItem>
                      <SelectItem value="European">European</SelectItem>
                      {/* Add more countries as needed */}
                    </SelectContent>
                  </Select>
                  <FormDescription>Your location helps us provide relevant nutritional advice.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="70" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormDescription>Your weight helps us calculate your nutritional needs.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="167" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormDescription>Your height helps us calculate your nutritional needs.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>This helps us provide more accurate nutritional guidance.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Activity Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your activity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Sedentary (little or no exercise)</SelectItem>
                      <SelectItem value="2">Light (exercise 1-3 times/week)</SelectItem>
                      <SelectItem value="3">Moderate (exercise 4-5 times/week)</SelectItem>
                      <SelectItem value="4">Active (daily exercise/intense exercise 3-4 times/week)</SelectItem>
                      <SelectItem value="5">Very Active (intense exercise 6-7 times/week)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>This helps us provide more accurate nutritional guidance.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Next</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}