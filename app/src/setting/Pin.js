import React from "react";
import { View, Text, Dimensions, Image } from "react-native";
import styles from '$NevisStyles/Pin'
import translate from '$Nevis/translate'
import Touch from 'react-native-touch-once';
import ImgIcon from '$NevisStyles/imgs/ImgIcon';
const { width, height } = Dimensions.get('window')
import { UserTerms } from './index'
import { Actions } from "react-native-router-flux";


class Pin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
		
    }

    render() {
        

        const { getEnroll, onSuccess, onSuccessBack, userName } = this.props

        return (
            <View style={{ flex: 1, backgroundColor: "#000000" }}>
                {!onSuccess && <View style={styles.faceBG}>    
                    <View style={styles.user}>
                        <Image
                            resizeMode="stretch"
                            source={ImgIcon['usrPinIcon']}
                            style={{ width: 120, height: 120 }}
                        />
                        <Text style={styles.nameStyle}>{userName}</Text>
                    </View>          
                    <View>
                        <View style={styles.title}>                                  
                            <Text style={[styles.modalTitle,{ textAlign:'center' }]}>{translate("在“我的”页面中完成 PIN 码识别设置，以提升账号验证的便捷性与安全性。")}</Text>
                        </View>
                        <UserTerms />
                        <View style={styles.touchStyle}>
                            <Touch
                                style={[styles.btnBg]}
                                onPress={getEnroll}
                            >
                                <Text style={[styles.btnBgItem]}>{translate('启用')}</Text>
                            </Touch>
                        </View>
                    </View>               
                </View>}

                {onSuccess && <View style={styles.faceBG}>    
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
                                onPress={onSuccessBack}
                            >
                                <Text style={[styles.btnBgItem]}>{translate('完成')}</Text>
                            </Touch>
                        </View>
                    </View>               
                </View>}
            </View>
        )
    }
}



export default Pin
