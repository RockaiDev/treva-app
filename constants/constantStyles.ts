import { StyleSheet } from "react-native"
import { Colors } from "./Colors"
import { Fonts } from "./Fonts"


export const ConstantStyles = StyleSheet.create({
    page: {
        padding: 10,
        width: '100%'
    },

    Title1: {
        fontSize: 32,
        color: Colors.mainColor,
        fontFamily: Fonts.boldText,
        textAlign: 'right',
    },

    Title2: {
        fontSize: 26,
        color: Colors.textColor,
        fontFamily: Fonts.mediumText,
        textAlign: 'right',
        marginBottom: 5,
    },

    Title3: {
        fontSize: 20,
        color: Colors.textColor,
        fontFamily: Fonts.boldText,
        textAlign: 'right',
    },

    normalText: {
        fontFamily: Fonts.regularText,
        fontSize: 20,
        color: Colors.textColor,
        textAlign: 'right'
    },

    btn: {
        fontFamily: Fonts.boldText,
        backgroundColor: Colors.mainColor,
        color: Colors.calmWhite,
        padding: 5,
        width: 200,
        fontSize: 28,
        borderRadius: 5,
        textAlign: 'center',
        marginVertical: 20,
        shadowOpacity: 0.4,
    },

    lableText: {
        marginBottom: 10,
        textAlign: 'right',
        fontFamily: Fonts.regularText,
        fontSize: 24,
        color: Colors.textColor
    },

    inputText: {
        padding: 3,
        fontSize: 24,
        fontFamily: Fonts.mediumText,
        width: '90%',
        textAlign: 'right',
        marginRight: 10
    },
    
    inputContainer: {
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: "100%",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: Colors.calmWhite,
        borderWidth: 1,
        borderColor: Colors.mainColor,
        marginVertical: 5
    },
    section: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: Colors.calmWhite,
        borderRadius: 10,
        direction: 'rtl'
    },
    shadowContainer: {
        shadowColor: Colors.textColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 20,
    }
})