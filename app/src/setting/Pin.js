import React from "react";
import { View, Text, Dimensions, Image } from "react-native";
import styles from '$NevisStyles/Pin'
import translate from '$Nevis/translate'
import Verify from '../verify/index'
import Touch from 'react-native-touch-once';
import ImgIcon from '$NevisStyles/imgs/ImgIcon';
const { width, height } = Dimensions.get('window')
import { Actions } from "react-native-router-flux";


class Pin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            onVerify: false,
            memberInfo: this.props.memberInfo,
            isSuccess: false
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
		
    }

    onVerify = () => {
        this.setState({onVerify: true})        
    }

    onSuccess = () => {
        this.setState({onVerify: false, isSuccess: true})
    }

    onError = () => {
        this.setState({onVerify: false})
    }

    render() {
		
        const { onVerify, memberInfo, isSuccess } = this.state
        console.log('fingerBG memberInfo>>>>>>',memberInfo )

        return (
            <View style={{ flex: 1, backgroundColor: "#000000" }}>
                {!isSuccess && !onVerify && <View style={styles.faceBG}>    
                    <View style={styles.user}>
                        <Image
                            resizeMode="stretch"
                            source={ImgIcon['usrPinIcon']}
                            style={{ width: 120, height: 120 }}
                        />
                        <Text style={styles.nameStyle}>{memberInfo.FirstName}</Text>
                    </View>          
                    <View>
                        <View style={styles.title}>                                  
                            <Text style={[styles.modalTitle,{ textAlign:'center' }]}>{translate("在“我的”页面中完成 PIN 码识别设置，以提升账号验证的便捷性与安全性。")}</Text>
                        </View>
                        <Text style={[styles.modalMsg]}>
                            {/* 段點位置無法判斷 */}
                            {/* {translate(`点击“启用”即表示您同意竞博规则与条款`)} */}
                            Kích hoạt và chấp nhận các <Text style={{ color:'#00E62E' }} onPress={()=>{ Actions.UserTerms({ TermsType: "user" }) }}>điều khoản điều kiện</Text> của JBO
                        </Text>
                        <View style={styles.touchStyle}>
                            <Touch
                                style={[styles.btnBg]}
                                onPress={() => { this.onVerify() }}
                            >
                                <Text style={[styles.btnBgItem]}>{translate('启用')}</Text>
                            </Touch>
                        </View>
                    </View>               
                </View>}

                {isSuccess && !onVerify && <View style={styles.faceBG}>    
                    <View style={styles.successUser}>
                        <Image
                            resizeMode="stretch"
                            source={ImgIcon['successIcon']}
                            style={{ width: 80, height: 80 }}
                        />
                    </View>          
                    <View>
                        <View style={styles.title}>                                  
                            <Text style={[styles.successTitle,{ textAlign:'center' }]}>{translate("PIN 码识别设置成功")}</Text>
                        </View>
                        <Text style={[styles.successMsg]}>
                            {translate('您已可以使用PIN 码识别进行登录和账号验证。')}
                        </Text>
                        <View style={styles.touchStyle}>
                            <Touch
                                style={[styles.btnBg]}
                                onPress={() => { Actions.NevisSetting() }}
                            >
                                <Text style={[styles.btnBgItem]}>{translate('完成')}</Text>
                            </Touch>
                        </View>
                    </View>               
                </View>}

				{/* <Text>Pin</Text>
                <Touch onPress={() => { this.onVerify() }}>
                    <Text>添加Pin验证</Text>
                </Touch> */}
                {
                    !isSuccess && onVerify &&
                    <Verify
                        modeType={'Pin'}
                        onSuccess={() => { this.onSuccess() }}//验证/添加成功
                        onError={() => { this.onError() }}//验证/添加失败
                />
                }
            </View>
        )
    }
}



export default Pin
