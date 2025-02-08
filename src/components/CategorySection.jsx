import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import CategoryBox from "./CategoryBox";
import { instance } from "../redux/actions/userActions";
import { toast } from "@backpackapp-io/react-native-toast";

const CategorySection = () => {
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const getCategories = async () => {
    try {
      setLoader(true);
      const { data } = await instance.get("/cat/all");
      if (data.success) {
        setLoader(false);
        const newData = data.data?.filter((c) => c?.special === false);
        setCategories(newData);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const data = [
    {
      uri: "https://images.pexels.com/photos/4351727/pexels-photo-4351727.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Hair",
    },
    {
      uri: "https://images.pexels.com/photos/4783289/pexels-photo-4783289.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      name: "Spa",
    },
    {
      uri: "https://images.pexels.com/photos/995300/pexels-photo-995300.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Beard",
    },
    {
      uri: "https://images.pexels.com/photos/7389084/pexels-photo-7389084.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      name: "Styling",
    },
    {
      uri: "https://images.pexels.com/photos/20171280/pexels-photo-20171280/free-photo-of-makeup-cosmetics-and-bottles.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      name: "Makeover",
    },
  ];
  return (
    <View className="px-4 mb-16">
      <Text className="text-black font-Mons text-xl mb-5 ">Top Categories</Text>
      {loader ? (
        <ActivityIndicator size={"small"} color={"#000000"} />
      ) : (
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <CategoryBox uri={item.imageUrl} name={item.name} id={item._id} />
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

export default CategorySection;
