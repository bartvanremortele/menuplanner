import type { ImageSourcePropType } from "react-native";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, ChefHat, Clock, Edit, Plus } from "lucide-react-native";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

export default function WeeklyMenuScreen() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const fullDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const weeklyMenu: Record<
    number,
    Record<string, { name: string; image: ImageSourcePropType; time: string }>
  > = {
    0: {
      // Monday
      breakfast: {
        name: "Avocado Toast",
        image:
          require("~/assets/images/placeholders/healthy_breakfast_ideas.png") as ImageSourcePropType,
        time: "15 min",
      },
      lunch: {
        name: "Caesar Salad",
        image:
          require("~/assets/images/placeholders/caesar_salad.png") as ImageSourcePropType,
        time: "20 min",
      },
      dinner: {
        name: "Spaghetti Carbonara",
        image:
          require("~/assets/images/placeholders/carbonara_placeholder.png") as ImageSourcePropType,
        time: "25 min",
      },
    },
    1: {
      // Tuesday
      breakfast: {
        name: "Greek Yogurt Bowl",
        image:
          require("~/assets/images/placeholders/healthy_breakfast_ideas.png") as ImageSourcePropType,
        time: "10 min",
      },
      lunch: {
        name: "Chicken Wrap",
        image:
          require("~/assets/images/placeholders/quick_weeknight_dinners.png") as ImageSourcePropType,
        time: "15 min",
      },
      dinner: {
        name: "Beef Stir Fry",
        image:
          require("~/assets/images/placeholders/taco_placeholder.png") as ImageSourcePropType,
        time: "30 min",
      },
    },
    2: {
      // Wednesday
      breakfast: {
        name: "Pancakes",
        image:
          require("~/assets/images/placeholders/healthy_breakfast_ideas.png") as ImageSourcePropType,
        time: "20 min",
      },
      lunch: {
        name: "Quinoa Bowl",
        image:
          require("~/assets/images/placeholders/caesar_salad.png") as ImageSourcePropType,
        time: "25 min",
      },
      dinner: {
        name: "Grilled Salmon",
        image:
          require("~/assets/images/placeholders/quick_weeknight_dinners.png") as ImageSourcePropType,
        time: "35 min",
      },
    },
    3: {
      // Thursday
      breakfast: {
        name: "Smoothie Bowl",
        image:
          require("~/assets/images/placeholders/healthy_breakfast_ideas.png") as ImageSourcePropType,
        time: "10 min",
      },
      lunch: {
        name: "Turkey Sandwich",
        image:
          require("~/assets/images/placeholders/quick_weeknight_dinners.png") as ImageSourcePropType,
        time: "10 min",
      },
      dinner: {
        name: "Chicken Curry",
        image:
          require("~/assets/images/placeholders/taco_placeholder.png") as ImageSourcePropType,
        time: "40 min",
      },
    },
    4: {
      // Friday
      breakfast: {
        name: "French Toast",
        image:
          require("~/assets/images/placeholders/healthy_breakfast_ideas.png") as ImageSourcePropType,
        time: "18 min",
      },
      lunch: {
        name: "Poke Bowl",
        image:
          require("~/assets/images/placeholders/caesar_salad.png") as ImageSourcePropType,
        time: "15 min",
      },
      dinner: {
        name: "Pizza Margherita",
        image:
          require("~/assets/images/placeholders/carbonara_placeholder.png") as ImageSourcePropType,
        time: "30 min",
      },
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="border-b border-gray-800 p-4">
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-white">Weekly Menu</Text>
            <Text className="text-sm text-gray-400">
              Your planned meals for this week
            </Text>
          </View>
          <Button variant="ghost" size="icon">
            <Edit className="h-5 w-5 text-gray-400" />
          </Button>
        </View>

        {/* Week navigation */}
        <View className="mb-4 flex-row items-center justify-between">
          <Button variant="ghost" size="sm">
            <Text className="text-gray-400">Previous Week</Text>
          </Button>
          <View className="items-center">
            <Text className="text-sm font-medium text-white">
              Jan 15 - Jan 21
            </Text>
            <Text className="text-xs text-gray-400">This Week</Text>
          </View>
          <Button variant="ghost" size="sm">
            <Text className="text-gray-400">Next Week</Text>
          </Button>
        </View>

        {/* Day selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2 pb-2">
            {days.map((day, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  setSelectedDay(selectedDay === index ? null : index)
                }
              >
                <View
                  className={`rounded-full px-4 py-2 ${
                    selectedDay === index ? "bg-green-600" : "bg-gray-800"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedDay === index ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {day}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Weekly overview */}
      <ScrollView className="flex-1 p-4">
        <View className="gap-4">
          {/* Quick stats */}
          <View className="mb-6 flex-row gap-3">
            <Card className="flex-1 border-green-600/30 bg-gradient-to-br from-green-600/20 to-green-600/10">
              <CardContent className="items-center p-3">
                <ChefHat className="mb-1 h-6 w-6 text-green-400" />
                <Text className="text-lg font-bold text-white">21</Text>
                <Text className="text-xs text-gray-400">Meals Planned</Text>
              </CardContent>
            </Card>
            <Card className="flex-1 border-blue-600/30 bg-gradient-to-br from-blue-600/20 to-blue-600/10">
              <CardContent className="items-center p-3">
                <Clock className="mb-1 h-6 w-6 text-blue-400" />
                <Text className="text-lg font-bold text-white">4.5h</Text>
                <Text className="text-xs text-gray-400">Total Cook Time</Text>
              </CardContent>
            </Card>
            <Card className="flex-1 border-purple-600/30 bg-gradient-to-br from-purple-600/20 to-purple-600/10">
              <CardContent className="items-center p-3">
                <Calendar className="mb-1 h-6 w-6 text-purple-400" />
                <Text className="text-lg font-bold text-white">5</Text>
                <Text className="text-xs text-gray-400">Days Planned</Text>
              </CardContent>
            </Card>
          </View>

          {/* Daily meals */}
          {(selectedDay !== null
            ? [selectedDay]
            : days.slice(0, 5).map((_, idx) => idx)
          ).map((dayIndex) => (
            <Card key={dayIndex} className="border-gray-800 bg-gray-900">
              <CardHeader className="pb-3">
                <View className="flex-row items-center justify-between">
                  <View>
                    <CardTitle className="text-lg text-white">
                      {fullDays[dayIndex]}
                    </CardTitle>
                    <Text className="text-sm text-gray-400">
                      Jan {15 + dayIndex}
                    </Text>
                  </View>
                  <Badge variant="outline" className="border-gray-600">
                    <Text className="text-gray-400">3 meals</Text>
                  </Badge>
                </View>
              </CardHeader>
              <CardContent className="pt-0">
                <View className="gap-3">
                  {["breakfast", "lunch", "dinner"].map((mealType) => (
                    <View
                      key={mealType}
                      className="flex-row items-center gap-3 rounded-lg bg-gray-800/50 p-2"
                    >
                      <Image
                        source={
                          weeklyMenu[dayIndex]?.[mealType]?.image ??
                          (require("~/assets/images/placeholders/carbonara_placeholder.png") as ImageSourcePropType)
                        }
                        className="h-10 w-10 rounded"
                      />
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-white capitalize">
                          {weeklyMenu[dayIndex]?.[mealType]?.name ??
                            `${mealType} Recipe`}
                        </Text>
                        <View className="flex-row items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <Text className="text-xs text-gray-400">
                            {weeklyMenu[dayIndex]?.[mealType]?.time ?? "-- min"}
                          </Text>
                        </View>
                      </View>
                      <Badge variant="outline" className="border-gray-600">
                        <Text className="text-xs text-gray-400 capitalize">
                          {mealType}
                        </Text>
                      </Badge>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          ))}

          {/* Action buttons */}
          <View className="gap-3 pt-4">
            <Button className="w-full bg-green-600">
              <Calendar className="mr-2 h-4 w-4 text-white" />
              <Text className="text-white">Generate Full Grocery List</Text>
            </Button>
            <Button variant="outline" className="w-full border-gray-600">
              <Plus className="mr-2 h-4 w-4 text-gray-300" />
              <Text className="text-gray-300">Plan Next Week</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
