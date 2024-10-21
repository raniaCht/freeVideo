import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images, icons } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { getVideos, Video } from "@/lib/firebase";
import VideoCard from "@/components/VideoCard";

const Home = () => {
  const [data, setData] = useState<Array<Video> | undefined>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getVideos();
      setData(response);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={data}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => {
          return <VideoCard video={item} />;
        }}
        ListHeaderComponent={() => (
          <View className="mx-6 mt-5">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-gray-100 font-pregular text-sm">
                  Welcome Back
                </Text>
                <Text className="text-white font-pmedium text-2xl">
                  Rania Cht
                </Text>
              </View>
              <View>
                <Image
                  source={images.logoSmall}
                  className="w-8 h-9"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />

            <View className="mt-6 w-full">
              <Text className="font-plight text-sm text-gray-100">
                Trending Videos
              </Text>
              <Trending posts={data!} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF9001"]}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
