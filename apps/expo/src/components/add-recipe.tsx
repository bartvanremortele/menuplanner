import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChefHat,
  Clock,
  Link,
  Minus,
  Plus,
  Upload,
  Users,
} from "lucide-react-native";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";

interface AddRecipeProps {
  onBack: () => void;
}

export default function AddRecipe({ onBack }: AddRecipeProps) {
  const [activeTab, setActiveTab] = useState("manual");
  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Manual form state
  interface FormData {
    title: string;
    chef: string;
    image: string;
    duration: string;
    difficulty: string;
    servings: number;
    description: string;
    ingredients: string[];
    instructions: string[];
  }

  const [formData, setFormData] = useState<FormData>({
    title: "",
    chef: "",
    image: "",
    duration: "",
    difficulty: "Easy",
    servings: 4,
    description: "",
    ingredients: [""],
    instructions: [""],
  });

  const difficulties = ["Easy", "Medium", "Hard"];

  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) =>
        i === index ? value : item,
      ),
    }));
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((item, i) =>
        i === index ? value : item,
      ),
    }));
  };

  const handleImportFromUrl = () => {
    if (!importUrl.trim()) return;

    setIsImporting(true);

    // Simulate API call to import recipe from URL
    setTimeout(() => {
      // Mock imported data
      setFormData({
        title: "Imported Recipe",
        chef: "Chef from URL",
        image: "/images/carbonara_placeholder.png",
        duration: "30 min",
        difficulty: "Medium",
        servings: 4,
        description:
          "This recipe was imported from the provided URL. You can edit any details below.",
        ingredients: [
          "2 cups flour",
          "1 cup sugar",
          "3 eggs",
          "1/2 cup butter",
        ],
        instructions: [
          "Preheat oven to 350°F",
          "Mix dry ingredients in a bowl",
          "Add wet ingredients and mix well",
          "Bake for 25-30 minutes",
        ],
      });
      setActiveTab("manual");
      setIsImporting(false);
    }, 2000);
  };

  const handleSaveRecipe = () => {
    console.log("Saving recipe:", formData);
    onBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-800 bg-black p-3">
        <Text className="text-lg font-bold text-white">Add Recipe</Text>
        <Button onPress={handleSaveRecipe} className="bg-green-600 px-4 py-2">
          <Text className="text-sm text-white">Save</Text>
        </Button>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid grid-cols-2 bg-gray-800">
              <TabsTrigger
                value="url"
                className="data-[state=active]:bg-green-600"
              >
                <Link className="mr-2 h-4 w-4 text-white" />
                <Text className="text-white">Import URL</Text>
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                className="data-[state=active]:bg-green-600"
              >
                <ChefHat className="mr-2 h-4 w-4 text-white" />
                <Text className="text-white">Manual Entry</Text>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="gap-6">
              <Card className="border-gray-800 bg-gray-900">
                <CardContent className="p-4">
                  <Text className="mb-3 text-lg font-semibold text-white">
                    Import from URL
                  </Text>
                  <Text className="mb-4 text-sm text-gray-400">
                    Paste a link from Instagram, TikTok, YouTube, or any recipe
                    website to automatically import the recipe details.
                  </Text>

                  <View className="gap-4">
                    <Input
                      placeholder="https://instagram.com/p/recipe-post or any recipe URL..."
                      value={importUrl}
                      onChangeText={setImportUrl}
                      className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-400"
                    />

                    <Button
                      onPress={handleImportFromUrl}
                      disabled={!importUrl.trim() || isImporting}
                      className="w-full bg-green-600"
                    >
                      {isImporting ? (
                        <>
                          <View className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                          <Text className="text-white">Importing...</Text>
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4 text-white" />
                          <Text className="text-white">Import Recipe</Text>
                        </>
                      )}
                    </Button>
                  </View>

                  <View className="mt-6 rounded-lg bg-gray-800/50 p-4">
                    <Text className="mb-2 font-medium text-white">
                      Supported platforms:
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {[
                        "Instagram",
                        "TikTok",
                        "YouTube",
                        "AllRecipes",
                        "Food.com",
                        "BBC Good Food",
                      ].map((platform) => (
                        <Badge
                          key={platform}
                          variant="outline"
                          className="border-gray-600"
                        >
                          <Text className="text-gray-300">{platform}</Text>
                        </Badge>
                      ))}
                    </View>
                  </View>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manual" className="gap-6">
              {/* Basic Info */}
              <Card className="border-gray-800 bg-gray-900">
                <CardContent className="gap-4 p-4">
                  <Text className="text-lg font-semibold text-white">
                    Basic Information
                  </Text>

                  <View>
                    <Text className="mb-2 text-sm font-medium text-gray-300">
                      Recipe Title *
                    </Text>
                    <Input
                      placeholder="e.g., Spaghetti Carbonara"
                      value={formData.title}
                      onChangeText={(value) =>
                        handleInputChange("title", value)
                      }
                      className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-400"
                    />
                  </View>

                  <View>
                    <Text className="mb-2 text-sm font-medium text-gray-300">
                      Chef/Author
                    </Text>
                    <Input
                      placeholder="e.g., Chef Marco"
                      value={formData.chef}
                      onChangeText={(value) => handleInputChange("chef", value)}
                      className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-400"
                    />
                  </View>

                  <View>
                    <Text className="mb-2 text-sm font-medium text-gray-300">
                      Image URL
                    </Text>
                    <Input
                      placeholder="https://example.com/recipe-image.jpg"
                      value={formData.image}
                      onChangeText={(value) =>
                        handleInputChange("image", value)
                      }
                      className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-400"
                    />
                  </View>

                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <Text className="mb-2 text-sm font-medium text-gray-300">
                        <Clock className="h-4 w-4 text-gray-300" /> Duration
                      </Text>
                      <Input
                        placeholder="30 min"
                        value={formData.duration}
                        onChangeText={(value) =>
                          handleInputChange("duration", value)
                        }
                        className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-400"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="mb-2 text-sm font-medium text-gray-300">
                        Difficulty
                      </Text>
                      <View className="flex-row gap-2">
                        {difficulties.map((diff) => (
                          <Pressable
                            key={diff}
                            onPress={() =>
                              handleInputChange("difficulty", diff)
                            }
                            className={`flex-1 rounded p-2 ${
                              formData.difficulty === diff
                                ? "bg-green-600"
                                : "bg-gray-800"
                            }`}
                          >
                            <Text
                              className={`text-center text-sm ${
                                formData.difficulty === diff
                                  ? "text-white"
                                  : "text-gray-300"
                              }`}
                            >
                              {diff}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>

                    <View className="flex-1">
                      <Text className="mb-2 text-sm font-medium text-gray-300">
                        <Users className="h-4 w-4 text-gray-300" /> Servings
                      </Text>
                      <Input
                        keyboardType="numeric"
                        value={formData.servings.toString()}
                        onChangeText={(value) =>
                          handleInputChange("servings", parseInt(value) || 1)
                        }
                        className="border-gray-700 bg-gray-800 text-white"
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="mb-2 text-sm font-medium text-gray-300">
                      Description
                    </Text>
                    <Textarea
                      placeholder="Describe your recipe..."
                      value={formData.description}
                      onChangeText={(value) =>
                        handleInputChange("description", value)
                      }
                      className="min-h-[80px] border-gray-700 bg-gray-800 text-white placeholder:text-gray-400"
                    />
                  </View>
                </CardContent>
              </Card>

              {/* Ingredients */}
              <Card className="border-gray-800 bg-gray-900">
                <CardContent className="gap-4 p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-white">
                      Ingredients
                    </Text>
                    <Button
                      onPress={addIngredient}
                      size="sm"
                      className="bg-green-600"
                    >
                      <Plus className="mr-1 h-4 w-4 text-white" />
                      <Text className="text-white">Add</Text>
                    </Button>
                  </View>

                  <View className="gap-3">
                    {formData.ingredients.map((ingredient, index) => (
                      <View key={index} className="flex-row gap-2">
                        <View className="mt-2 h-6 w-6 items-center justify-center rounded-full bg-green-600">
                          <Text className="text-xs font-bold text-white">
                            {index + 1}
                          </Text>
                        </View>
                        <Input
                          placeholder="e.g., 2 cups all-purpose flour"
                          value={ingredient}
                          onChangeText={(value) =>
                            updateIngredient(index, value)
                          }
                          className="flex-1 border-gray-700 bg-gray-800 text-white placeholder:text-gray-400"
                        />
                        {formData.ingredients.length > 1 && (
                          <Button
                            onPress={() => removeIngredient(index)}
                            size="icon"
                            variant="ghost"
                            className="text-red-400"
                          >
                            <Minus className="h-4 w-4 text-red-400" />
                          </Button>
                        )}
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="border-gray-800 bg-gray-900">
                <CardContent className="gap-4 p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-white">
                      Cooking Instructions
                    </Text>
                    <Button
                      onPress={addInstruction}
                      size="sm"
                      className="bg-green-600"
                    >
                      <Plus className="mr-1 h-4 w-4 text-white" />
                      <Text className="text-white">Add Step</Text>
                    </Button>
                  </View>

                  <View className="gap-4">
                    {formData.instructions.map((instruction, index) => (
                      <View key={index} className="flex-row gap-3">
                        <View className="mt-1 h-8 w-8 items-center justify-center rounded-full bg-green-600">
                          <Text className="text-sm font-bold text-white">
                            {index + 1}
                          </Text>
                        </View>
                        <View className="flex-1 gap-2">
                          <Textarea
                            placeholder={`Step ${index + 1}: Describe what to do...`}
                            value={instruction}
                            onChangeText={(value) =>
                              updateInstruction(index, value)
                            }
                            className="min-h-[60px] border-gray-700 bg-gray-800 text-white placeholder:text-gray-400"
                          />
                          {formData.instructions.length > 1 && (
                            <Button
                              onPress={() => removeInstruction(index)}
                              size="sm"
                              variant="ghost"
                              className="self-start text-red-400"
                            >
                              <Minus className="mr-1 h-4 w-4 text-red-400" />
                              <Text className="text-red-400">Remove Step</Text>
                            </Button>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>

              {/* Preview */}
              {formData.title && (
                <Card className="border-gray-800 bg-gray-900">
                  <CardContent className="p-4">
                    <Text className="mb-3 text-lg font-semibold text-white">
                      Preview
                    </Text>
                    <View className="rounded-lg bg-gray-800/50 p-3">
                      <Text className="font-medium text-white">
                        {formData.title}
                      </Text>
                      <Text className="text-sm text-gray-400">
                        by {formData.chef || "Unknown Chef"}
                      </Text>
                      <View className="mt-2 flex-row items-center gap-4">
                        <Text className="text-xs text-gray-400">
                          {formData.duration || "-- min"}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          {formData.difficulty}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          {formData.servings} servings
                        </Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
