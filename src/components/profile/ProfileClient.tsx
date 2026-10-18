"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProfileClient() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfile(data.profile);
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!profile) return <div className="text-center">No profile found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Basic Information</h2>
        <div className="space-y-3">
          <div>
            <span className="font-medium text-gray-700">Name:</span>{" "}
            <span>{profile.name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Email:</span>{" "}
            <span>{profile.email}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Age:</span>{" "}
            <span>{profile.age}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Location:</span>{" "}
            <span>{profile.location}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Timezone:</span>{" "}
            <span>{profile.timezone}</span>
          </div>
        </div>
      </Card>

      {/* Dietary Preferences */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Dietary Preferences</h2>
        <div className="space-y-4">
          {profile.dietary_restrictions && profile.dietary_restrictions.length > 0 && (
            <div>
              <span className="font-medium text-gray-700 block mb-2">
                Dietary Restrictions:
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.dietary_restrictions.map((restriction: string) => (
                  <span
                    key={restriction}
                    className="px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm"
                  >
                    {restriction}
                  </span>
                ))}
              </div>
            </div>
          )}
          {profile.allergies && profile.allergies.length > 0 && (
            <div>
              <span className="font-medium text-gray-700 block mb-2">
                Allergies:
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((allergy: string) => (
                  <span
                    key={allergy}
                    className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Health Goals */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Health Goals</h2>
        <div className="space-y-3">
          {profile.health_goals?.goals && profile.health_goals.goals.length > 0 && (
            <div>
              <span className="font-medium text-gray-700 block mb-2">Goals:</span>
              <div className="flex flex-wrap gap-2">
                {profile.health_goals.goals.map((goal: string) => (
                  <span
                    key={goal}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}
          {profile.calorie_target && (
            <div>
              <span className="font-medium text-gray-700">Target Calories:</span>{" "}
              <span>{profile.calorie_target} per meal</span>
            </div>
          )}
        </div>
      </Card>

      {/* Cooking Preferences */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Cooking Preferences</h2>
        <div className="space-y-3">
          <div>
            <span className="font-medium text-gray-700">Skill Level:</span>{" "}
            <span className="capitalize">{profile.cooking_skill}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Max Cooking Time:</span>{" "}
            <span>{profile.max_cook_time} minutes</span>
          </div>
          {profile.kitchen_equipment && profile.kitchen_equipment.length > 0 && (
            <div>
              <span className="font-medium text-gray-700 block mb-2">
                Available Equipment:
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.kitchen_equipment.map((equipment: string) => (
                  <span
                    key={equipment}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {equipment}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Taste Preferences */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Taste Preferences</h2>
        <div className="space-y-4">
          {profile.cuisine_preferences?.likes && profile.cuisine_preferences.likes.length > 0 && (
            <div>
              <span className="font-medium text-gray-700 block mb-2">
                Favorite Cuisines:
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.cuisine_preferences.likes.map((cuisine: string) => (
                  <span
                    key={cuisine}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>
          )}
          {profile.flavor_profiles && profile.flavor_profiles.length > 0 && (
            <div>
              <span className="font-medium text-gray-700 block mb-2">
                Flavor Preferences:
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.flavor_profiles.map((flavor: string) => (
                  <span
                    key={flavor}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                  >
                    {flavor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Edit Button */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => router.push("/profile/edit")}>
          Edit Preferences
        </Button>
      </div>
    </div>
  );
}
