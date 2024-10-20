import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { Link } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setLoading] = useState(false);
  async function signUpWithEmail() {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      // Update the display name in Firebase Authentication
      await updateProfile(user, {
        displayName: form.name,
      });

      // // Store user data in Cloud Firestore
      setDoc(doc(db, "users", user.uid), {
        name: form.name,
      }).catch((error) => console.log);

      signInWithEmailAndPassword(auth, form.email, form.password);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView>
        <View className="h-full w-full px-4 py-6 justify-center">
          <Image
            source={images.logo}
            className="w-[115px] h-auto"
            resizeMode="contain"
          />
          <Text className="text-white text-2xl font-psemibold mt-6">
            Sign up
          </Text>
          <FormField
            title="Name"
            value={form.name}
            otherStyle="mt-10"
            handleChangeText={(e) => setForm({ ...form, name: e })}
            keyboardType="name"
            placeholder="Your name"
          />
          <FormField
            title="Email"
            value={form.email}
            otherStyle="mt-7"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
            placeholder="Your Email"
          />
          <FormField
            title="Password"
            value={form.password}
            otherStyle="mt-7"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            keyboardType="password"
            placeholder="Your password"
          />
          <CustomButton
            title="Sign Up"
            containerStyle="w-full mt-7"
            handlePress={signUpWithEmail}
            textStyle=""
          />
          <Text className="text-white text-center font-plight mt-4">
            Already have an account?{" "}
            <Link href={"/sign-in"} className="text-secondary-100 font-pmedium">
              Login
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
