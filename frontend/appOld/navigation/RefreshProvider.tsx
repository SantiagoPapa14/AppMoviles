import { createDrawerNavigator } from "@react-navigation/drawer";
import { createContext, useContext, useState } from "react";

const Drawer = createDrawerNavigator();

const RefreshContext = createContext({
  refresh: false,
  setRefresh: (value: boolean) => {},
});

export const useRefresh = () => useContext(RefreshContext);
