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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

const formSchema = z.object({
  allergies: z.string().optional(),
  foodsToAvoid: z.string().optional(),
})

export default function SetupPage3({setSetupPageNum}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      allergies: "",
      foodsToAvoid: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Here you would typically send the data to your backend
    // and then navigate to the next stage or finalize the setup
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Health Complications</CardTitle>
        <CardDescription>Please provide information about any allergies or foods you need to avoid.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allergies</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., peanuts, shellfish, dairy" {...field} />
                  </FormControl>
                  <FormDescription>List any food allergies you have, separated by commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="foodsToAvoid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foods to Avoid</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., gluten, soy, red meat" {...field} />
                  </FormControl>
                  <FormDescription>List any foods you prefer to avoid, separated by commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Finish </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}