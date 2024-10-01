import React from 'react'
import {
    StyleSheet,
    Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    QRcode: {
        
    },
    user: {
        paddingTop: ( height-400 ) / 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameStyle: {
        color: '#F5F5F5',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 15,
        marginBottom: 30,
        fontFamily:"Kanit",
    },
    faceBG: {
		padding: 18,
        width: width,
		height: height,
    },
    modalTitle: {
		fontSize: 16,
		color: "#CCCCCC",
		lineHeight: 25,
        marginBottom: 20,
        fontFamily:"Kanit",
	},
    modalMsg: {
		fontSize: 12,
		lineHeight: 23,
		textAlign: 'center',
		paddingTop: 20,
		paddingBottom: 30,
		color: '#CCCCCC',
	},
    btnBg: {
		width: '100%',
		backgroundColor: '#00B324',//綠底
		borderRadius: 4,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
	},
    btnBgItem: {
		color: '#F5F5F5',
		fontSize: 16,
		textAlign: 'center',
		lineHeight: 42,
        fontFamily:"Kanit",
	},
    touchStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 16,
		color: "#F5F5F5",
		lineHeight: 24,
        fontFamily:"Kanit",
    },
    successUser: {
        paddingTop: ( height-400 ) / 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    successMsg: {
        fontSize: 14,
		lineHeight: 22,
		textAlign: 'center',
		paddingTop: 10,
		paddingBottom: 30,
		color: '#CCCCCC',
        fontFamily:"Kanit",
    }

    
})

export default styles