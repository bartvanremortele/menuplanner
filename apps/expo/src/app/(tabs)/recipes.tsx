import type { ImageSourcePropType } from "react-native";
import React from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Filter } from "lucide-react-native";

import RecipeDetail from "~/components/recipe-detail";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

interface Recipe {
  id: number;
  title: string;
  chef: string;
  image: ImageSourcePropType;
  duration: string;
  difficulty: string;
  servings: number;
  description: string;
  ingredients: string[];
  instructions: string[];
}

export default function RecipesScreen() {
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const recipes = [
    {
      id: 1,
      title: "Spaghetti Carbonara",
      chef: "Chef Marco",
      image:
        require("~/assets/images/placeholders/carbonara_placeholder.png") as ImageSourcePropType,
      duration: "25 min",
      difficulty: "Medium",
      servings: 4,
      description:
        "A classic Italian pasta dish with creamy egg sauce, crispy pancetta, and Parmesan cheese.",
      ingredients: [
        "400g spaghetti",
        "200g pancetta or guanciale",
        "4 large eggs",
        "100g Parmesan cheese, grated",
        "2 cloves garlic",
        "Salt and black pepper to taste",
        "Fresh parsley for garnish",
      ],
      instructions: [
        "Bring a large pot of salted water to boil and cook spaghetti according to package directions.",
        "While pasta cooks, cut pancetta into small cubes and fry in a large pan until crispy.",
        "In a bowl, whisk together eggs and grated Parmesan cheese.",
        "When pasta is al dente, reserve 1 cup of pasta water before draining.",
        "Add hot pasta to the pan with pancetta, remove from heat.",
        "Pour egg mixture over pasta and toss quickly, adding pasta water as needed to create a creamy sauce.",
        "Season with black pepper and serve immediately with extra Parmesan.",
      ],
    },
    {
      id: 2,
      title: "Caesar Salad",
      chef: "Chef Julia",
      image:
        require("~/assets/images/placeholders/caesar_salad.png") as ImageSourcePropType,
      duration: "20 min",
      difficulty: "Easy",
      servings: 4,
      description:
        "Fresh romaine lettuce with creamy Caesar dressing, croutons, and Parmesan.",
      ingredients: [],
      instructions: [],
    },
    {
      id: 3,
      title: "Avocado Toast",
      chef: "Chef Sam",
      image:
        require("~/assets/images/placeholders/healthy_breakfast_ideas.png") as ImageSourcePropType,
      duration: "15 min",
      difficulty: "Easy",
      servings: 2,
      description: "Simple yet delicious avocado toast with various toppings.",
      ingredients: [],
      instructions: [],
    },
  ];

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Search Header */}
      <View className="border-b border-gray-800 p-4">
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-400"
            />
          </View>
          <Button variant="outline" size="icon" className="border-gray-600">
            <Filter className="h-4 w-4 text-gray-300" />
          </Button>
        </View>
      </View>

      {/* Recipe Grid */}
      <ScrollView className="flex-1 p-4">
        <View className="gap-4">
          {recipes.map((recipe) => (
            <Pressable
              key={recipe.id}
              onPress={() => setSelectedRecipe(recipe)}
            >
              <Card className="border-gray-800 bg-gray-900">
                <CardContent className="p-4">
                  <View className="flex-row gap-4">
                    <Image
                      source={recipe.image}
                      className="h-24 w-24 rounded-lg"
                    />
                    <View className="flex-1">
                      <Text className="mb-1 text-lg font-semibold text-white">
                        {recipe.title}
                      </Text>
                      <Text className="mb-2 text-sm text-gray-400">
                        by {recipe.chef}
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        <Badge variant="outline" className="border-gray-600">
                          <Text className="text-xs text-gray-300">
                            {recipe.duration}
                          </Text>
                        </Badge>
                        <Badge variant="outline" className="border-gray-600">
                          <Text className="text-xs text-gray-300">
                            {recipe.difficulty}
                          </Text>
                        </Badge>
                        <Badge variant="outline" className="border-gray-600">
                          <Text className="text-xs text-gray-300">
                            {recipe.servings} servings
                          </Text>
                        </Badge>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
