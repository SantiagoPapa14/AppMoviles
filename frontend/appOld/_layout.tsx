import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./login";
import Register from "./register";

import DrawerNavigator from "./navigation/DrawerNav";

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

export const AppLayout = () => {
  const { authState } = useAuth();

  if (!authState || !authState.authenticated) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register"
          component={Register}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  } else {
    return <DrawerNavigator />;
  }
};
