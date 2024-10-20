import { View, Text, Button } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "@/firebaseConfig";

const Profile = () => {
  const auth = FIREBASE_AUTH;
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View className="container justify-center items-center h-full">
      <Text style={{ color: "black" }}>Profile</Text>
      <Button title="Sign Out" onPress={logout} />
    </View>
  );
};

export default Profile;
