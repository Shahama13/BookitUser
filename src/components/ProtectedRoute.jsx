import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const ProtectedRoute = ({ children, screen }) => {
  const navigation = useNavigation();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigation.navigate("Login", { screen });
      }
    }
  }, [isAuthenticated, loading, navigation, screen]);

  // If loading, you may want to return a loading indicator
  if (loading) return null; // or <ActivityIndicator size={"large"}/>

  // If authenticated, return the children
  if (isAuthenticated) return children;

  // If not authenticated, return null to prevent rendering
  return null;
};

export default ProtectedRoute;
