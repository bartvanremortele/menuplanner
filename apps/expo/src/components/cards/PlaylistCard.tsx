import type { LucideIcon } from "lucide-react-native";
import type { ColorValue, ImageSourcePropType } from "react-native";
import React from "react";
import { Image, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface PlaylistCardProps {
  title: string;
  subtitle: string;
  image?: ImageSourcePropType;
  gradient?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  icon?: LucideIcon;
  iconSize?: number;
  className?: string;
}

export default function PlaylistCard({
  title,
  subtitle,
  image,
  gradient,
  icon: Icon,
  iconSize = 48,
  className,
}: PlaylistCardProps) {
  return (
    <View
      className={cn("overflow-hidden rounded-lg bg-gray-900/50", className)}
    >
      <View className="aspect-square w-full">
        {image ? (
          <Image source={image} className="h-full w-full" resizeMode="cover" />
        ) : gradient && Icon ? (
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Icon size={iconSize} strokeWidth={2} color="#ffffff" />
          </LinearGradient>
        ) : null}
      </View>
      <View className="p-3">
        <Text className="mb-1 text-sm font-medium text-white">{title}</Text>
        <Text className="text-xs text-gray-400">{subtitle}</Text>
      </View>
    </View>
  );
}
