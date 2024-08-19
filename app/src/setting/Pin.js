import React from "react";
import { View, Text } from "react-native";
import styles from '$NevisStyles/Pin'
import translate from '$Nevis/translate'
import Verify from '../verify/index'
import Touch from 'react-native-touch-once';


class Pin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            onVerify: false
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
        this.setState({onVerify: false})
    }

    onError = () => {
        this.setState({onVerify: false})
    }

    render() {
		
        const { onVerify } = this.state

        return (
            <View>
				<Text>Pin</Text>
                <Touch onPress={() => { this.onVerify() }}>
                    <Text>添加Pin验证</Text>
                </Touch>
                {
                    onVerify &&
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
