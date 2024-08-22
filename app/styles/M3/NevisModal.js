import React from 'react'
import {
    StyleSheet,
    Dimensions,
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
		padding: 18,
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
		width: '100%',
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
		flexDirection: 'column', // 垂直排列
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	faceIdLogin: {
		width:'100%',
		borderBottomWidth: 1,
		borderBottomColor: '#4B4C4B'
	},
	faceIdLoginModal: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, .4)',
		width: width,
		height: height,
	},
    faceIdLoginModalCenter: {
		width: (width - 50) * 0.9,
		borderRadius: 10,
		paddingTop: 23,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#353535',
        borderWidth: 1,
		borderColor: '#353535',//綠匡
		borderRadius: 10,
	},
    faceIdLoginModalTitle: {
		fontSize: 16,
		color: "#F5F5F5",
		lineHeight: 20,
		textAlign:'center'
	},
    faceIdLoginModalMsg: {
		fontSize: 14,
		lineHeight: 23,
		textAlign: 'center',
		paddingTop: 10,
		paddingBottom: 20,
		color: '#F5F5F5',
	},
	faceIdLoginbtnBorder: {
		width: '100%',
		borderBottomWidth: 1,
		borderBottomColor: '#4B4C4B',
		paddingVertical:10,
	},
	faceIdLoginbtnBg: {
		width: '100%',
		paddingVertical:10,
	},
	faceIdLoginbtnBorderItem: {
		color: '#4693FF',//藍字
		fontSize: 14,
		textAlign: 'center',
	},
	faceIdLoginbtnBgItem: {
		color: '#4693FF',//藍字
		fontSize: 14,
		textAlign: 'center',
	},
	pwlGoVerify: {
		color: '#00E62E',//綠字
		fontSize: 14,
		textAlign: 'center',
	},
	checkboxBase: {
		width: 24,
		height: 24,
		borderWidth: 2,
		borderRadius: 4,
		borderColor: '#00FF00', // 綠色邊框
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkboxChecked: {
		backgroundColor: 'transparent', // 點擊時保持透明背景
	},
	checkboxTick: {
		width: 10,
		height: 10,
		borderBottomWidth: 2,
		borderRightWidth: 2,
		transform: [{ rotate: '45deg' }],
		borderColor: '#00FF00', // 綠色的勾
	},
	label: {
		color: "#999999",
		marginLeft: 8,
		fontSize: 16,
	},
	Loginsuccess: {
        width: '100%',
        backgroundColor: '#00B324',
        borderColor: '#00B324',
        padding: 10,
        borderRadius: 5,
		marginBottom: 10
    },
	pwlRecognize: {
		flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17,
	},
	Tologin: {
        width: '100%',
        borderColor: '#00E62E',
        padding: 10,
        borderWidth:1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17,
    },
	pwlTitle: {
		display: 'flex',
		flexDirection: 'row', // 垂直排列
	},
	pwlMsg: {
		fontSize: 14,
		lineHeight: 23,
		textAlign: 'center',
		paddingTop: 10,
		paddingBottom: 30,
		color: '#F5F5F5',
	},
	pwlTitle: {
		fontSize: 16,
		color: "#F5F5F5",
		lineHeight: 40,
	}
})

export default styles