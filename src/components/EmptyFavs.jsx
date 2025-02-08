import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link, useNavigation } from "@react-navigation/native";

const EmptyFavs = ({ title, description }) => {
  const navigation = useNavigation();
  return (
    <View className="bg-rose-50 flex items-center justify-center py-8 px-4 h-full rounded-md gap-4 mx-4 mb-0 ">
      <Text className="font-Logo text-5xl text-center">{title}</Text>
      <Text className="font-Mons">{description}</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text
          className="bg-red-700 font-MonsB py-3 px-6 text-white"
          style={{ backgroundColor: "#000000", borderRadius: 5 }}
        >
          Explore Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyFavs;
