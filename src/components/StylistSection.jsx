import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Stylist from "./Stylist";
import { instance } from "../redux/actions/userActions";

const StylistSection = () => {
  const [loader, setLoader] = useState(false);
  const [stylist, setStylist] = useState("");
  const getStylistData = async () => {
    try {
      setLoader(true);
      const { data } = await instance.get("/emp/all");
      if (data.success) {
        setLoader(false);
        setStylist(data.data);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };
  useEffect(() => {
    getStylistData();
  }, []);
  return (
    <View className="px-4 mb-12">
      <Text className="text-black font-Mons text-xl mb-5 ">Top Stylists</Text>
      {loader ? (
        <ActivityIndicator size={"small"} color={"#000000"} />
      ) : (
        <FlatList
          data={stylist}
          renderItem={({ item }) => (
            <Stylist
              uri={item.avatar.url}
              name={item.fullname}
              description={item.description}
              id={item._id}
            />
          )}
          keyExtractor={(item) => item?._id}
          contentContainerStyle={{ columnGap: 5 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default StylistSection;
