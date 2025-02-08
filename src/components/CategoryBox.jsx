import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const CategoryBox = ({ uri, name, id }) => {
  const { navigate } = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => navigate("AllStylists", { name, id })}
        className="w-28 mr-2 relative mb-2 rounded-sm"
      >
        <Image
          className="h-28 w-full rounded-sm"
          source={{
            uri,
          }}
        />
      </TouchableOpacity>
      <Text className="font-Mons">{name}</Text>
    </View>
  );
};

export default CategoryBox;
