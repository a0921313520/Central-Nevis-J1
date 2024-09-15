import React from "react";
import { View, Text, Modal, Dimensions, Image, Platform } from "react-native";
import styles from '$NevisStyles/NevisModal'
import translate from '$Nevis/translate'
const { width, height } = Dimensions.get('window')
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';

class Modals extends React.Component {
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
        const {
            modalVisible = false,
            title = '',
            msg = '',
            cancel = '取消',
            onCancel = () => {},
            confirm = '确认',
            onConfirm = () => {},
            onlyOkBtn = false,
        } = this.props
        return (
            <>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.models}>
                        <View style={[styles.modalActive]}>
                            <View style={[styles.modalCenter]}>
                                <Text style={styles.modalTitle}>{translate(title)}</Text>
                                <Text style={[styles.modalMsg]}>{translate(msg)}</Text>

                                {
                                    onlyOkBtn &&
                                    <Touch
                                        style={[styles.btnBg]}
                                        onPress={onConfirm}
                                    >
                                        <Text style={[styles.btnBgItem]}>{translate(confirm)}</Text>
                                    </Touch>
                                }

                                {
                                    !onlyOkBtn &&
                                    //豎两个 
                                    <View style={styles.btnVerticalList}>
                                        <Touch
                                            style={styles.leftBtn}
                                            onPress={onCancel}
                                        >
                                            <Text style={styles.leftBtnItem}>{translate(cancel)}</Text>
                                        </Touch>
                                        <Touch
                                            style={[styles.rightBtn]}
                                            onPress={onConfirm}
                                        >
                                            <Text style={[styles.rightBtnItem]}>{translate(confirm)}</Text>
                                        </Touch>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}



export default Modals
