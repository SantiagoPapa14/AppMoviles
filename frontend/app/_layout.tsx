import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "@/components/CustomDrawerContent";
import { Image } from "react-native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider, useAuth } from "./context/AuthContext";

import SettingsScreen from "./settings";
import ProfileScreen from "./profile";

import FeedScreen from "./home/feed";
import CreateScreen from "./home/create";
import SearchScreen from "./home/search";

import LoginScreen from "./auth/login";
import RegisterScreen from "./auth/register";

import SummaryScreen from "./(global)/summary/[id]/index";
import EditSummary from "./(global)/summary/[id]/edit";

import QuizScreen from "./(global)/quiz/[id]/index";
import EditQuiz from "./(global)/quiz/[id]/edit";
import PlayQuiz from "./(global)/quiz/[id]/play";
import QuizScore from "./(global)/quiz/[id]/score";

import DeckScreen from "./(global)/deck/[id]/index";
import EditDeck from "./(global)/deck/[id]/edit";
import PlayDeck from "./(global)/deck/[id]/play";
import DeckScore from "./(global)/deck/[id]/score";

import UserProfile from "./(global)/user/[id]/index";

import FollowingProjects from "./(global)/viewMore/followingProjects";
import TopDecks from "./(global)/viewMore/topDecks";
import TopQuizzes from "./(global)/viewMore/topQuizzes";
import TopSummaries from "./(global)/viewMore/topSummaries";
import MyProjects from "./(global)/viewMore/userProjects";

const DrawerNavigator = createDrawerNavigator();
const TabNavigator = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const GlobalStack = createNativeStackNavigator();

function HomeTabs() {
  return (
    <TabNavigator.Navigator
      initialRouteName="mainTabs/homeTab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Create") {
            iconName = focused ? "create" : "create-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: "#D2B48C",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#B49F84" },
        tabBarLabelStyle: { fontSize: 14, color: "white" },
        headerShown: false,
      })}
    >
      <TabNavigator.Screen
        name="Feed"
        component={FeedScreen}
        options={{ headerShown: false }}
      />
      <TabNavigator.Screen
        name="Create"
        component={CreateScreen}
        options={{ headerShown: false }}
      />
      <TabNavigator.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
    </TabNavigator.Navigator>
  );
}

function MainNavigation() {
  const { authState } = useAuth();
  if (!authState || !authState.authenticated) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
      </AuthStack.Navigator>
    );
  } else {
    return (
      <DrawerNavigator.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ route }) => ({
          drawerIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home-outline"; // default value

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
            }
            if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
            } else if (route.name === "NewItem") {
              iconName = focused ? "star" : "star-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          },
          drawerStyle: {
            backgroundColor: "#B49F84",
          },
          drawerActiveTintColor: "#D2B48C",
          drawerInactiveTintColor: "gray",
          drawerLabelStyle: { fontSize: 14, color: "white" },
          headerTitle: () => (
            <Image
              source={require("@/assets/images/LOGOS/imagotipo.png")}
              style={{ width: 250, height: 100, alignSelf: "center" }}
              resizeMode="contain"
            />
          ),
          headerTitleAlign: "center",
          drawerLockMode: "locked-closed",
        })}
      >
        <DrawerNavigator.Screen name="Home" component={HomeTabs} />
        <DrawerNavigator.Screen name="Profile" component={ProfileScreen} />
        <DrawerNavigator.Screen name="Settings" component={SettingsScreen} />
      </DrawerNavigator.Navigator>
    );
  }
}

export default function Layout() {
  const [loaded, error] = useFonts({
    Mondapick: require("../assets/fonts/Mondapick.ttf"),
    "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
    "Roboto-BlackItalic": require("../assets/fonts/Roboto-BlackItalic.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-BoldItalic": require("../assets/fonts/Roboto-BoldItalic.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  return (
    <AuthProvider>
      <NavigationContainer independent={true}>
        <GlobalStack.Navigator>
          <GlobalStack.Screen
            name="Main"
            component={MainNavigation}
            options={{ headerShown: false }}
          />

          {/*Summary*/}
          <GlobalStack.Screen name="Summary" component={SummaryScreen} />
          <GlobalStack.Screen name="Edit Summary" component={EditSummary} />

          {/*Quiz*/}
          <GlobalStack.Screen name="Quiz" component={QuizScreen} />
          <GlobalStack.Screen name="Edit Quiz" component={EditQuiz} />
          <GlobalStack.Screen name="Play Quiz" component={PlayQuiz} />
          <GlobalStack.Screen name="Quiz Score" component={QuizScore} />

          {/*Quiz*/}
          <GlobalStack.Screen name="Flashcard" component={DeckScreen} />
          <GlobalStack.Screen name="Edit Deck" component={EditDeck} />
          <GlobalStack.Screen name="Play Deck" component={PlayDeck} />
          <GlobalStack.Screen name="Deck Score" component={DeckScore} />

          {/*Social*/}
          <GlobalStack.Screen name="User Profile" component={UserProfile} />

          {/*ViewMore*/}
          <GlobalStack.Screen
            name="FollowingProjects"
            component={FollowingProjects}
          />
          <GlobalStack.Screen name="Top Decks" component={TopDecks} />
          <GlobalStack.Screen name="Top Quizzes" component={TopQuizzes} />
          <GlobalStack.Screen name="Top Summaries" component={TopSummaries} />
          <GlobalStack.Screen name="My Projects" component={MyProjects} />
        </GlobalStack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
