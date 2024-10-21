import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { signOut, User } from "firebase/auth";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { getVideosByUser, Video } from "@/lib/firebase";
import VideoCard from "@/components/VideoCard";
import { icons } from "@/constants";
import EmptyState from "@/components/EmptyState";
import { router } from "expo-router";

const Profile = () => {
  const [data, setData] = useState<Array<Video> | undefined>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const auth = FIREBASE_AUTH;
  const logout = async () => {
    try {
      signOut(auth).then(() => {
        router.push("/");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getVideosByUser(auth.currentUser?.uid);
      setData(response);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUser(auth.currentUser);
    fetchData();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={data}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => {
          return <VideoCard video={item} />;
        }}
        ListHeaderComponent={() => (
          <View className="mx-6 mt-5 mb-10">
            <View className="flex-row justify-end items-end mb-6">
              <TouchableOpacity onPress={logout} activeOpacity={0.7}>
                <Image
                  source={icons.logout}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View className="flex-col items-center">
              <View className="rounded-lg border border-secondary-100 p-1 mb-3">
                <Image
                  source={{
                    uri: `https://ui-avatars.com/api/?name=${currentUser?.displayName}&format=png&color=161622&background=CDCDE0&bold=true`,
                  }}
                  className="w-14 h-14 rounded-md"
                />
              </View>
              <Text className="text-white text-lg font-psemibold">
                {currentUser?.displayName}
              </Text>
              <View className="flex-row gap-6 justify-evenly items-center">
                <View className="flex-col items-center">
                  <Text className="text-white text-xl font-psemibold">
                    {data?.length}
                  </Text>
                  <Text className="text-gray-100 text-sm font-plight">
                    Posts
                  </Text>
                </View>
                <View className="flex-col items-center">
                  <Text className="text-white text-xl font-psemibold">
                    1.2K
                  </Text>
                  <Text className="text-gray-100 text-sm font-plight">
                    Views
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="No videos found for this profile"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
