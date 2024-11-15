// app/useraccount/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  image: z.string().optional(),
  yearOfBirth: z
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  height: z
    .number()
    .min(80, "Height must be at least 80cm")
    .max(300, "Height must be less than 300cm"),
  weight: z
    .number()
    .min(20, "Weight must be at least 20kg")
    .max(500, "Weight must be less than 500kg"),
  gender: z.enum(["male", "female", "other"]),
  physicalActivityLevel: z.enum([
    "level1",
    "level2",
    "level3",
    "level4",
    "level5",
  ]),
  goals: z.enum(["loseWeight", "gainWeight", "maintainWeight"]),
  dietPreference: z.enum([
    "vegetarian",
    "vegan",
    "paleo",
    "keto",
    "mediterranean",
  ]),
  region: z.enum([
    "south_america",
    "north_america",
    "indian_subcontinent",
    "european",
  ]),
  foodAllergies: z.array(z.string()).optional(),
  foodsToAvoid: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UserAccount() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
      yearOfBirth: undefined,
      height: undefined,
      weight: undefined,
      gender: "other",
      physicalActivityLevel: undefined,
      goals: undefined,
      dietPreference: undefined,
      region: undefined,
      foodAllergies: [],
      foodsToAvoid: [],
    },
  });

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await fetch("/api/onboarding");
        const data = await response.json();
        if (response.ok) {
          form.reset({
            name: data.name || "",
            email: data.email || "",
            image: data.image || "",
            yearOfBirth: data.yearOfBirth,
            height: data.height,
            weight: data.weight,
            gender: data.gender || "other",
            physicalActivityLevel: data.physicalActivityLevel,
            goals: data.goals,
            dietPreference: data.dietPreference,
            region: data.region,
            foodAllergies: data.foodAllergies || [],
            foodsToAvoid: data.foodsToAvoid || [],
          });
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to fetch user details.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch user details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserDetails();
  }, [form]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full  mx-auto">
      <CardHeader>
        <CardTitle>User Account</CardTitle>
        <CardDescription>
          View and update your account information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">User Details</h2>

              <div className="flex items-center space-x-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={form.getValues("image") || "/placeholder-avatar.jpg"}
                    alt="Profile picture"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="physicalActivityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="level1">
                          Level 1 (Sedentary)
                        </SelectItem>
                        <SelectItem value="level2">Level 2 (Light)</SelectItem>
                        <SelectItem value="level3">
                          Level 3 (Moderate)
                        </SelectItem>
                        <SelectItem value="level4">Level 4 (Active)</SelectItem>
                        <SelectItem value="level5">
                          Level 5 (Very Active)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">User Preferences</h2>

              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goals</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="loseWeight">Lose Weight</SelectItem>
                        <SelectItem value="gainWeight">Gain Weight</SelectItem>
                        <SelectItem value="maintainWeight">
                          Maintain Weight
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dietPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diet Preference</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select diet preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="mediterranean">
                          Mediterranean
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="south_america">
                          South America
                        </SelectItem>
                        <SelectItem value="north_america">
                          North America
                        </SelectItem>
                        <SelectItem value="indian_subcontinent">
                          Indian Subcontinent
                        </SelectItem>
                        <SelectItem value="european">European</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">User Health Complications</h2>

              <FormField
                control={form.control}
                name="foodAllergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Allergies</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter food allergies separated by commas"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.split(","))
                        }
                      />
                    </FormControl>
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
                      <Input
                        type="text"
                        placeholder="Enter foods to avoid separated by commas"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.split(","))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
