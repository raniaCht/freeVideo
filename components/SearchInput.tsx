import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

type Props = {
  value: string;
  handleChangeText: (value: string) => void;
  placeholder: string;
};

const SearchInput = ({
  value,
  handleChangeText,
  placeholder,
  ...props
}: Props) => {
  return (
    <View className="bg-black-100 px-2 border border-black-200 focus:border-secondary-100 rounded-lg flex-row justify-center items-center">
      <TextInput
        className="flex-1 py-4 text-white text-base font-plight"
        onChangeText={handleChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#CDCDE0"
      />

      <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
        <Image source={icons.search} className="w-5 h-5" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
