import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

const SearchInput = () => {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  return (
    <View className="bg-black-100 px-2 border border-black-200 focus:border-secondary-100 rounded-lg flex-row justify-center items-center">
      <TextInput
        className="flex-1 py-4 text-white text-base font-plight"
        onChangeText={(e) => setQuery(e)}
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor="#CDCDE0"
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "") {
            Alert.alert(
              "Missing Query",
              "Please input something to search results"
            );
          } else {
            if (pathname.startsWith("/search")) router.setParams({ query });
            else router.push(`/search/${query}`);
          }
        }}
        activeOpacity={0.7}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
