import React from 'react'
import {
    StyleSheet,
    Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    pinCode: {
        flex: 1,
        backgroundColor:'#0A0A0A',
    },
    pinTips: {
        marginTop: 40,
        marginBottom: 20,
    },
    pinTipsItem: {
        fontSize: 16,
        color: '#F5F5F5',
        textAlign: 'center',
        fontFamily:"Kanit",
    },
    backBtn: {
        color: '#00E62E',
        textAlign: 'center',
        paddingTop: 70,
        fontFamily:"Kanit",
    },
})

export default styles