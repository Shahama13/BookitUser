import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { OtpInput } from "react-native-otp-entry";
import { toast } from "@backpackapp-io/react-native-toast";
import { instance } from "../../redux/actions/userActions";
import { useNavigation } from "@react-navigation/native";

const ResetPassword = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState();
  const [OTP, setOTP] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [showPass, setShowPass] = useState(false);
  const handleOtpFilled = (num) => {
    setOTP(num);
    setShowPass(true);
  };
  const handleResetPassword = async () => {
    try {
      setLoader(true);
      const { data } = await instance.post("/user/reset-password", {
        OTP,
        newPassword: confirmPassword,
      });
      if (data.success) {
        setLoader(false);
        toast.success(data.message);
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-3 h-full flex pt-[15%]">
        {!showPass && (
          <>
            <Text className="text-3xl font-MonsB">Enter the 6 digit OTP</Text>
            <Text className="mt-2 mb-10 text-base font-Mons">
              Please enter otp sent to your registered email and your new
              password
            </Text>
          </>
        )}
        {showPass && (
          <>
            <Text className="text-3xl font-MonsB">Set new password</Text>
            <Text className="mt-2 mb-10 text-base font-Mons">
              Enter a strong password
            </Text>
          </>
        )}
        <View>
          {!showPass ? (
            <OtpInput
              numberOfDigits={6}
              focusColor="#000000"
              focusStickBlinkingDuration={500}
              onFilled={handleOtpFilled}
              textInputProps={{
                accessibilityLabel: "One-Time Password",
              }}
            />
          ) : (
            <>
              <TextInput
                placeholderTextColor={"#9ca3af"}
                secureTextEntry
                placeholder="New password"
                selectionColor="#000000"
                value={newPassword}
                onChangeText={setNewPassword}
                className="border-bluee text-black border-[1.5px] px-4 py-3 rounded-xl mb-4 font-Quic text-lg"
              />
              <TextInput
                placeholderTextColor={"#9ca3af"}
                secureTextEntry
                placeholder="Confirm password"
                selectionColor="#000000"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className={`${
                  newPassword?.length > 1 &&
                  confirmPassword?.length > 1 &&
                  newPassword !== confirmPassword
                    ? "border-red-600 text-red-600"
                    : "border-bluee text-black"
                } border-[1.5px] px-4 py-3 rounded-xl font-Quic text-lg`}
              />
            </>
          )}
        </View>
        {showPass && (
          <View className="absolute bottom-0 left-0 bg-white p-3 w-[100vw]">
            <TouchableOpacity
              onPress={handleResetPassword}
              className="bg-black px-4 py-4 rounded-[7px] flex items-center"
              disabled={newPassword !== confirmPassword}
            >
              <Text className="text-white text-center font-Mons">
                {loader ? (
                  <ActivityIndicator size={"small"} color={"#FFFFFF"} />
                ) : (
                  "Change Password"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;
