import "../global.css";
import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { Navigation } from "./navigation";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import store from "./redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, StyleSheet } from "react-native";
import { toast, Toasts } from "@backpackapp-io/react-native-toast";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

Asset.loadAsync([
  ...NavigationAssets,
  require("./assets/newspaper.png"),
  require("./assets/bell.png"),
]);

SplashScreen.preventAutoHideAsync();

export function App() {
  const [loaded, error] = useFonts({
    MonoB: require("../assets/LXGWWenKaiMonoTC-Bold.ttf"),
    MonsB: require("../assets/Montserrat-SemiBold.ttf"),
    Logo: require("../assets/Righteous-Regular.ttf"),
    Mons: require("../assets/Montserrat-Regular.ttf"),
    Quic: require("../assets/Quicksand-Medium.ttf"),
  });
  React.useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <GestureHandlerRootView style={styles.container}>
        <Provider store={store}>
          <Navigation
            linking={{
              enabled: "auto",
              prefixes: [
                // Change the scheme to match your app's scheme defined in app.json
                "helloworld://",
              ],
            }}
            onReady={() => {
              SplashScreen.hideAsync();
            }}
          />
          <Toasts
            defaultStyle={{
              indicator: {
                backgroundColor: "#f87171",
              },
            }}
          />
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
