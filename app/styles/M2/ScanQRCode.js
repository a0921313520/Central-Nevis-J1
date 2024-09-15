import React from 'react'
import {
    StyleSheet,
    Dimensions,
} from "react-native";
import { color } from 'react-native-reanimated';
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
        marginBottom: 30
    },
    faceBG: {
        flexGrow: 1, // 讓這部分內容佔據頂部空間
        width: width,
		height: height,
    },
    modalTitle: {
		fontSize: 16,
		color: "#CCCCCC",
		lineHeight: 25,
        marginBottom: 20,
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
	},
    touchStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 16,
		color: "#F5F5F5",
		lineHeight: 24,
        //marginBottom: 20,
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
    },
    guestViewMode: {
        //flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    guestText: {
        color: '#00FF00', // 綠色文字
    },
    bottomButton: {
        position: 'absolute',
        bottom: ( height-600 ) ,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 50,
        height: 50,
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
    },
    buttonTouchable: {
        padding: 16,
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    camera: {
        height: 250,
        width: width * 0.8,
        marginTop: 20,
    },
    errorText: {
        paddingTop: 150,
        color: '#fff',
        textAlign: 'center'
    },
})

export default styles