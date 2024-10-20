import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { router, Router } from "expo-router";
import { useRouter, useSegments, Stack, Slot, Redirect } from "expo-router";

import { FIREBASE_AUTH } from "@/firebaseConfig";
import { User } from "firebase/auth";

const Welcome = () => {
  const router = useRouter();
  const segments = useSegments();

  // Ensure useState is always called
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const onAuthStateChanged = (user: User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  // Initialize Firebase auth and listener for auth state changes
  useEffect(() => {
    const subscriber = FIREBASE_AUTH.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on cleanup
  }, []);

  // React to user authentication state change
  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (user && inAuthGroup) {
      router.replace("/(tabs)/home");
    } else if (!user && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    }
  }, [user, initializing]);

  if (initializing) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <ActivityIndicator color={"#FF9001"} size="large" />
      </View>
    );
  }

  return user ? (
    <Redirect href={"/(tabs)/home"} />
  ) : (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="min-h-[85vh] w-full justify-center items-center px-4">
          <Image
            source={images.logo}
            resizeMode="center"
            className="w-[130px] h-[85px]"
          />
          <Image
            source={images.cards}
            resizeMode="contain"
            className="max-w-[380px] h-[300px]"
          />
          <View className="relative mt-6">
            <Text className="text-3xl font-psemibold text-white text-center">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-100">Aora</Text>
            </Text>
            <Image
              source={images.path}
              resizeMode="contain"
              className="h-[80px] w-[80px] absolute -bottom-8 right-1"
            />
          </View>
          <View className="mt-4">
            <Text className="text-gray-100 text-center text-sm">
              Where Creativity Meets Innovation: Embark on a Journey of
              Limitless Exploration with Aora
            </Text>
          </View>
          <CustomButton
            title={"Continue with Email"}
            handlePress={() => router.push("/sign-in")}
            containerStyle="w-full mt-5"
            textStyle=""
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
