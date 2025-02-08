import { View, Text, Image } from "react-native";
import React from "react";
import moment from "moment";

const ReviewBox = ({ uri, name, rating, comment, createdAt }) => {
  return (
    <View className="rounded-xl flex flex-row mb-8 mt-3 gap-3">
      <Image
        source={{
          uri,
        }}
        className="rounded-full w-12 h-12"
      />

      <View className="pr-2 w-[80%]">
        <View className="flex flex-row w-[110%] items-center justify-between py-[2px] px-[4px] mb-1">
          <View className="flex flex-row items-center justify-center">
            <Text className="text-gray-900 mr-3 -ml-1 font-MonsB">{name}</Text>
            <Text className="text-gray-900 font-MonsB">{rating}⭐</Text>
          </View>
          <Text
            className="text-xs font-Quic text-gray-0"
            style={{ color: "#64748b" }}
          >
            {moment.utc(createdAt).local().fromNow()}
          </Text>
        </View>

        <Text className="font-Quic">{comment}</Text>
      </View>
    </View>
  );
};

export default ReviewBox;
