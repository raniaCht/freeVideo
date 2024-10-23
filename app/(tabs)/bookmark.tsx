import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoCard from "@/components/VideoCard";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import { getSavedVideos, Video } from "@/lib/firebase";

const Bookmark = () => {
  const [data, setData] = useState<Array<Video> | undefined>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getSavedVideos();
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
              <Text className="text-gray-100 font-pregular text-sm">
                Saved Videos
              </Text>
              <SearchInput />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No videos found" subtitle="No videos saved yet" />
        )}
      />
    </SafeAreaView>
  );
};

export default Bookmark;
