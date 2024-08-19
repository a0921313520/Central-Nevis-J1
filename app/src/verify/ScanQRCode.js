import React from "react";
import { View, Text, Dimensions } from "react-native";
import styles from '$StyleSheets/ScanQRCode'
import translate from '$Nevis/translate'
import Verify from './index'

//扫码二维码
class ScanQRCode extends React.Component {
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
        const { modeType } = this.props
        return (
            <View>
                <Text>扫码二维码</Text>
                {
                    modeType != '' &&
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



export default ScanQRCode
