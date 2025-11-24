import type { ColorValue, ImageSourcePropType } from "react-native";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ChefHat,
  Clock,
  Heart,
  MoreHorizontal,
  Search,
} from "lucide-react-native";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import UserDrawer from "~/components/UserDrawer";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const router = useRouter();

  interface RecipeCard {
    id: number;
    title: string;
    chef: string;
    image: ImageSourcePropType;
    duration: string;
  }

  const recipes: RecipeCard[] = [
    {
      id: 1,
      title: "Spaghetti Carbonara",
      chef: "Chef Marco",
      image:
        require("~/assets/images/placeholders/carbonara_placeholder.png") as ImageSourcePropType,
      duration: "25 min",
    },
    {
      id: 2,
      title: "Chicken Tikka Masala",
      chef: "Chef Priya",
      image:
        require("~/assets/images/placeholders/taco_placeholder.png") as ImageSourcePropType,
      duration: "45 min",
    },
    {
      id: 3,
      title: "Caesar Salad",
      chef: "Chef Julia",
      image:
        require("~/assets/images/placeholders/caesar_salad.png") as ImageSourcePropType,
      duration: "15 min",
    },
    {
      id: 4,
      title: "Beef Tacos",
      chef: "Chef Carlos",
      image:
        require("~/assets/images/placeholders/taco_placeholder.png") as ImageSourcePropType,
      duration: "30 min",
    },
  ];

  const playlists = [
    {
      id: 1,
      name: "Quick Weeknight Dinners",
      creator: "You",
      recipeCount: 12,
      gradient: ["#16a34a", "#2563eb"] as ColorValue[],
      icon: Clock,
    },
    {
      id: 2,
      name: "Comfort Food Classics",
      creator: "You",
      recipeCount: 8,
      gradient: ["#ea580c", "#dc2626"] as [ColorValue, ColorValue],
      icon: Heart,
    },
    {
      id: 3,
      name: "Healthy Breakfast Ideas",
      creator: "You",
      recipeCount: 15,
      gradient: ["#9333ea", "#ec4899"] as [ColorValue, ColorValue],
      icon: ChefHat,
    },
  ];

  const chefs = [
    {
      name: "Chef Marco",
      image: "https://i.pravatar.cc/100?img=12",
      specialty: "Italian",
    },
    {
      name: "Chef Priya",
      image: "https://i.pravatar.cc/100?img=47",
      specialty: "Indian",
    },
    {
      name: "Chef Julia",
      image: "https://i.pravatar.cc/100?img=44",
      specialty: "French",
    },
    {
      name: "Chef Kenji",
      image: "https://i.pravatar.cc/100?img=33",
      specialty: "Japanese",
    },
  ];

  return (
    <>
      <SafeAreaView className="flex-1 bg-black">
        <ScrollView className="flex-1">
          <View className="gap-6 p-4">
            <View className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Pressable onPress={() => setShowDrawer(true)}>
                  <Avatar alt="User Avatar" className="h-12 w-12">
                    <AvatarImage
                      source={{ uri: "https://i.pravatar.cc/48?img=68" }}
                    />
                    <AvatarFallback className="bg-gray-700">
                      <Text className="font-medium text-white">JD</Text>
                    </AvatarFallback>
                  </Avatar>
                </Pressable>
                <View>
                  <Text className="text-2xl font-bold text-white">
                    Good Evening
                  </Text>
                  <Text className="text-gray-400">
                    Ready to cook something delicious?
                  </Text>
                </View>
              </View>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </Button>
            </View>

            <View>
              <View className="relative mb-4">
                <Search
                  size={20}
                  color="#9ca3af"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 14,
                    zIndex: 10,
                  }}
                />
                <Input
                  placeholder="What do you want to cook today?"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="border-gray-700 bg-gray-800 pl-10 text-white placeholder:text-gray-400"
                />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
              >
                <View className="flex-row gap-2">
                  <Badge variant="secondary" className="bg-green-600 px-4 py-2">
                    <Text className="text-base text-white">All</Text>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-gray-600 px-4 py-2"
                  >
                    <Text className="text-base text-gray-300">Quick Meals</Text>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-gray-600 px-4 py-2"
                  >
                    <Text className="text-base text-gray-300">Vegetarian</Text>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-gray-600 px-4 py-2"
                  >
                    <Text className="text-base text-gray-300">Desserts</Text>
                  </Badge>
                </View>
              </ScrollView>
            </View>

            <View className="mt-3">
              <Text className="mb-3 text-xl font-bold text-white">
                Today&apos;s picks for you
              </Text>
              <View className="flex-row flex-wrap gap-4">
                <View className="min-w-[140px] flex-1">
                  <Card className="overflow-hidden border-0">
                    <LinearGradient
                      colors={["#9333ea", "#3b82f6"]}
                      className="flex-1"
                    >
                      <CardContent className="p-4">
                        <View className="mb-3 aspect-square w-full items-center justify-center rounded-full bg-black/20">
                          <ChefHat size={40} strokeWidth={3} color="#ffffff" />
                        </View>
                        <Text className="font-semibold text-white">
                          Quick & Easy
                        </Text>
                        <Text className="text-sm text-white/80">
                          30 min recipes
                        </Text>
                      </CardContent>
                    </LinearGradient>
                  </Card>
                </View>
                <View className="min-w-[140px] flex-1">
                  <Card className="overflow-hidden border-0">
                    <LinearGradient
                      colors={["#ea580c", "#dc2626"]}
                      className="flex-1"
                    >
                      <CardContent className="p-4">
                        <View className="mb-3 aspect-square w-full items-center justify-center rounded-full bg-black/20">
                          <Heart size={40} strokeWidth={3} color="#ffffff" />
                        </View>
                        <Text className="font-semibold text-white">
                          Comfort Food
                        </Text>
                        <Text className="text-sm text-white/80">
                          Soul warming
                        </Text>
                      </CardContent>
                    </LinearGradient>
                  </Card>
                </View>
                <Pressable
                  onPress={() => router.push("/planner")}
                  className="min-w-[140px] flex-1"
                >
                  <Card className="overflow-hidden border-0">
                    <LinearGradient
                      colors={["#2563eb", "#9333ea"]}
                      className="flex-1"
                    >
                      <CardContent className="p-4">
                        <View className="mb-3 aspect-square w-full items-center justify-center rounded-full bg-black/20">
                          <Clock size={40} strokeWidth={3} color="#ffffff" />
                        </View>
                        <Text className="font-semibold text-white">
                          Meal Planner
                        </Text>
                        <Text className="text-sm text-white/80">
                          Plan your week
                        </Text>
                      </CardContent>
                    </LinearGradient>
                  </Card>
                </Pressable>
              </View>
            </View>

            <View>
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-xl font-bold text-white">
                  Your recipe playlists
                </Text>
                <Button variant="ghost" size="sm">
                  <Text className="text-sm text-gray-400">View all</Text>
                </Button>
              </View>
              <View className="gap-3">
                {playlists.slice(0, 3).map((playlist) => {
                  const Icon = playlist.icon;
                  return (
                    <View
                      key={playlist.id}
                      className="flex-row items-center gap-3 py-1"
                    >
                      <View className="h-14 w-14 overflow-hidden rounded-md">
                        <LinearGradient
                          colors={
                            playlist.gradient as [
                              ColorValue,
                              ColorValue,
                              ...ColorValue[],
                            ]
                          }
                          style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon size={28} strokeWidth={3} color="#ffffff" />
                        </LinearGradient>
                      </View>
                      <View className="flex-1">
                        <Text className="font-medium text-white">
                          {playlist.name}
                        </Text>
                        <Text className="text-sm text-gray-400">
                          {playlist.recipeCount} recipes
                        </Text>
                      </View>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5 text-gray-400" />
                      </Button>
                    </View>
                  );
                })}
              </View>
            </View>

            <View>
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-xl font-bold text-white">
                  Popular Chefs
                </Text>
                <Button variant="ghost" size="sm">
                  <Text className="text-sm text-gray-400">View all</Text>
                </Button>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-4 pb-2">
                  {chefs.map((chef, index) => (
                    <View key={index} className="items-center">
                      <Avatar alt={chef.name} className="mb-2 h-16 w-16">
                        <AvatarImage source={{ uri: chef.image }} />
                        <AvatarFallback>
                          <Text>
                            {chef.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </Text>
                        </AvatarFallback>
                      </Avatar>
                      <Text className="text-sm font-medium text-white">
                        {chef.name}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {chef.specialty}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View>
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-xl font-bold text-white">
                  Trending Recipes
                </Text>
                <Button variant="ghost" size="sm">
                  <Text className="text-sm text-gray-400">View all</Text>
                </Button>
              </View>
              <View className="flex-row flex-wrap gap-4">
                {recipes.slice(0, 4).map((recipe) => (
                  <Pressable
                    key={recipe.id}
                    onPress={() => router.push("/recipes")}
                    className="w-[46%]"
                  >
                    <View className="rounded-lg bg-gray-900/50 p-3">
                      <View className="mb-3 aspect-square w-full">
                        <Image
                          source={recipe.image}
                          className="h-full w-full rounded-md"
                          resizeMode="cover"
                        />
                      </View>
                      <Text
                        className="mb-1 text-sm font-medium text-white"
                        numberOfLines={2}
                      >
                        {recipe.title}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {recipe.chef}
                      </Text>
                      <View className="mt-2 flex-row items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <Text className="text-xs text-gray-400">
                          {recipe.duration}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <UserDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  );
}
