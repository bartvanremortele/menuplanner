import type { ImageSourcePropType } from "react-native";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Heart, MoreHorizontal, Plus } from "lucide-react-native";

import PlaylistCard from "~/components/cards/PlaylistCard";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

interface Playlist {
  id: number;
  name: string;
  creator: string;
  recipeCount: number;
  image: ImageSourcePropType;
}

export default function LibraryScreen() {
  const router = useRouter();

  const playlists: Playlist[] = [
    {
      id: 1,
      name: "Quick Weeknight Dinners",
      creator: "You",
      recipeCount: 12,
      image:
        require("~/assets/images/placeholders/quick_weeknight_dinners.png") as ImageSourcePropType,
    },
    {
      id: 2,
      name: "Comfort Food Classics",
      creator: "You",
      recipeCount: 8,
      image:
        require("~/assets/images/placeholders/carbonara_placeholder.png") as ImageSourcePropType,
    },
    {
      id: 3,
      name: "Healthy Breakfast Ideas",
      creator: "You",
      recipeCount: 15,
      image:
        require("~/assets/images/placeholders/healthy_breakfast_ideas.png") as ImageSourcePropType,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-4">
        <Text className="mb-4 text-xl font-bold text-white">Your Library</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="gap-6 p-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 pb-2">
              <Badge variant="secondary" className="bg-green-600">
                <Text className="text-white">Playlists</Text>
              </Badge>
              <Badge variant="outline" className="border-gray-600">
                <Text className="text-gray-300">Meal Plans</Text>
              </Badge>
              <Badge variant="outline" className="border-gray-600">
                <Text className="text-gray-300">Saved</Text>
              </Badge>
              <Badge variant="outline" className="border-gray-600">
                <Text className="text-gray-300">Chefs</Text>
              </Badge>
            </View>
          </ScrollView>

          <View className="flex-row items-center justify-between">
            <Button variant="ghost" size="sm">
              <Text className="text-sm text-gray-400">Recently created</Text>
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </Button>
          </View>

          <View className="flex-row flex-wrap gap-4">
            <PlaylistCard
              title="Liked Recipes"
              subtitle="24 recipes"
              gradient={["#9333ea", "#2563eb"]}
              icon={Heart}
              className="w-[45%]"
            />

            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                title={playlist.name}
                subtitle={`${playlist.recipeCount} recipes`}
                image={playlist.image}
                className="w-[45%]"
              />
            ))}
          </View>

          <Button
            className="w-full bg-green-600"
            onPress={() => router.push("/add")}
          >
            <Plus className="mr-2 h-4 w-4 text-white" />
            <Text className="text-white">Add New Recipe</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
