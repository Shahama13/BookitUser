import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { instance } from "../../redux/actions/userActions";
import { toast } from "@backpackapp-io/react-native-toast";
import { useNavigation } from "@react-navigation/native";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const handleForgotPassword = async () => {
    try {
      setLoader(true);
      const { data } = await instance.post("/user/forgot-password", {
        email,
      });
      if (data.success) {
        setLoader(false);
        toast.success(data.message);
        navigation.navigate("ResetPassword");
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <SafeAreaView>
      <View className="px-6 h-full flex bg-white justify-center">
        {/* <Text className="mb-[8%] font-Logo text-3xl">Forgot Password?</Text> */}
        <TextInput
          placeholderTextColor={"#9ca3af"}
          placeholder="Enter your email address"
          selectionColor="#000000"
          value={email}
          onChangeText={setEmail}
          className="border-bluee border-[1.5px] px-4 py-3 rounded-xl font-Quic text-lg"
        />

        <TouchableOpacity
          className="mt-[8%] bg-black rounded-xl py-4"
          onPress={handleForgotPassword}
        >
          {loader ? (
            <ActivityIndicator size={"small"} color={"#FFFFFF"} />
          ) : (
            <Text className="text-white text-center font-Quic">Send Email</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
