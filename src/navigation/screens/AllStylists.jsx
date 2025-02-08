import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import StylistBox from "../../components/StylistBox";
import { useNavigation, useRoute } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import Title from "../../components/Title";
import { instance } from "../../redux/actions/userActions";

const AllStylists = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  const [loader, setLoader] = useState(false);
  const [professionals, setProfessionals] = useState([]);

  const getCategoryEmployees = async () => {
    try {
      setLoader(true);
      const { data } = await instance.get(`/cat/${params.id}`);
      if (data.success) {
        setLoader(false);
        setProfessionals(data?.data?.category?.professionals);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  useEffect(() => {
    getCategoryEmployees();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white pb-3">
      <View className="flex flex-row items-center bg-white p-5 shadow-md shadow-gray-500">
        <TouchableOpacity className="mr-6" onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={"#000000"} />
        </TouchableOpacity>
        <Title title={params.name} />
      </View>
      {loader ? (
        <View className="flex items-center justify-center flex-1">
          <ActivityIndicator size={"large"} color={"#000000"} />
        </View>
      ) : (
        <ScrollView>
          <View className="px-2">
            <View className="mt-5 px-2">
              {professionals?.map((p) => (
                <StylistBox
                  key={p._id}
                  id={p._id}
                  uri={p.avatar.url}
                  name={p.fullname}
                  speciality={p.speciality}
                  rating={p.avgRating}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </ScrollView>
  );
};

export default AllStylists;
