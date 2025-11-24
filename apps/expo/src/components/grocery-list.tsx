import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, Plus, ShoppingCart, Trash2 } from "lucide-react-native";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

interface GroceryListProps {
  onBack: () => void;
}

export default function GroceryList({ onBack: _onBack }: GroceryListProps) {
  const [newItem, setNewItem] = useState("");
  const [groceryItems, setGroceryItems] = useState([
    {
      id: 1,
      name: "Spaghetti pasta",
      recipe: "Spaghetti Carbonara",
      checked: false,
      category: "Pantry",
    },
    {
      id: 2,
      name: "Eggs (6 pack)",
      recipe: "Spaghetti Carbonara",
      checked: false,
      category: "Dairy",
    },
    {
      id: 3,
      name: "Pancetta",
      recipe: "Spaghetti Carbonara",
      checked: true,
      category: "Meat",
    },
    {
      id: 4,
      name: "Parmesan cheese",
      recipe: "Spaghetti Carbonara",
      checked: false,
      category: "Dairy",
    },
    {
      id: 5,
      name: "Romaine lettuce",
      recipe: "Caesar Salad",
      checked: false,
      category: "Produce",
    },
    {
      id: 6,
      name: "Croutons",
      recipe: "Caesar Salad",
      checked: false,
      category: "Pantry",
    },
    {
      id: 7,
      name: "Avocados (2)",
      recipe: "Avocado Toast",
      checked: false,
      category: "Produce",
    },
    {
      id: 8,
      name: "Sourdough bread",
      recipe: "Avocado Toast",
      checked: true,
      category: "Bakery",
    },
  ]);

  const addItem = () => {
    if (newItem.trim()) {
      setGroceryItems([
        ...groceryItems,
        {
          id: Date.now(),
          name: newItem,
          recipe: "Manual addition",
          checked: false,
          category: "Other",
        },
      ]);
      setNewItem("");
    }
  };

  const toggleItem = (id: number) => {
    setGroceryItems(
      groceryItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setGroceryItems(groceryItems.filter((item) => item.id !== id));
  };

  const groupedItems = groceryItems.reduce(
    (acc, item) => {
      acc[item.category] ??= [];
      const categoryItems = acc[item.category];
      if (categoryItems) {
        categoryItems.push(item);
      }
      return acc;
    },
    {} as Record<string, typeof groceryItems>,
  );

  const checkedCount = groceryItems.filter((item) => item.checked).length;
  const totalCount = groceryItems.length;

  const categoryColors: Record<string, string> = {
    Pantry: "bg-orange-600/20 border-orange-600/30",
    Dairy: "bg-blue-600/20 border-blue-600/30",
    Meat: "bg-red-600/20 border-red-600/30",
    Produce: "bg-green-600/20 border-green-600/30",
    Bakery: "bg-yellow-600/20 border-yellow-600/30",
    Other: "bg-purple-600/20 border-purple-600/30",
  };

  const categoryIcons: Record<string, string> = {
    Pantry: "🥫",
    Dairy: "🥛",
    Meat: "🥩",
    Produce: "🥬",
    Bakery: "🍞",
    Other: "📦",
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Stats Header */}
      <View className="border-b border-gray-800 p-4">
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <View className="mb-1 flex-row items-center gap-2">
              <Text className="text-xl font-bold text-white">
                Shopping List
              </Text>
              <Badge variant="outline" className="border-green-600">
                <Text className="text-green-400">{totalCount} items</Text>
              </Badge>
            </View>
            <Text className="text-sm text-gray-400">
              {checkedCount} completed • {totalCount - checkedCount} remaining
            </Text>
          </View>
          <View className="items-center">
            <View className="relative h-16 w-16 items-center justify-center rounded-full border-4 border-gray-700">
              <View
                className="absolute inset-0 rounded-full border-4 border-green-500"
                style={{
                  transform: [
                    { rotate: `${(checkedCount / totalCount) * 360}deg` },
                  ],
                }}
              />
              <Text className="z-10 text-lg font-bold text-white">
                {Math.round((checkedCount / totalCount) * 100)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Add new item */}
        <View className="flex-row gap-2">
          <Input
            placeholder="Add grocery item..."
            value={newItem}
            onChangeText={setNewItem}
            onSubmitEditing={addItem}
            className="flex-1 border-gray-700 bg-gray-800 text-white placeholder:text-gray-400"
          />
          <Button onPress={addItem} size="icon" className="bg-green-600">
            <Plus className="h-4 w-4 text-white" />
          </Button>
        </View>
      </View>

      {/* Grocery list */}
      <ScrollView className="flex-1 p-4">
        <View className="gap-4">
          {Object.entries(groupedItems).map(([category, items]) => (
            <View key={category} className="gap-2">
              {/* Category Header */}
              <View className="flex-row items-center gap-2 px-2">
                <Text className="text-lg">
                  {categoryIcons[category] ?? "📦"}
                </Text>
                <Text className="font-semibold text-white">{category}</Text>
                <Badge variant="outline" className="border-gray-600">
                  <Text className="text-xs text-gray-400">{items.length}</Text>
                </Badge>
              </View>

              {/* Category Items */}
              <View className="gap-2">
                {items.map((item) => (
                  <View
                    key={item.id}
                    className={`flex-row items-center gap-3 rounded-lg border p-3 ${
                      item.checked
                        ? "border-gray-700 bg-gray-800/30"
                        : (categoryColors[category] ??
                          "border-gray-700 bg-gray-800/50")
                    }`}
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="border-gray-500 data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
                    />
                    <View className="flex-1">
                      <Text
                        className={`text-sm font-medium ${
                          item.checked
                            ? "text-gray-500 line-through"
                            : "text-white"
                        }`}
                      >
                        {item.name}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        From: {item.recipe}
                      </Text>
                    </View>
                    {item.checked && (
                      <View className="h-6 w-6 items-center justify-center rounded-full bg-green-600">
                        <Check className="h-3 w-3 text-white" />
                      </View>
                    )}
                    <Pressable onPress={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {groceryItems.length === 0 && (
            <View className="items-center py-12">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-800">
                <ShoppingCart className="h-10 w-10 text-gray-500" />
              </View>
              <Text className="mb-2 text-lg font-medium text-white">
                Your list is empty
              </Text>
              <Text className="text-sm text-gray-400">
                Add items manually or generate from your meal plan
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom actions */}
      {groceryItems.length > 0 && (
        <View className="gap-3 border-t border-gray-800 p-4">
          <View className="flex-row gap-2">
            <Button className="flex-1 bg-green-600">
              <ShoppingCart className="mr-2 h-4 w-4 text-white" />
              <Text className="text-white">Share List</Text>
            </Button>
            <Button variant="outline" className="border-gray-600">
              <Text className="text-gray-300">Clear Completed</Text>
            </Button>
          </View>
          {checkedCount === totalCount && (
            <View className="items-center">
              <Text className="text-sm font-medium text-green-400">
                🎉 Shopping complete! Great job!
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
