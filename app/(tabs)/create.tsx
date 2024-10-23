import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons } from "@/constants";
import * as DocumentPicker from "expo-document-picker";
import { createPost, uploadToFirebase } from "@/lib/firebase";
import { router } from "expo-router";

type formType = {
  title: string;
  video: DocumentPicker.DocumentPickerAsset | null;
  thumbnail: DocumentPicker.DocumentPickerAsset | null;
  prompt: string;
};

const Create = () => {
  const [form, setForm] = useState<formType>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const [loading, setLoading] = useState(false);

  const openPicker = async (selectedFile: string) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectedFile === "image"
          ? ["image/png", "image/jpg", "image/jpeg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectedFile === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }

      if (selectedFile === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    } else {
      setTimeout(() => {
        Alert.alert(`Please provide the ${selectedFile}`);
      }, 100);
    }
  };

  const createVideo = async () => {
    setLoading(true);
    try {
      if (
        form.prompt === "" ||
        form.title === "" ||
        !form.thumbnail ||
        !form.video
      ) {
        return Alert.alert("Please provide all fields");
      }
      const uploadImageResp = await uploadToFirebase(
        form.thumbnail!.uri,
        "image"
      );
      const uploadVideoResp = await uploadToFirebase(form.video!.uri, "video");

      const response = await createPost({
        id: "",
        creator: "",
        title: form.title,
        prompt: form.prompt,
        video: (uploadVideoResp as any).downloadUrl as string,
        thumbnail: (uploadImageResp as any).downloadUrl as string,
      });

      if (response) {
        Alert.alert("Video uploaded", "your video is uploaded successfully!");
        setTimeout(() => {
          router.push("/(tabs)/profile");
        }, 500);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      Alert.alert("Error", errorMessage);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView>
        <View className="h-full w-full px-4 py-6 justify-center">
          <Text className="text-white text-2xl font-psemibold mt-6">
            Upload Video
          </Text>
          <FormField
            title="Video title"
            value={form.title}
            otherStyle="mt-10"
            handleChangeText={(e) => setForm({ ...form, title: e })}
            keyboardType="name"
            placeholder="Give your video a catchy title..."
          />
          <View className="mt-7 space-y-2">
            <Text className="text-gray-100 font-pregular text-base">
              Upload video
            </Text>

            <TouchableOpacity onPress={() => openPicker("video")}>
              {form.video ? (
                <Video
                  className="w-full h-80 rounded-lg"
                  source={{
                    uri: (form.video as DocumentPicker.DocumentPickerAsset).uri,
                  }}
                  shouldPlay
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                />
              ) : (
                <View className="w-full h-64 bg-black-100 justify-center items-center border border-black-200 focus:border-secondary-100 rounded-lg">
                  <View className="w-[50px] h-[50px] justify-center items-center border border-dashed border-secondary-100">
                    <Image
                      source={icons.upload}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-7 space-y-2">
            <Text className="text-gray-100 font-pregular text-base">
              Thumbnail Image
            </Text>

            <TouchableOpacity onPress={() => openPicker("image")}>
              {form.thumbnail ? (
                <Image
                  className="w-full h-80 rounded-lg"
                  source={{
                    uri: (form.thumbnail as DocumentPicker.DocumentPickerAsset)
                      .uri,
                  }}
                  resizeMode="contain"
                />
              ) : (
                <View className="w-full h-14 bg-black-100 justify-center items-center border border-black-200 focus:border-secondary-100 rounded-lg">
                  <View className="w-full h-[50px] flex-row gap-2 justify-center items-center ">
                    <Image
                      source={icons.upload}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />
                    <Text className="text-gray-100 text-sm font-pregular">
                      Choose a file
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <FormField
            title="Description"
            value={form.prompt}
            otherStyle="mt-7"
            handleChangeText={(e) => setForm({ ...form, prompt: e })}
            keyboardType="text"
            placeholder="Give your video a catchy description..."
          />
          <CustomButton
            title="Submit & Publish"
            containerStyle="w-full mt-7"
            handlePress={() => createVideo()}
            textStyle=""
            isLoaded={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
