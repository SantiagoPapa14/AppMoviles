import { Pressable, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  defaultViewStyle: {
    backgroundColor: "#background: #FFFFFF",
    display: "flex",
    justifyContent: "center",
    height: "100%",
    paddingHorizontal: 30,
    gap: 20,
  },
  pressableStyle: {
    backgroundColor: "#D9D9D9",
    borderWidth: 2,
    borderRadius: 5,
    padding: 30,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc", // Border color
  },
  presseableTextStyle: {
    fontSize: 15,
    lineHeight: 18,
  },
  navBarStyle: {
    display: "flex",
    justifyContent: "center",
    height: 75,
    paddingHorizontal: 30,
    gap: 20,
  },
  smallPressableTextStyle: {
    fontSize: 15,
    padding: 10,
    borderRadius: 5,
  },
  smallPressableStyle: {
    backgroundColor: "#D9D9D9",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#ccc", 
    padding: 5,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default styles;

