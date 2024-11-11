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
    }
});
export default styles;