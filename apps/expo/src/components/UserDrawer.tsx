import React, { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Clock,
  Heart,
  LogOut,
  Settings,
  User,
  Users,
  X,
} from "lucide-react-native";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

const DRAWER_WIDTH = 280;

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDrawer({ isOpen, onClose }: UserDrawerProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Slide in
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsVisible(false);
      });
    }
  }, [isOpen, translateX, opacity]);

  if (!isVisible) return null;

  const handleNavigate = (route: string) => {
    onClose();
    // Allow navigating to placeholder routes during development
    router.push(route as never);
  };

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 50,
          opacity: opacity,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: DRAWER_WIDTH,
          backgroundColor: "#121212",
          zIndex: 51,
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          transform: [{ translateX }],
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView className="flex-1">
            {/* Header */}
            <View className="border-brand-gray-800 border-b p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-white">Menu</Text>
                <Button variant="ghost" size="icon" onPress={onClose}>
                  <X className="text-brand-gray-400 h-5 w-5" />
                </Button>
              </View>

              <View className="flex-row items-center gap-3">
                <Avatar alt="User Avatar" className="h-16 w-16">
                  <AvatarImage
                    source={{ uri: "https://i.pravatar.cc/64?img=68" }}
                  />
                  <AvatarFallback className="bg-brand-gray-700">
                    <Text className="font-medium text-white">JD</Text>
                  </AvatarFallback>
                </Avatar>
                <View>
                  <Text className="text-lg font-medium text-white">
                    John Doe
                  </Text>
                  <Text className="text-brand-gray-400 text-sm">
                    john.doe@example.com
                  </Text>
                  <Text className="text-brand-gray-500 mt-1 text-xs">
                    12 Followers
                  </Text>
                </View>
              </View>
            </View>

            {/* Menu Items */}
            <View className="py-2">
              <Pressable
                onPress={() => handleNavigate("/profile")}
                className="active:bg-brand-gray-800 flex-row items-center gap-3 px-4 py-3"
              >
                <User className="text-brand-gray-400 h-5 w-5" />
                <Text className="text-base text-white">View Profile</Text>
              </Pressable>

              <Pressable
                onPress={() => handleNavigate("/planner")}
                className="active:bg-brand-gray-800 flex-row items-center gap-3 px-4 py-3"
              >
                <Clock className="text-brand-gray-400 h-5 w-5" />
                <Text className="text-base text-white">Meal Plans</Text>
              </Pressable>

              <Pressable
                onPress={() => handleNavigate("/liked")}
                className="active:bg-brand-gray-800 flex-row items-center gap-3 px-4 py-3"
              >
                <Heart className="text-brand-gray-400 h-5 w-5" />
                <Text className="text-base text-white">Liked Recipes</Text>
              </Pressable>

              <Pressable
                onPress={() => handleNavigate("/following")}
                className="active:bg-brand-gray-800 flex-row items-center gap-3 px-4 py-3"
              >
                <Users className="text-brand-gray-400 h-5 w-5" />
                <Text className="text-base text-white">Following</Text>
              </Pressable>

              <View className="bg-brand-gray-800 my-2 h-px" />

              <Pressable
                onPress={() => handleNavigate("/settings")}
                className="active:bg-brand-gray-800 flex-row items-center gap-3 px-4 py-3"
              >
                <Settings className="text-brand-gray-400 h-5 w-5" />
                <Text className="text-base text-white">Settings</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  // Handle logout
                  onClose();
                }}
                className="active:bg-brand-gray-800 flex-row items-center gap-3 px-4 py-3"
              >
                <LogOut className="text-brand-gray-400 h-5 w-5" />
                <Text className="text-base text-white">Log Out</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}
