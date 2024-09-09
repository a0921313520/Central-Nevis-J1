import React from "react";
import { View, Text, Dimensions } from "react-native";
import Touch from 'react-native-touch-once';
import { Actions } from "react-native-router-flux";
import styles from '$NevisStyles/main'
import translate from '$Nevis/translate'
import Face from './Face'


class Setting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            setMode: window.WinModeType || '',//已设置的mode
            openMode: '',//未设置，打开哪个mode设置
            closeMode: '',//已设置，选中要关闭mode
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    //打开一个开始设置
    openMode = (key = '') => {
        this.setState({ openMode: key })
        Actions[key]({
            onSuccess: this.onSuccess,
            onError: this.onError,
        })
    }

    closeMode = (key = '') => {
        this.setState({ closeMode: key })

    }

    //设置成功
    onSuccess = (res) => {
        const setMode = this.state.openMode
        this.setState({ setMode, openMode: '' })
        window.GetModeType()
    }
    //设置失败
    onError = (res) => {
        this.setState({ openMode: '' })
    }

    //关闭成功
    onCloseSuccess = () => {
        this.setState({ closeMode: '', setMode: '' })
    }
    //关闭失败
    onCloseError = () => {
        this.setState({ closeMode: '' })
    }

    render() {

        const {
            setMode,
            closeMode,
        } = this.state

        return (
            <View>
                {
                    //都未开启
                    setMode == '' &&
                    <>
                        <Touch onPress={() => { this.openMode('Face') }}>
                            <Text>set Face</Text>
                        </Touch>
                        <Touch onPress={() => { this.openMode('Fingerprint') }}>
                            <Text>set Fingerprint</Text>
                        </Touch>
                        <Touch onPress={() => { this.openMode('Pin') }}>
                            <Text>set Pin</Text>
                        </Touch>
                    </>
                }

                {
                    //已开启Face
                    setMode == 'Face' &&
                    <Touch onPress={() => { this.closeMode('Face') }}>
                        <Text>close Face</Text>
                    </Touch>
                }
                {
                    //已开启Fingerprint
                    setMode == 'Fingerprint' &&
                    <Touch onPress={() => { this.closeMode('Fingerprint') }}>
                        <Text>close Fingerprint</Text>
                    </Touch>
                }
                {
                    //已开启Pin
                    setMode == 'Pin' &&
                    <Touch onPress={() => { this.closeMode('Pin') }}>
                        <Text>close Pin</Text>
                    </Touch>
                }


                {
                    closeMode &&
                    <Verify
                        modeType={closeMode}
                        onSuccess={() => { this.onCloseSuccess() }}//验证/添加成功
                        onError={() => { this.onCloseError() }}//验证/添加失败
                    />
                }
            </View>
        )
    }
}



export default Setting
