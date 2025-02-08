import { HeaderButton, Text } from "@react-navigation/elements";
import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Account from "./screens/Account";
import MyFavourites from "./screens/MyFavourites";
import Settings from "./screens/Settings";
import ChangePassword from "./screens/ChangePassword";
import MyAppointments from "./screens/MyAppointments";
import ForgotPassword from "./screens/ForgotPassword";
import StylistProfile from "./screens/StylistProfile";
import ResetPassword from "./screens/ResetPassword";
import Verify from "./screens/Verify";
import AllStylists from "./screens/AllStylists";
import SpecialCategory from "./screens/SpecialCategory";
import Review from "./screens/Review";
import Profile from "./screens/Profile";
import { NotFound } from "./screens/NotFound";
import Feather from "@expo/vector-icons/Feather";
import Title from "../components/Title";

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        headerShown: false,
      },
    },
    Login: {
      screen: Login,
      options: {
        headerShown: false,
      },
    },
    Account: {
      screen: Account,
      options: {
        headerShown: false,
      },
    },
    "My Favourites": {
      screen: MyFavourites,
      options: {
        title: "My Favourites",
        headerTitleStyle: {
          fontFamily: "MonsB",
          fontSize: 17,
        },
      },
    },
    Profile: {
      screen: Profile,
      options: {
        title: "My Profile",
        headerTitleStyle: {
          fontFamily: "MonsB",
          fontSize: 17,
        },
      },
    },
    ChangePassword: {
      screen: ChangePassword,
      options: {
        title: "Change Password",
        headerTitleStyle: {
          fontFamily: "MonsB",
          fontSize: 17,
        },
      },
    },
    MyAppointments: {
      screen: MyAppointments,
      options: {
        title: "My Appointments",
        headerTitleStyle: {
          fontFamily: "MonsB",
          fontSize: 17,
        },
      },
    },
    ForgotPassword: {
      screen: ForgotPassword,
      options: { headerShown: false },
    },
    ResetPassword: {
      screen: ResetPassword,
      options: { headerShown: false },
    },
    Verify: {
      screen: Verify,
      options: { headerShown: false },
    },
    AllStylists: {
      screen: AllStylists,
      options: { headerShown: false },
    },
    StylistProfile: {
      screen: StylistProfile,
      options: { headerShown: false },
    },
    SpecialCategory: {
      screen: SpecialCategory,
      options: { headerShown: false },
    },
    Review: {
      screen: Review,
      options: {
        title: "Review",
        headerTitleStyle: {
          fontFamily: "MonsB",
          fontSize: 17,
        },
      },
    },
    Settings: {
      screen: Settings,
      options: ({ navigation }) => ({
        presentation: "modal",
        headerRight: () => (
          <HeaderButton onPress={navigation.goBack}>
            <Text>Close</Text>
          </HeaderButton>
        ),
      }),
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);
