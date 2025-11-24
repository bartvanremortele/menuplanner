import type { ImageSourcePropType } from "react-native";
import React, { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { Check, Clock, Heart, Plus, Share, Users } from "lucide-react-native";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";

interface RecipeDetailProps {
  recipe: {
    id: number;
    title: string;
    chef: string;
    image: ImageSourcePropType | string;
    duration: string;
    difficulty: string;
    servings: number;
    ingredients: string[];
    instructions: string[];
    description: string;
  };
  onBack: () => void;
}

export default function RecipeDetail({
  recipe,
  onBack: _onBack,
}: RecipeDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);

  return (
    <View className="flex-1 bg-black">
      {/* Header Image */}
      <View className="relative">
        <Image
          source={
            require("~/assets/images/placeholders/carbonara_placeholder.png") as ImageSourcePropType
          }
          className="h-64 w-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        <View className="absolute bottom-4 left-4 right-4">
          <Text className="mb-2 text-2xl font-bold text-white">
            {recipe.title}
          </Text>
          <Text className="mb-3 text-gray-300">by {recipe.chef}</Text>

          <View className="mb-4 flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Clock className="h-4 w-4 text-white" />
              <Text className="text-sm text-white">{recipe.duration}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Users className="h-4 w-4 text-white" />
              <Text className="text-sm text-white">
                {recipe.servings} servings
              </Text>
            </View>
            <Badge variant="outline" className="border-gray-600">
              <Text className="text-gray-300">{recipe.difficulty}</Text>
            </Badge>
          </View>

          <View className="flex-row items-center gap-3">
            <Button
              className="flex-1 bg-green-600"
              onPress={() => setAddedToPlaylist(!addedToPlaylist)}
            >
              {addedToPlaylist ? (
                <Check className="mr-2 h-4 w-4 text-white" />
              ) : (
                <Plus className="mr-2 h-4 w-4 text-white" />
              )}
              <Text className="text-white">
                {addedToPlaylist ? "Added to Playlist" : "Add to Playlist"}
              </Text>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onPress={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <Share className="h-6 w-6 text-white" />
            </Button>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        <View className="gap-6">
          <View>
            <Text className="mb-3 text-lg font-semibold text-white">
              Description
            </Text>
            <Text className="text-sm leading-relaxed text-gray-300">
              {recipe.description}
            </Text>
          </View>

          <Separator className="bg-gray-800" />

          <View>
            <Text className="mb-3 text-lg font-semibold text-white">
              Ingredients
            </Text>
            <View className="gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <View
                  key={index}
                  className="flex-row items-center gap-3 rounded p-2"
                >
                  <View className="h-2 w-2 rounded-full bg-green-600" />
                  <Text className="text-sm text-white">{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>

          <Separator className="bg-gray-800" />

          <View>
            <Text className="mb-3 text-lg font-semibold text-white">
              Instructions
            </Text>
            <View className="gap-4">
              {recipe.instructions.map((instruction, index) => (
                <View key={index} className="flex-row gap-3">
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-green-600">
                    <Text className="text-xs font-bold text-white">
                      {index + 1}
                    </Text>
                  </View>
                  <Text className="flex-1 text-sm leading-relaxed text-gray-300">
                    {instruction}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Separator className="bg-gray-800" />

          <View className="pb-6">
            <Text className="mb-3 text-lg font-semibold text-white">
              More from {recipe.chef}
            </Text>
            <View className="flex-row gap-3">
              {[1, 2].map((i) => (
                <Card key={i} className="flex-1 border-gray-800 bg-gray-900">
                  <CardContent className="p-3">
                    <Image
                      source={
                        require("~/assets/images/placeholders/carbonara_placeholder.png") as ImageSourcePropType
                      }
                      className="mb-2 aspect-square w-full rounded"
                    />
                    <Text className="text-sm font-medium text-white">
                      Recipe Title {i}
                    </Text>
                    <Text className="text-xs text-gray-400">25 min</Text>
                  </CardContent>
                </Card>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
