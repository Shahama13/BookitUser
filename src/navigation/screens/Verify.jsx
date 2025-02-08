import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import { instance } from "../../redux/actions/userActions";
import { toast } from "@backpackapp-io/react-native-toast";
import { useNavigation, useRoute } from "@react-navigation/native";

const Verify = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const { params } = useRoute();
  const handleVerification = async (num) => {
    try {
      setLoader(true);
      const { data } = await instance.post("/user/verify-email", {
        OTP: num,
      });
      if (data.success) {
        setLoader(false);
        toast.success(data.message);
        navigation.navigate("Login", {
          screen: params.screen ? params.screen : "",
          id: params.id ? params.id : "",
        });
      }
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <SafeAreaView>
      <View className="bg-white px-4 h-full">
        <View className="bg-black mt-16 flex flex-col items-center justify-center py-11 rounded-md">
          <Text className="font-Quic text-lg text-white mb-2">
            Hi, welcome to
          </Text>
          <Text className="font-Logo text-6xl text-red-400">bookit</Text>
        </View>

        <View className="flex mt-[10%]">
          <Text className="font-MonsB text-cente text-red-400">
            {" "}
            Enter OTP sent to your registered email
          </Text>
          <View className="space-y-3 selection:mt-[10%] flex">
            <OtpInput
              numberOfDigits={6}
              focusColor="#000000"
              focusStickBlinkingDuration={500}
              onFilled={handleVerification}
              textInputProps={{
                accessibilityLabel: "One-Time Password",
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Verify;
