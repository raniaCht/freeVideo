import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { icons } from "@/constants";
import { Video } from "@/lib/firebase";

const VideoCard = ({ video }: { video: Video }) => {
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
        <View className="self-start">
          <Image
            source={icons.menu}
            className="w-[21px] h-[23px] "
            resizeMode="contain"
          />
        </View>
      </View>
      <TouchableOpacity
        className="flex w-full justify-center items-center h-[300px] mt-3"
        activeOpacity={0.7}
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
    </View>
  );
};

export default VideoCard;
