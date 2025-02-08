import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {  useNavigation } from "@react-navigation/native";

const UnProtectedRoute = ({ children }) => {
  const navigation = useNavigation();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigation.navigate("Home");
    }
    console.log(
      isAuthenticated,
      "isAuth from unprotected route",
      "loading:",
      loading
    );
  }, [isAuthenticated, loading]);

  // if (loading) return <ActivityIndicator size={"large"} />;
  if (isAuthenticated) return navigation.navigate("Home");
  return children;
};

export default UnProtectedRoute;
