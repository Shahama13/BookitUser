import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Rating } from "@kolking/react-native-rating";
import { useNavigation, useRoute } from "@react-navigation/native";
import { instance, setHeader } from "../../redux/actions/userActions";
import { toast } from "@backpackapp-io/react-native-toast";
import { useCallback } from "react";

const Review = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const handleChange = (value) => setRating(value);

  const handleReview = async () => {
    try {
      await setHeader();
      const { data } = await instance.post(`/rev/${params.id}`, {
        rating,
        comment: review,
        ...(params.category && { category: params.category }),
      });
      if (data.success) {
        setLoader(false);
        toast.success("Your review was submitted");
        navigation.goBack();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
      setLoader(false);
    }
  };
  return (
    <SafeAreaView className="bg-white flex-1 relative px-4 pt-5">
      <ScrollView  >
        <View className="flex flex-col">
          <Text className="font-Logo text-2xl mb-4 text-gray-800">
            Overall Rating
          </Text>
          <View className="ml-2 mb-7">
            <Rating
              maxRating={5}
              size={40}
              rating={rating}
              onChange={handleChange}
              baseColor={"#d1d5db"}
              fillColor={"#f87171"}
              touchColor={"#f87171"}
            />
            {/* <StarRating
              enableHalfStar={false}
              rating={rating}
              onChange={setRating}
              color={"#f87171"}
              starSize={35}
            /> */}
          </View>
          {/* <Text className="font-MonsB text-gray-700 text-lg mb-4">
            Describe your experience
          </Text> */}
          <TextInput
            placeholderTextColor={"#9ca3af"}
            className="bg-gray-50 text-black shadow-md shadow-gray-700 rounded-2xl flex-1 p-3 font-Mons text-lg h-[50vh]"
            multiline
            numberOfLines={4} // You can set the number of lines you want to show initially
            onChangeText={setReview}
            value={review}
            placeholder="Describe your experience..."
            textAlignVertical="top" // Ensures text starts from the top
          />
        </View>
      </ScrollView>
      <View className="absolute bottom-0 left-0  bg-white w-[100vw] px-3 py-5">
        <TouchableOpacity
          disabled={!rating || !review || loader}
          onPress={handleReview}
          className="bg-red-400 py-5 w-full rounded-2xl"
        >
          {loader ? (
            <ActivityIndicator size={"small"} color={"#FFFFFF"} />
          ) : (
            <Text className="font-MonsB text-white text-center">
              Submit Review
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Review;
