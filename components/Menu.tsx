import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { addBookmark } from "@/lib/firebase";
import { router } from "expo-router";

const Menu = ({ videoID }: { videoID: string }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const saveVideo = async () => {
    try {
      const response = await addBookmark(videoID);
      console.log(response);
      toggleModal();
      Alert.alert("video saved!", response?.message);
      setTimeout(() => {
        router.push("/(tabs)/bookmark");
      }, 500);
    } catch (error) {
      console.log(error);
      Alert.alert("error", error as string);
    }
  };

  return (
    <View className="self-start">
      <TouchableOpacity onPress={toggleModal} className="relative">
        <Image
          source={icons.menu}
          className="w-[21px] h-[23px] "
          resizeMode="contain"
        />
        <Modal
          visible={modalVisible}
          onRequestClose={toggleModal}
          className="m-0 "
          transparent={true}
        >
          <View className="justify-center items-center w-full h-full">
            <View className="h-60 w-auto rounded-lg px-8 bg-black-100 justify-center items-center">
              <Text className="text-white text-base mb-2">
                Do you want to save this video for later?
              </Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={saveVideo}
                  className="py-3 flex-row items-center gap-1 justify-center bg-black-100 border border-secondary-100 px-4 rounded-lg"
                >
                  <Image
                    source={icons.save}
                    resizeMode="contain"
                    className="w-5 h-5"
                  />
                  <Text className="text-white text-sm font-plight">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={toggleModal}
                  className="py-3 flex-row items-center gap-1 justify-center bg-black-100 border border-white px-4 rounded-lg"
                >
                  <Text className="text-white text-sm font-plight">cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

export default Menu;
