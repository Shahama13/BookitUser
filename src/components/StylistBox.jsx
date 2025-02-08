import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const StylistBox = ({ uri, name, rating, speciality, id }) => {
  const { navigate } = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigate("StylistProfile", { id })}
      className="border-[1px] border-gray-200 rounded-md rounded-b-lg mb-5 shadow-md shadow-gray-600"
    >
      <Image
        className="w-full h-44 rounded-t-md relative"
        source={{
          uri,
        }}
      />
      <View className="absolute bottom-20 left-0 bg-white px-3 flex items-center justify-center py-1 rounded-tr-md">
        <Text className="font-MonsB">{rating} ⭐</Text>
      </View>
      <View className="p-3 pb-5 bg-white rounded-b-md">
        <Text className="font-MonsB text-2xl">{name}</Text>
        <Text className="font-Quic">
          {speciality?.map((s) => s.name).join(", ")} Specialist
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default StylistBox;
