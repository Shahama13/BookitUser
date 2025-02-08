import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Specialcategory = ({ uri, name, description, id, rounded, fav }) => {
  const { navigate } = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigate("SpecialCategory", { id })}
      className={` mr-4 relative mb-2 ${
        rounded ? " rounded-2xl" : " rounded-sm"
      }  ${fav ? "w-full" : "w-72"}`}
    >
      <Image
        className={`h-48 w-full bg-black opacity-70 ${
          rounded ? " rounded-2xl" : " rounded-sm"
        }`}
        source={{
          uri,
        }}
      />
      <View className="absolute w-[60%] px-4 h-44 flex items-center justify-center">
        <Text className=" font-Logo tracking-widest text-[16px] text-white">
          {name}
        </Text>
      </View>

      <Text
        className={`font-Quic bg-white tracking-wider text-gray-900 leading-5 ${
          fav ? "mt-2 ml-2 mb-1" : "mt-3"
        }`}
        numberOfLines={2}
      >
        {description}
      </Text>
    </TouchableOpacity>
  );
};

export default Specialcategory;
