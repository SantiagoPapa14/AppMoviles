import {Pressable, StyleSheet} from "react-native";

const styles = StyleSheet.create({
    defaultViewStyle: {
        backgroundColor:'#background: #FFFFFF',
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
        paddingHorizontal: 30,
        gap: 20
    },
    pressableStyle: {
        backgroundColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 5,
        borderColor:'#D9D9D9',
        padding: 30,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    presseableTextStyle: {
        fontFamily: 'Mondapick', // Ensure this line is correct
        fontSize: 15,
        lineHeight: 18,
    },
    navBarStyle: {
        display: 'flex',
        justifyContent: 'center',
        height: 75,
        paddingHorizontal: 30,
        gap: 20
    },
    smallPressableTextStyle: {
        fontFamily: 'Mondapick', // Ensure this line is correct
        fontSize: 15,
        padding: 10,
        borderRadius: 5,
    },
    smallPressableStyle: {
        backgroundColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 5,
        borderColor:'#D9D9D9',
        padding: 5,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
export default styles;