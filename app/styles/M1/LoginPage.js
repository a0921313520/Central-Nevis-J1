import React from 'react'
import {
    StyleSheet,
    Dimensions,
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
		// paddingTop: Platform.OS == "android" ? 0 : 30,
		// paddingRight: 10,
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
       marginBottom: 40
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
    },
    
})

export default styles