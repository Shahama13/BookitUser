import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ProtectedRoute from "../../components/ProtectedRoute";
import EmptyFavs from "../../components/EmptyFavs";
import Specialcategory from "../../components/Specialcategory";
import { useSelector } from "react-redux";

const MyFavourites = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <ProtectedRoute screen={"My Favourites"}>
      <SafeAreaView className="flex-1 bg-white h-full pb-4">
        {user?.favourites?.length === 0 ? (
          <EmptyFavs
            title={"Your favourites is empty!"}
            description={"Add your favourites"}
          />
        ) : (
          <ScrollView>
            <View className="mt-5 px-4">
              {user?.favourites?.map((f) => (
                <Specialcategory
                  fav={true}
                  description={f.description}
                  id={f._id}
                  name={f.name}
                  rounded={true}
                  uri={f.imageUrl}
                  key={f._id}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </ProtectedRoute>
  );
};

export default MyFavourites;
