import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

type Props = {
  title: string;
  value: string;
  handleChangeText: (value: string) => void;
  otherStyle: string;
  keyboardType: string;
  placeholder: string;
};

const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyle,
  keyboardType,
  placeholder,
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyle}`}>
      <Text className="text-gray-100 font-pregular text-base">{title}</Text>
      <View className="bg-black-100 px-2 border border-black-200 focus:border-secondary-100 rounded-lg flex-row justify-center items-center">
        <TextInput
          className="flex-1 py-4 text-white text-base font-psemibold"
          secureTextEntry={title === "Password" && !showPassword}
          onChangeText={handleChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#CDCDE0"
        />
        {title == "Password" && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Image
              source={showPassword ? icons.eyeHide : icons.eye}
              className="w-5 h-5"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
