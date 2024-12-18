import { createStackNavigator } from "@react-navigation/stack";

import CreateSummary from "@/app/(creationScreens)/createSummary";
import CreateFlashcard from "@/app/(creationScreens)/createFlashcard";
import CreateQuiz from "@/app/(creationScreens)/createQuiz";
import CreateMenu from "@/app/(creationScreens)/createMenu";

const Stack = createStackNavigator();

const App = () => {
  return (
    <Stack.Navigator initialRouteName="Menu">
      <Stack.Screen
        name="Menu"
        component={CreateMenu}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateFlashcard"
        component={CreateFlashcard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateQuiz"
        component={CreateQuiz}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateSummary"
        component={CreateSummary}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default App;
