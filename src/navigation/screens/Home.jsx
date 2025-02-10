import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  StatusBar,
  Linking,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import CategorySection from "../../components/CategorySection.jsx";
import FavouriteSection from "../../components/FavouriteSection.jsx";
import StylistSection from "../../components/StylistSection.jsx";
import { getCurrentUser } from "../../redux/actions/userActions.js";

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, reload } = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);
  const [isConnected, setConnected] = useState(true);
  const flatListRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const width = Dimensions.get("window").width;

  const dotIndicators = () => {
    return carouselData.map((dot, index) => {
      if (activeIndex === index) {
        return (
          <View key={index} className="bg-black rounded-md h-1 w-5 mx-[2px]" />
        );
      }
      return (
        <View key={index} className="bg-gray-300 h-1 rounded-md w-1 mx-[2px]" />
      );
    });
  };

  const handleScroll = (e) => {
    const scrollPosition = e.nativeEvent.contentOffset.x;
    const index = scrollPosition / width;
    setActiveIndex(Math.round(index));
  };

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index: index,
  });

  useEffect(() => {
    let interval = setInterval(() => {
      if (activeIndex === carouselData.length - 1) {
        flatListRef?.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
        setActiveIndex(0); // Reset the active index to 0
      } else {
        flatListRef?.current?.scrollToIndex({
          index: activeIndex + 1,
          animated: true,
        });
        setActiveIndex((prevIndex) => prevIndex + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [reload]);

  const carouselData = [
    {
      id: 1,
      uri: "https://images.pexels.com/photos/29096364/pexels-photo-29096364/free-photo-of-professional-hair-care-setup-with-stylist-in-studio.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    },
    {
      id: 2,
      uri: "https://images.pexels.com/photos/8468036/pexels-photo-8468036.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    },
    {
      id: 3,
      uri: "https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 4,
      uri: "https://images.pexels.com/photos/27240005/pexels-photo-27240005/free-photo-of-2.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
    },
    {
      id: 5,
      uri: "https://images.pexels.com/photos/3735623/pexels-photo-3735623.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
    },
    {
      id: 6,
      uri: "https://images.pexels.com/photos/3997377/pexels-photo-3997377.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

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
    <SafeAreaView className="bg-white flex-1">
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView>
        <View className="flex justify-between items-center flex-row px-4 py-4 shadow-sm shadow-slate-600 bg-white mb-[2px]">
          <TouchableOpacity onPress={() => navigation.navigate("Account")}>
            <Feather name="user" size={24} color="#000000" />
          </TouchableOpacity>
          <Text className="font-Logo text-3xl text-red-400">bookit</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("My Favourites")}
          >
            <Feather name="heart" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        <View className="bg-white bgsla p-4 shadow-sm shadow-slate-700">
          <TextInput
            placeholderTextColor="#475569"
            placeholder="What are you looking for?"
            className="bg-slate-100 px-2 py-3 font-Quic text-black"
          />
          <TouchableOpacity className="top-3 right-4 absolute flex items-center justify-center rounded-2xl p-4">
            <Feather name="search" size={20} color="#475569" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            !isAuthenticated
              ? navigation.navigate("Login", { screen: "Home" })
              : "";
          }}
        >
          <LinearGradient
            start={{ x: 0.6, y: 0.2 }}
            // Background Linear Gradient
            colors={["#fecaca", "#fca5a5", "#f87171"]}
            className="px-4 py-2 pb-3 flex flex-row items-center justify-between"
          >
            <View>
              <Text className="text-white text-xl font-MonoB">
                {user ? "H I " + user?.fullname?.split(" ")[0] : "T R E A t s"}
              </Text>
              <Text className="text-white ">
                {!isAuthenticated && "Login &"} Explore wide variety of services
              </Text>
            </View>
            <Feather name="chevron-right" size={15} color={"#FFFFFF"} />
          </LinearGradient>
        </TouchableOpacity>

        <View>
          <FlatList
            ref={flatListRef}
            getItemLayout={getItemLayout}
            data={carouselData}
            showsHorizontalScrollIndicator={false}
            horizontal
            pagingEnabled={true}
            keyExtractor={(item) => item.id.toString()} // Add this line
            renderItem={({ item }) => (
              <View>
                <Image
                  // source={item.image}
                  source={{ uri: item.uri }}
                  className="h-[430px]"
                  style={{ width: width }}
                />
              </View>
            )}
            onScroll={handleScroll}
          />
        </View>
        <View className="flex-row mt-2 justify-center mb-8 items-center">
          {dotIndicators()}
        </View>

        <CategorySection />

        <View className="px-4 mb-16">
          <Image
            className="w-full h-52 rounded-md relative bg-black opacity-80"
            source={{
              uri: "https://images.pexels.com/photos/7670737/pexels-photo-7670737.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
            }}
          />
          <View className="absolute top-10 left-5">
            <Text className="font-MonoB text-white text-lg tracking-[20px]">
              FLAT 50% OFF
            </Text>
            <Text className="text-white font-Mons ml-2">
              Get styled with the best products
            </Text>
          </View>
        </View>

        <FavouriteSection />

        <StylistSection />

        <View className="bg-orange-50 mb-6 flex flex-row px-9 py-4">
          <Feather name="phone" size={25} color={"#000000"} />
          <View className="ml-4">
            <Text className="font-Logo text-[17px]">Need Help?</Text>
            <Text className="text-xs font-Quic">Connect with us</Text>
            <TouchableOpacity
              className="flex flex-row items-center mt-3"
              onPress={() => {
                Linking.openURL("tel:9835373538");
              }}
            >
              <Text className="font-Logo mr-2">Call Now</Text>
              <Feather name="chevron-right" size={17} color={"#000000"} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-pink-50 py-9 pb-16 flex items-center justify-center gap-7">
          <View className="flex flex-row ">
            <Feather name="check-circle" size={25} color={"#000000"} />
            <View className="ml-4 w-[70%]">
              <Text className="font-Logo text-[17px]">100% Authentic</Text>
              <Text className="text-xs font-Quic">
                All our products are directly sourced from brands
              </Text>
            </View>
          </View>

          <View className="flex flex-row ">
            <Feather name="users" size={25} color={"#000000"} />
            <View className="ml-4 w-[70%]">
              <Text className="font-Logo text-[15px]">Certified experts</Text>
              <Text className="text-xs font-Quic">
                Get expert consultations
              </Text>
            </View>
          </View>

          <View className="flex flex-row ">
            <Feather name="calendar" size={25} color={"#000000"} />
            <View className="ml-4 w-[70%]">
              <Text className="font-Logo text-[15px]">Easy booking</Text>
              <Text className="text-xs font-Quic">
                Hassle free and easy booking
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
