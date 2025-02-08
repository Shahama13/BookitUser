import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

const AppointmentBox = ({
  uri,
  name,
  apptFor,
  status,
  startTime,
  endTime,
  createdAt,
  review,
  employeeId,
  id,
}) => {
  const { navigate } = useNavigation();
  return (
    <View className=" bg-white shadow-md shadow-slate-500 rounded-md mb-5">
      <View className="flex flex-row gap-3  p-3 ">
        <Image
          className="h-20 w-20 rounded-md"
          source={{
            uri,
          }}
        />
        <View>
          <TouchableOpacity
            onPress={() => navigate("StylistProfile", { id: employeeId })}
          >
            <Text className="text-gray-800 font-Logo text-xl">{name}</Text>
          </TouchableOpacity>

          <Text className="text-red-400 font-MonsB ">
            {apptFor?.name} Appointment
          </Text>
        </View>
      </View>
      <View className="h-[1px] bg-gray-200" />
      <View className="flex flex-row justify-between items-center p-3 py-4">
        <View className="gap-3">
          <Text className="font-Quic text-gray-600">Status</Text>
          <Text className="font-Quic text-gray-600">Appointment Date</Text>
          <Text className="font-Quic text-gray-600">Appointment Time</Text>
        </View>
        <View className="flex gap-3">
          <Text className=" text-red-400 font-MonsB self-end">{status}</Text>
          <Text className="self-end  text-gray-500 font-MonsB">
            {moment(startTime).format("LL")}
          </Text>
          <Text className="self-end text-gray-500 font-MonsB">
            {moment(startTime).format("LT")} - {moment(endTime).format("LT")}
          </Text>
        </View>
      </View>
      <View className="px-3 pt-2 pb-4 gap-2 flex">
        <Text className="font-Mons mb-4">
          Booked on {moment(createdAt).format("LL")}
        </Text>
        {!review && status === "Completed" && (
          <TouchableOpacity
            onPress={() =>
              navigate("Review", {
                id,
                category: apptFor.special ? apptFor._id : "",
              })
            }
            className="bg-red-400 flex flex-row items-center gap-2 px-4 py-4 rounded-2xl self-end"
          >
            <AntDesign name="star" size={15} color={"#FFFFFF"} />

            <Text className="text-white text-center font-Mons">
              Rate Appointment
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AppointmentBox;
