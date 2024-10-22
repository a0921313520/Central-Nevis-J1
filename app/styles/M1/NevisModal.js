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
	sensorIcon: {
		backgroundColor: '#2E2E2E',
		width: 150,
		height: 150,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
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
		padding: 30,
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
		paddingTop: 10,
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
		width: '94%'
	},
	btnBorder: {
		width: '47%',
		borderWidth: 1,
		borderColor: '#00E62E',//綠匡
		borderRadius: 4,
	},
	btnBgs: {
		width: '47%',
		backgroundColor: '#00B324',//綠底
		borderRadius: 4,
	},
	btnBorderItem: {
		color: '#00E62E',//綠字
		fontSize: 16,
		textAlign: 'center',
		lineHeight: 40,
	},
	btnBg: {
		width: '55%',
		backgroundColor: '#00B324',//綠底
		borderRadius: 4,
		marginBottom: 10,
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
		display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row', // 确保图标和文字在同一行
        marginBottom: 20, // 调整按钮之间的间距
		width: width * 0.9 - 70,
		height: 40,
    },
    cancelButton: {
        borderColor: '#00E62E',
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10, // 调整按钮之间的间距
		width: width * 0.9 - 70,
		height: 40,
    },
	CheckBox: {
		width: '92%',
		marginBottom: 25 
	},
	closeIcon: {
		position:'absolute', 
		top: 15, 
		right: 15
	},
	ImgStyle: {
		width: 24, 
		height: 24, 
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