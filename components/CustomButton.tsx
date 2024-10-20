import {
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import React from "react";

type HandlePress = (event: GestureResponderEvent) => void;

type Props = {
  title: string;
  handlePress: HandlePress;
  containerStyle: string;
  textStyle?: string;
  isLoaded?: boolean;
};

const CustomButton = ({
  title,
  handlePress,
  containerStyle,
  textStyle,
  isLoaded,
}: Props) => {
  return (
    <TouchableOpacity
      className={`bg-secondary rounded-lg py-4 justify-center items-center ${containerStyle} ${
        isLoaded ? "opacity-50" : ""
      }`}
      activeOpacity={0.9}
      onPress={handlePress}
      disabled={isLoaded}
    >
      <Text className={`font-psemibold text-primary ${textStyle}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
