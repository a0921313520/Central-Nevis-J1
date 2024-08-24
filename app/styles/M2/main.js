import React from 'react'
import {
    StyleSheet,
    Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    QRcode: {
        
    },
    SettingBG: {
        flex: 1,
        backgroundColor:'#0A0A0A',
        padding: 16,
    },
    modeSetting: {
        flex:1,
        justifyContent:'center',
        alignItems:'flex-start'
    },
    SettingWord: {
        color: '#F5F5F5',
        fontSize: 14,
    },
    SettingFace: {
        color: '#CCCCCC',
        fontSize: 14,
        fontWeight: '400',
        paddingLeft: 10
    },
    switchContainer: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
    },
})

export default styles