import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "@/constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

type props = {
  title: string;
  subtitle: string;
};

const EmptyState = ({ title, subtitle }: props) => {
  return (
    <View className="justify-center items-center mx-5">
      <Image
        source={images.empty}
        className="w-[270px] h-[216px]"
        resizeMode="contain"
      />
      <Text className="font-pregular text-sm text-gray-100 mb-2">
        {subtitle}
      </Text>
      <Text className="font-psemibold text-xl text-white">{title}</Text>

      <CustomButton
        title="Create a video"
        handlePress={() => router.push("/(tabs)/create")}
        containerStyle="w-full my-4"
      />
    </View>
  );
};

export default EmptyState;
