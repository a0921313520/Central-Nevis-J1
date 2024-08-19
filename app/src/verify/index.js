import React from "react";
import { View, Text, Dimensions } from "react-native";
import translate from '$Nevis/translate'
import Face from './Face'

//识别方式, 认脸/指纹/pin
class Verify extends React.Component {
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
        const { modeType, onSuccess, onError } = this.props
        return (
            <View>
                {
                    modeType == 'Face' &&
                    <Face
                        onSuccess={onSuccess}//验证/添加成功
                        onError={onError}//验证/添加失败
                    />
                }
                {
                    modeType == 'Fingerprint' &&
                    <Face
                        onSuccess={onSuccess}//验证/添加成功
                        onError={onError}//验证/添加失败
                    />
                }
                {
                    modeType == 'Pin' &&
                    <Face
                        onSuccess={onSuccess}//验证/添加成功
                        onError={onError}//验证/添加失败
                    />
                }
            </View>
        )
    }
}



export default Verify
