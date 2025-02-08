import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Stylist = ({ uri, name, description, id }) => {
  const { navigate } = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigate("StylistProfile", { id })}
      className="w-52  mr-2 relative mb-2 rounded-md"
    >
      <Image
        className="h-80 w-full rounded-md bg-black opacity-70"
        source={{
          uri,
        }}
      />
      <Text className="absolute top-2 bg-gray-300 opacity-90 blur-lg px-4 py-2 rounded-r-full font-MonoB tracking-wide">
        {" "}
        Flat 15% off{" "}
      </Text>
      <View className="absolute  bottom-2 flex items-start p-2 justify-center">
        <Text className="font-Mons text-base text-white mb-2">{name}</Text>
        <Text numberOfLines={2} className="font-Quic text-white leading-[15px]">
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Stylist;
