import React from 'react'
import {
    StyleSheet,
    Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    nevisLogin: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25
    },
    userName: {
        color: '#F5F5F5',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 25,
    },
    nevisLoginIcon: {
        width: 30,
        height: 30,
    },
    scanIcon: {
        width: 26,
        height: 26,
        marginLeft: 15,
    },
    guestViewMode: {
        position: 'absolute', // 這裡使用了絕對定位
        bottom: 80, // 距離底部10個單位 eg,iphone14 ui ok
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    guestText: {
        color: '#00FF00', // 綠色文字
    },
})

export default styles