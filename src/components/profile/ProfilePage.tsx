// app/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  UserProfile,
  Gender,
  PhysicalActivityLevel,
  Goals,
  DietPreference,
  Region,
} from "@/types/schema";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/onboarding");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setProfile(data);
      setFormData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "yearOfBirth" || name === "height" || name === "weight"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "foodAllergies" | "foodsToAvoid"
  ) => {
    const values = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({
      ...prev,
      [field]: values,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/onboarding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProfile(data);
      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!session) {
    return <div className="p-4">Please sign in to view your profile.</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded mb-6">{error}</div>
      )}

      {!isEditing ? (
        <div className="bg-white shadow rounded-lg p-6">
          {/* Profile Display */}
          <button
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6"
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Other Fields */}
            <div>
              <label className="block mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Physical Activity Level</label>
              <select
                name="physicalActivityLevel"
                value={formData.physicalActivityLevel || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Level</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Goals</label>
              <select
                name="goals"
                value={formData.goals || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Goal</option>
                <option value="loseWeight">Lose weight</option>
                <option value="maintainWeight">Maintain weight</option>
                <option value="gainWeight">Gain weight</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Diet Preference</label>
              <select
                name="dietPreference"
                value={formData.dietPreference || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="paleo">Paleo</option>
                <option value="keto">Keto</option>
                <option value="mediterranean">Mediterranean</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Region</label>
              <select
                name="region"
                value={formData.region || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Region</option>
                <option value="southAmerican">South America</option>
                <option value="northAmerican">North America</option>
                <option value="indianSubcontinent">Indian Subcontinent</option>
                <option value="european">Europe</option>
              </select>
            </div>
            {/* Other Fields */}
          </div>
          <div className="mt-6 flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Save
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => {
                setIsEditing(false);
                setFormData(profile || {});
                setError(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
