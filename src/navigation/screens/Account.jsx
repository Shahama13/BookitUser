import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Button,
  Image,
  BackHandler,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useCallback } from "react";

const Account = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigation.navigate("Home");
  };
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Home");
        return true; // Prevent default back action
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Cleanup the event listener on component unmount
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [navigation])
  );

  return (
    <ProtectedRoute screen={"Account"}>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView>
          <View className="px-4">
            <View className="mt-5 border-[1px] bg-white border-gray-300 shadow-lg items-center gap-4 flex flex-row p-4 rounded-2xl mb-5">
              {user?.avatar?.url ? (
                <Image
                  className="h-16 w-16 rounded-full"
                  source={{
                    uri: user?.avatar?.url,
                  }}
                />
              ) : (
                <FontAwesome5 name="user-circle" size={50} color={"#d1d5db"} />
              )}

              <Text className="font-MonsB text-xl text-gray-700">
                {user?.fullname}
              </Text>
            </View>

            <View className="border-[1px] bg-white border-gray-300 rounded-2xl px-4 mb-6">
              <TouchableOpacity
                onPress={() => navigation.navigate("Profile")}
                className=" flex flex-row items-center mb-3 mt-5"
              >
                <Feather name="user" size={28} color={"#000000"} />

                <View className="ml-4 flex-1">
                  <Text className="font-MonsB text-[15px] mb-1">
                    Personal Details
                  </Text>
                  <Text className="font-Mons ">Contact Details</Text>
                </View>
                <Feather name="chevron-right" size={25} color={"#000000"} />
              </TouchableOpacity>
              <View className=" w-full flex items-end mb-3">
                <View className="bg-gray-200 w-[90%] h-[1px]" />
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("My Favourites")}
                className=" flex flex-row items-center mb-3 "
              >
                <Feather name="heart" size={28} color={"#000000"} />

                <View className="ml-4 flex-1">
                  <Text className="font-MonsB text-[15px] mb-1">
                    My Favourites
                  </Text>
                  <Text className="font-Mons ">View your favourites</Text>
                </View>
                <Feather name="chevron-right" size={25} color={"#000000"} />
              </TouchableOpacity>
              <View className=" w-full flex items-end mb-3">
                <View className="bg-gray-200 w-[90%] h-[1px]" />
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("MyAppointments")}
                className=" flex flex-row items-center mb-3 "
              >
                <Feather name="calendar" size={28} color={"#000000"} />

                <View className="ml-4 flex-1">
                  <Text className="font-MonsB text-[15px] mb-1">
                    My Appointments
                  </Text>
                  <Text className="font-Mons ">View your appointments</Text>
                </View>
                <Feather name="chevron-right" size={25} color={"#000000"} />
              </TouchableOpacity>

              <View className=" w-full flex items-end mb-3">
                <View className="bg-gray-200 w-[90%] h-[1px]" />
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("ChangePassword")}
                className=" flex flex-row items-center mb-5 "
              >
                <Feather name="lock" size={28} color={"#000000"} />

                <View className="ml-4 flex-1">
                  <Text className="font-MonsB text-[15px] mb-1">
                    Change Password
                  </Text>
                  <Text className="font-Mons ">
                    Change your current password
                  </Text>
                </View>
                <Feather name="chevron-right" size={25} color={"#000000"} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="ml-4" onPress={handleLogout}>
              <Text
                style={{ color: "#ff0000" }}
                className="text-red-600 font-MonsB text-lg"
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ProtectedRoute>
  );
};

export default Account;
