import { createStackNavigator } from "@react-navigation/stack";

import SearchMenu from "@/app/(searchScreens)/searchMenu";
import SearchResult from "@/app/(searchScreens)/searchResult/[query]";

const Stack = createStackNavigator();

const App = () => {
  return (
    <Stack.Navigator initialRouteName="SearchMenu">
      <Stack.Screen
        name="SearchMenu"
        component={SearchMenu}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchResult"
        component={SearchResult}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default App;
