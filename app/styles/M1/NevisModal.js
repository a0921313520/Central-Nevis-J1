import React from 'react'
import {
	StyleSheet,
	Dimensions,
	Platform
} from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
	QRcode: {

	},
	modalActive: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, .4)',
		width: width,
		height: height,
	},
	modalCenter: {
		width: width * 0.9,
		borderRadius: 10,
		padding: Platform.OS == 'android'? 35 : 40,
		paddingTop: 30,
		paddingBottom: 30,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#0A0A0A',
		borderWidth: 1,
		borderColor: '#00E62E',//綠匡
		borderRadius: 3,
	},
	modalTitle: {
		fontSize: 16,
		color: "#F5F5F5",
		lineHeight: 20,
		textAlign: 'center'
	},
	models: {
		position: 'absolute',
		zIndex: 99,
		width: width,
		height: height,
	},
	modalMsg: {
		fontSize: 14,
		lineHeight: 23,
		textAlign: 'center',
		paddingTop: 20,
		paddingBottom: 20,
		color: '#F5F5F5',
	},
	modalBtnGg: {
		backgroundColor: '#00B324',
		borderRadius: 5,
		height: 40,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
	},
	modalBtnGgItem: {
		color: '#F5F5F5',
		fontSize: 14,
	},
	btnList: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		width:Platform.OS == 'android'? '97%' : '96%'
	},
	btnBorder: {
		width: '45%',
		borderWidth: 1,
		borderColor: '#00E62E',//綠匡
		borderRadius: 4,
	},
	btnBorderItem: {
		color: '#00E62E',//綠字
		fontSize: 16,
		textAlign: 'center',
		lineHeight: 40,
	},
	btnBg: {
		width: '45%',
		backgroundColor: '#00B324',//綠底
		borderRadius: 4,
	},
	btnBgItem: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
		lineHeight: 42,
	},
	btnVerticalList: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		width: '100%',
	},
	leftBtn: {
		width: '46%',
		borderColor: '#00B324',
		borderWidth: 1,
		borderRadius: 4,
	},
	leftBtnItem: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
		lineHeight: 40,
	},
	rightBtn: {
		width: '46%',
		backgroundColor: '#00B324',
		borderRadius: 4,
	},
	rightBtnItem: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
		lineHeight: 42,
	},
	btnVerticalListVerify: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 50,
		width: '100%',
	},
	confirmButton: {
        backgroundColor: '#00B324',
        borderColor: '#00B324',
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row', // 确保图标和文字在同一行
        paddingVertical: 8, // 调整按钮高度
        //paddingHorizontal: 73, // 调整左右内边距
		width: 247,
        marginBottom: 20, // 调整按钮之间的间距
    },
    cancelButton: {
        borderColor: '#00E62E',
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12, // 调整按钮高度
        paddingHorizontal: 95, // 调整左右内边距
        marginBottom: 10, // 调整按钮之间的间距
    },
	CheckBox: {
		//marginLeft: Platform.OS == 'android' ? -35 :  -130,
		marginLeft: Platform.OS == 'android' ? -150 : (isIphone14Upper ? 13 : DeviceInfoIos ? -70 : -80),
		marginBottom: 25 
	},
	ImgStyle: {
		width: 24, 
		height: 24, 
		position:'absolute', 
		top: -38, 
		right: Platform.OS === "android" ? -35 : (isIphone12Upper ? -110 : -45) 
	},
	confirmButtonUpper: {
		color: '#F5F5F5', 
		fontSize: 14,
	},
	cancelButtonDown: {
		color: '#00E62E', 
		fontSize: 14,
	}
})

export default styles