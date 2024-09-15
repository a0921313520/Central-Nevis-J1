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
        marginTop: 30
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

})

export default styles