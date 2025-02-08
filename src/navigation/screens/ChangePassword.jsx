import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { instance, setHeader } from "../../redux/actions/userActions";
import { toast } from "@backpackapp-io/react-native-toast";
import { useNavigation } from "@react-navigation/native";

const ChangePassword = () => {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [loader, setLoader] = useState();
  const handlePasswordChange = async () => {
    try {
      setLoader(true);
      await setHeader();
      const { data } = await instance.post("/user/change-password", {
        oldPassword,
        newPassword: confirmPassword,
      });
      if (data.success) {
        setLoader(false);
        toast.success(data.message);
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <>
      <View className="flex-1 bg-slate-50">
        <View className="px-2">
          <View className="bg-white mt-3  px-2 py-4 flex items-center justify-center gap-4 rounded-lg">
            <TextInput
              placeholderTextColor={"#9ca3af"}
              secureTextEntry
              placeholder="Old password"
              selectionColor="#000000"
              value={oldPassword}
              onChangeText={setOldPassword}
              className="border-gray-200 text-black border-[1.5px] px-4 py-3 rounded-xl font-Quic w-full text-lg"
            />
            <TextInput
              placeholderTextColor={"#9ca3af"}
              secureTextEntry
              placeholder="New password"
              selectionColor="#000000"
              value={newPassword}
              onChangeText={setNewPassword}
              className="border-gray-200 text-black border-[1.5px] px-4 py-3 rounded-xl font-Quic w-full text-lg"
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
                  : "border-gray-200 text-black"
              } border-[1.5px] px-4 py-3 rounded-xl
           w-full font-Quic text-lg `}
            />
          </View>
        </View>
      </View>
      <View className="absolute bottom-0 left-0 bg-white p-3 w-full">
        <TouchableOpacity
          onPress={handlePasswordChange}
          disabled={
            newPassword !== confirmPassword ||
            !newPassword ||
            !confirmPassword ||
            !oldPassword
          }
          className="bg-black px-4 py-4 rounded-[7px] flex items-center justify-center"
        >
          <Text className="text-white font-JostL text-lg text-center font-Quic">
            {loader ? (
              <ActivityIndicator size={"small"} color={"#FFFFFF"} />
            ) : (
              "Change Password"
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ChangePassword;
