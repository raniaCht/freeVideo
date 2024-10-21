import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getVideosByTitle, Video } from "@/lib/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoCard from "@/components/VideoCard";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";

const Search = () => {
  const [data, setData] = useState<Array<Video> | undefined>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { query } = useLocalSearchParams();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await getVideosByTitle(query.toString());
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
              <View>
                <Text className="text-gray-100 font-pregular text-sm">
                  Search results
                </Text>
                <Text className="text-white font-pmedium text-2xl">
                  {query}
                </Text>
              </View>
            </View>
            <SearchInput />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="No videos created yet"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
