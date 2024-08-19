import React from "react";
import { View, Text } from "react-native";
import styles from '$StyleSheets/LoginPage'
import translate from '$Nevis/translate'
import Touch from 'react-native-touch-once';
import Verify from './verify/index'

//新登录page

class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openVerify: this.props.openVerify || false,//跳转进入是否直接打开验证
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    openVerify = () => {
        this.setState({openVerify: true})
    }

    render() {

        const { modeType, onSuccess, onError, userName } = this.props

        const { openVerify } = this.state 

        return (
            <View>
                <Text>{userName}登录page</Text>
                <Touch onPress={() => {this.openVerify()}}>
                    <Text>立即验证</Text>
                </Touch>
                {
                    modeType != '' && openVerify &&
                    <Verify
                        modeType={modeType}
                        onSuccess={() => { }}//验证/添加成功
                        onError={() => { }}//验证/添加失败
                    />
                }
            </View>
        )
    }
}



export default LoginPage
