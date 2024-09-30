import React from "react";
import { View, Text, Modal, Dimensions, Image, Platform } from "react-native";
import styles from '$NevisStyles/NevisModal'
import translate from '$Nevis/translate'
const { width, height } = Dimensions.get('window')
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';
import ImgIcon from '$NevisStyles/imgs/ImgIcon'

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
            onClose = () => {},
            confirm = '确认',
            onConfirm = () => {},
            onlyOkBtn = false,
            againVerify = false,
            imgIcon = ''
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
                                { 
                                    onlyOkBtn == true && againVerify == true ?
                                    <View>
                                        <Text style={styles.modalTitle}>{translate(title)}</Text>
                                        <Touch onPress={onClose}>
                                            <Image
                                                onPress={onClose}
                                                resizeMode="stretch"
                                                source={ImgIcon['pwlClose']}
                                                style={styles.ImgStyle}
                                            />
                                        </Touch>
                                    </View>:
                                    <Text style={styles.modalTitle}>{translate(title)}</Text>
                                }
                                <Text style={[styles.modalMsg]}>{translate(msg)}</Text>

                                {
                                    onlyOkBtn && againVerify == false &&
                                    <Touch
                                        style={[styles.btnBg]}
                                        onPress={onConfirm}
                                    >
                                        <Text style={[styles.btnBgItem]}>{translate(confirm)}</Text>
                                    </Touch>
                                }

                                {
                                    !onlyOkBtn && againVerify == false &&
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

                                {
                                    onlyOkBtn == true && againVerify == true &&
                                    //豎两个 
                                    <>
                                        <Touch onPress={onConfirm}>
                                            <View style={[styles.confirmButton]}>
                                                <Image
                                                    resizeMode="stretch"
                                                    source={imgIcon}
                                                    style={{ width: 27, height: 24, marginRight: 10 }}
                                                />
                                                <Text style={{ color: '#F5F5F5', fontSize: 14 }}>
                                                    {translate(confirm)}
                                                </Text>
                                            </View>
                                        </Touch>
                                        <Touch onPress={onCancel}>
                                            <View style={styles.cancelButton}>
                                                <Text style={{ color: '#00E62E', fontSize: 14 }}>
                                                    {translate(cancel)}
                                                </Text>
                                            </View>
                                        </Touch>
                                    </>
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
