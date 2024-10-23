import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { Video } from "@/lib/firebase";
import { Video as VideoAv, ResizeMode } from "expo-av";
import Menu from "./Menu";

const VideoCard = ({ video }: { video: Video }) => {
  const [play, setPlay] = useState(false);

  let imgUrl = `https://ui-avatars.com/api/?name=${video.displayName}&format=png&color=161622&background=CDCDE0&bold=true`;
  return (
    <View className="flex flex-col items-center px-6 my-4">
      <View className="flex flex-row justify-between w-full">
        <View className="flex flex-row flex-1 gap-2">
          <View className="border border-secondary-100 rounded-lg p-0.5 w-[46px] h-[46px]">
            <Image
              source={{
                uri: imgUrl,
              }}
              className="w-full h-full rounded-md"
              resizeMode="cover"
              onError={(error) =>
                console.log("Image loading error:", error.nativeEvent.error)
              }
            />
          </View>
          <View className="flex flex-col justify-start">
            <Text
              className="text-white font-pmedium text-sm overflow-hidden text-ellipsis whitespace-nowrap"
              numberOfLines={1}
            >
              {video.title}
            </Text>
            <Text className="text-gray-100 font-plight text-xs">
              {video.displayName}
            </Text>
          </View>
        </View>
        <Menu videoID={video.id} />
      </View>
      {play ? (
        <VideoAv
          source={{ uri: video.video }}
          className="w-full h-[300px] rounded-lg"
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          useNativeControls
          onPlaybackStatusUpdate={(status) => {
            if ("didJustFinish" in status && status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="flex w-full justify-center items-center h-[300px] mt-3"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: video.thumbnail }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
            onError={(error) =>
              console.log("Image loading error:", error.nativeEvent.error)
            }
          />
          <Image
            source={icons.play}
            className="w-10 h-10 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
