import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import your screen components
import CreateSummary from "@/app/(creationTabs)/createSummary";
import CreateFlashcard from "@/app/(creationTabs)/createFlashcard";
import CreateQuiz from "@/app/(creationTabs)/createQuiz";
import CreateMenu from "@/app/(creationTabs)/createMenu";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
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
    </NavigationContainer>
  );
};

export default App;
