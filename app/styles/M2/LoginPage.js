import React from 'react'
import {
    StyleSheet,
    Dimensions,
    Platform,
} from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    QRcode: {
        
    },
    rootContainer: {
		flex: 1,
	},
    headerTop: {
		top: 0,
		width: width,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		zIndex: 20,
		padding: 15,
        paddingTop: 55,
	},
    logo: {
		justifyContent: "center",
		alignItems: "center"
	},
    Loginsuccess: {
        width: '100%',
        backgroundColor: '#00B324',
        borderColor: '#00B324',
        padding: 15,
        borderRadius: 5,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17,
        marginBottom: 10,
    },
    Tologin: {
        width: '100%',
        borderColor: '#00E62E',
        padding: 15,
        borderWidth:1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17
    },
    contentStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginBottom: 25
    },
    guestViewMode: {
        position: 'absolute', // 這裡使用了絕對定位
        bottom: 10, // 距離底部10個單位
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    guestText: {
        color: '#00FF00', // 綠色文字
        fontFamily: "Kanit",
    },
    contentHeadText: {
        color: '#CCCCCC', 
        fontSize: 16, 
        fontWeight: '400', 
        lineHeight: 40,
        fontFamily: "Kanit",
    },
    contentNameText: {
        color: '#F5F5F5', 
        fontSize: 24, 
        fontWeight: '700', 
        lineHeight: 40,
        fontFamily: "Kanit",
    },
    contentAccChange: {
        color: '#00E62E', 
        fontSize: 14, 
        fontWeight: '400',
        lineHeight: 35,
        fontFamily: "Kanit",
    },
    loginName: {
        color: '#F5F5F5', 
        fontSize: 17,
        fontFamily: "Kanit",
    },
    normalLogin: {
        color: '#00E62E', 
        fontSize: 17,
        fontFamily: "Kanit",
    },
    noAcc: {
        color: '#999999', 
        fontSize: 14,
        fontFamily: "Kanit",
    },
    goRegister: {
        color: '#00E62E', 
        fontSize: 14, 
        fontFamily: "Kanit",
    }
})

export default styles