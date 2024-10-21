import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ViewToken,
} from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { Video as videoItem } from "@/lib/firebase";
import { ResizeMode, Video } from "expo-av";

import { CustomAnimation } from "react-native-animatable";
import { icons } from "@/constants";

type props = {
  posts: Array<videoItem>;
};

const zoomIn: CustomAnimation = {
  from: {
    scaleX: 0.9,
    scaleY: 0.9,
  },
  to: {
    scaleX: 1,
    scaleY: 1,
  },
};

const zoomOut: CustomAnimation = {
  from: {
    scaleX: 1,
    scaleY: 1,
  },
  to: {
    scaleX: 0.9,
    scaleY: 0.9,
  },
};

const TrendingItem = ({
  activeItem,
  item,
}: {
  activeItem: string;
  item: videoItem;
}) => {
  const [play, setPlay] = useState(false);
  return (
    <Animatable.View
      className=""
      animation={activeItem === item.id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[33px] bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if ("didJustFinish" in status && status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            resizeMode="cover"
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
          />
          <Image
            source={icons.play}
            resizeMode="contain"
            className="w-10 h-10 absolute"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }: props) => {
  const [activeItem, setActiveItem] = useState("");

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };
  return (
    <FlatList
      data={posts ?? []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      horizontal
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 55,
      }}
      contentOffset={{ x: 150, y: 1 }}
    />
  );
};

export default Trending;
