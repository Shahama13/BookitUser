import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import {
  getCurrentUser,
  instance,
  setHeader,
} from "../../redux/actions/userActions";
import { toast } from "@backpackapp-io/react-native-toast";
import { useDispatch, useSelector } from "react-redux";
import mime from "mime";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);
  const [loader, setLoader] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [fullname, setFullname] = useState(user?.fullname);

  const handleUpdateProfile = async () => {
    try {
      setLoader(true);
      const myForm = new FormData();
      fullname && myForm.append("fullname", fullname);
      avatar &&
        myForm.append("avatar", {
          uri: avatar,
          type: mime.getType(avatar),
          name: avatar.split("/").pop(),
        });
      await setHeader();
      const { data } = await instance.post("/user/change-profile", myForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.success) {
        setLoader(false);
        // toast.success(data.message);
        dispatch(getCurrentUser());
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required");
      return;
    }
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }

    console.log(result.assets[0].uri);
  };
  return (
    <>
      <ScrollView className="flex-1 bg-slate-50">
        {/* <ScrollView> */}
        <View className="px-2">
          {/* <View className="flex flex-row items-center mt-5">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={30} color={"#000000"} />
          </TouchableOpacity>
          <Text className="font-JostL text-2xl text-gray-700 ml-4">
            Your Profile
          </Text>
        </View> */}

          <View className="bg-white px-2 py-4 flex items-center mt-2 justify-center space-y-4 rounded-lg">
            <View className="relative mb-6">
              {avatar || user?.avatar?.url ? (
                <Image
                  className="h-28 w-28 rounded-full"
                  source={{
                    uri: avatar ? avatar : user?.avatar?.url,
                  }}
                />
              ) : (
                <FontAwesome5 name="user-circle" size={110} color={"#d1d5db"} />
              )}
              <TouchableOpacity
                onPress={pickImage}
                className="absolute bottom-2 right-2 bg-gray-200 p-1 rounded-full"
              >
                <Feather name="edit-2" size={15} color={"#000000"} />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Name"
              selectionColor="#000000"
              value={fullname}
              onChangeText={setFullname}
              className="border-gray-200 font-Quic mb-3 border-[1.5px] px-4 py-3 rounded-xl z-0 w-full"
            />
            <TextInput
              placeholder="Name"
              selectionColor="#000000"
              value={user?.email}
              //   onChangeText={setFullname}
              className="border-gray-200 font-Quic border-[1.5px] px-4 py-3 rounded-xl z-0 w-full"
            />
          </View>
        </View>

        {/* </ScrollView> */}
      </ScrollView>
      <View className="absolute bottom-0 left-0 bg-white p-3 w-full">
        <TouchableOpacity
          onPress={handleUpdateProfile}
          className="bg-black px-4 py-4 rounded-[7px] flex items-center"
        >
          {loader ? (
            <ActivityIndicator size={"small"} color={"#FFFFFF"} />
          ) : (
            <Text className="text-white text-lg text-center font-Quic">
              Update Profile
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Profile;
