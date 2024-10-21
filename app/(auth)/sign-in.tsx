import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "@/firebaseConfig";

const SignIn = () => {
  const auth = FIREBASE_AUTH;
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function signInWithEmail() {
    setIsSubmitting(true);
    try {
      signInWithEmailAndPassword(auth, form.email, form.password).then(() => {
        router.push("/home");
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
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
            Sign in
          </Text>
          <FormField
            title="Email"
            value={form.email}
            otherStyle="mt-10"
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
          <Link className="text-gray-100 text-sm mt-5 self-end" href={"/"}>
            Forgot password
          </Link>
          <CustomButton
            title="Log In"
            containerStyle="w-full mt-7"
            handlePress={signInWithEmail}
            textStyle=""
            isLoaded={isSubmitting}
          />
          <Text className="text-white text-center font-plight mt-4">
            Don’t have an account?{" "}
            <Link href={"/sign-up"} className="text-secondary-100 font-pmedium">
              Signup
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
