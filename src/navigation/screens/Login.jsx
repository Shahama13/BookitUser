import {
  ActivityIndicator,
  BackHandler,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  instance,
  userLogin,
} from "../../redux/actions/userActions";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { toast } from "@backpackapp-io/react-native-toast";

const Login = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const dispatch = useDispatch();
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const [loader, setLoader] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Home");
        return true; // Prevent default back action
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Cleanup the event listener on component unmount
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [navigation])
  );
  const handleLogin = async (e) => {
    await dispatch(userLogin(email, password));
    await dispatch(getCurrentUser());
    setEmail("");
    setPassword("");
  };
  const handleRegister = async () => {
    try {
      setLoader(true);
      const { data } = await instance.post("/user/register", {
        fullname,
        email,
        password,
      });
      if (data.success) {
        toast.success(data.message);
        setEmail("");
        setPassword("");
        setFullname("");
        setRegister(false);
        setLoader(false);
        navigation.navigate("Verify", {
          screen: params.screen ? params.screen : "",
          id: params.id ? params.id : "",
        });
      }
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated)
      navigation.navigate(params.screen ? params.screen : "Home", {
        id: params.id ? params.id : "",
      });
  }, [isAuthenticated]);

  return (
    <SafeAreaView>
      <View className="bg-white px-4 h-full">
        <View className="bg-black mt-16 flex flex-col items-center justify-center py-11 rounded-md">
          <Text className="font-Quic text-lg text-white mb-2">
            Hi, welcome to
          </Text>
          <Text className="font-Logo text-6xl text-red-400">bookit</Text>
        </View>

        {register ? (
          <View className="flex mt-[10%]">
            <Text className="font-MonsB text-center text-red-400">Sign Up</Text>
            <View className="space-y-3 selection:mt-[10%] flex">
              <TextInput
                placeholderTextColor={"#9ca3af"}
                selectionColor="#000000"
                placeholder="Enter fullname"
                value={fullname}
                onChangeText={setFullname}
                className="border-black border-[1.5px] px-4 mb-3 py-3 rounded-xl font-Quic text-lg"
              />
              <TextInput
                placeholderTextColor={"#9ca3af"}
                placeholder="Enter email"
                selectionColor="#000000"
                value={email}
                onChangeText={setEmail}
                className="border-black border-[1.5px] px-4 py-3 mb-3 rounded-xl font-Quic text-lg"
              />
              <TextInput
                placeholderTextColor={"#9ca3af"}
                placeholder="Enter password"
                selectionColor="#000000"
                value={password}
                onChangeText={setPassword}
                className="border-black text-black border-[1.5px] px-4 py-3 rounded-xl font-Quic text-lg"
                secureTextEntry={true}
              />
            </View>

            <TouchableOpacity
              className="mt-[8%] bg-black rounded-xl py-4"
              onPress={handleRegister}
            >
              {loader ? (
                <ActivityIndicator size={"small"} color={"#FFFFFF"} />
              ) : (
                <Text className="text-white text-center font-Quic">
                  Register
                </Text>
              )}
            </TouchableOpacity>

            <Text
              onPress={() => setRegister(false)}
              className=" text-center mt-3 text-black font-Quic"
            >
              Already have an account?
            </Text>
          </View>
        ) : (
          <View className="flex mt-[10%]">
            <Text className="font-MonsB text-center text-red-400">
              Login Now
            </Text>
            <View className="space-y-3 selection:mt-[10%] flex">
              <TextInput
                placeholderTextColor={"#9ca3af"}
                selectionColor="#000000"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                className="border-black border-[1.5px] px-4 py-3 mb-4 rounded-xl font-Quic text-lg"
              />
              <TextInput
                placeholderTextColor={"#9ca3af"}
                selectionColor="#000000"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                className="border-black border-[1.5px] px-4 py-3 rounded-xl font-Quic text-lg text-black"
                secureTextEntry={true}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text className="self-end mr-3 text-red-400 font-MonsB my-2">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="mt-[8%] bg-black rounded-xl py-4"
              onPress={handleLogin}
            >
              {loading ? (
                <ActivityIndicator size={"small"} color={"#FFFFFF"} />
              ) : (
                <Text className="text-white text-center font-Quic">Login</Text>
              )}
            </TouchableOpacity>

            <Text
              onPress={() => setRegister(true)}
              className=" text-center mt-3 text-black font-Quic"
            >
              Dont have an account?
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Login;
