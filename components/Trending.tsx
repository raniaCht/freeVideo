import { View, Text, FlatList } from "react-native";
import React from "react";

type post = {
  id: number;
};

type props = {
  posts: Array<post>;
};

const Trending = ({ posts }: props) => {
  return (
    <FlatList
      data={posts ?? []}
      renderItem={({ item }) => <Text className="text-white">{item.id} </Text>}
      horizontal
    />
  );
};

export default Trending;
