import React from "react";
import { View, Text, Modal,  Dimensions, Image, Platform } from "react-native";
import styles from '$NevisStyles/NevisModal'
import translate from '$Nevis/translate'
const { width, height } = Dimensions.get('window')
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';
import ImgIcon from '$NevisStyles/imgs/ImgIcon';
import CheckBox from 'react-native-check-box'

//全部提示Modal，用window方法调用

class NevisModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            passwordModal: false, // 控制 Modal 的可见性
            repeatModal: false,
            newSettingModal: false,
            memberInfo:'', 
            phoneNumber:'', 
            email:'',
            showFace: false,
            faceUpperLimit: false,
            faceIdLoginUpperLimit:false,
            fingerPrintLoginUpperLimit: false,
            homepageSetModal: false,
            checkBox1: false,
            faceLoginUpperLimit: false,
            closeSettingModal: false,
            alreadySettingModal: false,
            pwlVerification: false,
            invalidCodeModal: false,
            validCodeModal: false,
            toastSuccessFlag: false
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
		
    }

    handleCancel = () => {
        // 处理取消按钮逻辑
        this.setState({ 
            passwordModal: false, 
            repeatModal: false, 
            newSettingModal: false, 
            faceUpperLimit: false, 
            homepageSetModal: false, 
            faceLoginUpperLimit: false, 
            invalidCodeModal: false,
            validCodeModal: false,
            toastSuccessFlag: false,
        });
    }
    
    handleOk = () => {
        // 处理确认按钮逻辑
        this.setState({ passwordModal: false });
        Actions.Password({
            memberInfo:this.state.memberInfo,
            phoneNumber:this.state.phoneNumber,
            email:this.state.email,
        });  
    }

    handleRepeatOk = () => {
        this.setState({ 
            repeatModal: false, 
            faceIdLoginUpperLimit: false,
            fingerPrintLoginUpperLimit: false, 
            homepageSetModal: false, 
            closeSettingModal: false, 
        });
		// 处理确认逻辑和页面跳转
		Actions.NevisSetting();  
	}

    handleAlreadySet = () => {
        this.setState({ alreadySettingModal: false });
		// 处理确认逻辑和页面跳转
		
	}

    handleCodeOk = () => {
        this.setState({ 
            validCodeModal: false,
            toastSuccessFlag: true, 
          },()=>{
            setTimeout(() => {
              this.setState({ toastSuccessFlag: false });
              //登出
            }, 3000);
          }); 
    }


    render() {

       
        window.onModal = (key, status, memberInfo, phoneNumber, email ) => {
            console.log('key, status, memberInfo, phoneNumber, email')
            console.log(memberInfo, phoneNumber, email)
            this.setState({ [key]: status, memberInfo, phoneNumber, email })         
        }

        window.accountSetModal = () => {
            console.log('authenticators>>>>',authenticators)
            if(Object.keys(authenticators).length > 0){
                //设置过
                this.setState({ 
                    repeatModal: true
                })
            }else {
                //没有设置
                Actions.NevisSetting(); 
            }
        }

        window.GetModeType = (key) => {
            console.log(key,'modeType>>>>>>',modeType)
            //Already setup face ID in device??
            if(modeType == ''){
                //没有设置指紋或臉部
                if(key == 'Face'){
                    this.setState({ 
                        showFace: true
                    })
                }else{
                    this.setState({ 
                        showFace: false
                    })
                }
                this.setState({ 
                    newSettingModal: true
                })
            }else{
                //otp process
            }
        }

        window.goFaceSetting = () => {
            console.log('NevisConfigurations',NevisConfigurations)
            if(
                //Popup for user hit upper limit. Upper limit will reset after 5 mins.
                NevisConfigurations.faceIdSetupUpperLimit == 0 ||
                //Face ID exceed the number of time fail login?
                //Upper limit is 5 times for each authentication methods
                NevisConfigurations.faceIdLoginUpperLimit == 0 
            ){
                this.setState({
                    faceUpperLimit: true
                    //faceIdLoginUpperLimit: true
                })
            }else if(NevisConfigurations.faceIdLoginUpperLimit > 0){
                this.setState({
                    faceIdLoginUpperLimit: true
                })
            }else{
                this.setState({
                    faceUpperLimit: false,
                    faceIdLoginUpperLimit: false
                })
            }

        }

        window.goFingerSetting = () => {
            console.log('NevisConfigurations',NevisConfigurations)
            if(
                //Popup for user hit upper limit. Upper limit will reset after 5 mins.
                NevisConfigurations.fingerPrintSetupUpperLimit == 0 ||
                //Face ID exceed the number of time fail login?
                //Upper limit is 5 times for each authentication methods
                NevisConfigurations.fingerPrintLoginUpperLimit == 0 
            ){
                this.setState({
                    faceUpperLimit: true
                    //fingerPrintLoginUpperLimit: true
                })
            }else if(NevisConfigurations.fingerPrintLoginUpperLimit > 0){
                this.setState({
                    fingerPrintLoginUpperLimit: true
                })
            }

        }

        window.homepageSetModal = () => {
            this.setState({
                homepageSetModal: true
            })
        }

        window.loginFaceSetting = () => {
            if(
                //Popup for user hit upper limit. Upper limit will reset after 5 mins.
                NevisConfigurations.faceIdSetupUpperLimit == 0 ||
                NevisConfigurations.fingerPrintSetupUpperLimit == 0
                //Face ID or finger exceed the number of time fail login?
            ){
                this.setState({
                    faceLoginUpperLimit: true
                })
            }else{
                this.setState({
                    faceLoginUpperLimit: false,
                })
            }
        }

        window.invalidCode = () => {
            this.setState({
                invalidCodeModal: true,
            })
        } 

        window.validCode = () => {
            this.setState({
                validCodeModal: true,
            })
        } 


        const { passwordModal, repeatModal, newSettingModal, showFace, showFinger, faceUpperLimit, faceIdLoginUpperLimit, fingerPrintLoginUpperLimit, homepageSetModal, faceLoginUpperLimit, closeSettingModal, alreadySettingModal, pwlVerification, invalidCodeModal, validCodeModal, toastSuccessFlag, } = this.state;
        const { authenticators, modeType, NevisConfigurations } = this.props;
		
        return (
            <>
                <Modal 
                    animationType="none" 
                    transparent={true} 
                    visible={passwordModal} 
                    onRequestClose={this.handleCancel}
                >
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 99,
                            width: width,
                            height: height,
                        }}
                    >
                        <View style={[styles.modalActive]}>
                            <View style={[styles.modalCenter]}>
                                <View style={styles.title}>
                                    <Text style={[styles.modalTitle]}>{translate('是否删除安全设置资料？')}</Text>
                                </View>

                                <Text style={[styles.modalMsg]}>{translate('重新设置密码将会自动删除安全设置的相关资料。若您要再次开启验证方式，则需要重新设定。')}</Text>
                                {
                                    //横向两个 黑底綠字,綠底白字
                                    <View style={styles.btnList}>
                                        <Touch
                                            style={styles.btnBorder}
                                            onPress={this.handleCancel} 
                                        >
                                            <Text style={styles.btnBorderItem}>{translate('取消')}</Text>
                                        </Touch>
                                        <Touch
                                            style={[styles.btnBg]}
                                            onPress={this.handleOk}
                                        >
                                            <Text style={[styles.btnBgItem]}>{translate('确认')}</Text>
                                        </Touch>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal 
                    animationType="none" 
                    transparent={true} 
                    visible={repeatModal} 
                    onRequestClose={this.handleCancel}
                >
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 99,
                            width: width,
                            height: height,
                        }}
                    >
                        <View style={[styles.modalActive]}>
                            <View style={[styles.modalCenter]}>
                                <View style={styles.title}>
                                    <Text style={[styles.modalTitle]}>{translate('检测到重复设置')}</Text>
                                </View>

                                <Text style={[styles.modalMsg]}>{translate('一个账号仅能在一个装置上启用验证方式。若您在此装置启用验证方式，请先在原装置上解除绑定，原装置中的相关数据将会被删除。是否要前往启用？')}</Text>

                                {
                                    //横向两个 黑底綠字,綠底白字
                                    <View style={styles.btnList}>
                                        <Touch
                                            style={styles.btnBorder}
                                            onPress={this.handleCancel} 
                                        >
                                            <Text style={styles.btnBorderItem}>{translate('取消')}</Text>
                                        </Touch>
                                        <Touch
                                            style={[styles.btnBg]}
                                            onPress={this.handleRepeatOk}
                                        >
                                            <Text style={[styles.btnBgItem]}>{translate('确认')}</Text>
                                        </Touch>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal 
                    animationType="none" 
                    transparent={true} 
                    visible={newSettingModal} 
                    onRequestClose={this.handleCancel}
                >
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 99,
                            width: width,
                            height: height,
                        }}
                    >
                        <View style={[styles.modalActive]}>
                            <View style={[styles.modalCenter]}>
                                <View style={styles.title}>
                                    {showFace ?
                                    <Text style={[styles.modalTitle,{ textAlign:'center' }]}>{translate('尚未开通人脸识别权限')}</Text>
                                    :
                                    <Text style={[styles.modalTitle,{ textAlign:'center' }]}>{translate('尚未开通指纹识别权限')}</Text>}
                                </View>

                                {showFace ?
                                <Text style={[styles.modalMsg]}>{translate('请先开通此装置的人脸识别权限')}</Text>
                                :
                                <Text style={[styles.modalMsg]}>{translate('请先开通此装置的指纹识别权限')}</Text>}

                                {
                                    <Touch
                                        style={[styles.btnBg]}
                                        onPress={this.handleCancel}
                                    >
                                        <Text style={[styles.btnBgItem]}>{translate('我知道了')}</Text>
                                    </Touch>
                                }

                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal 
                    animationType="none" 
                    transparent={true} 
                    visible={faceUpperLimit} 
                    onRequestClose={this.handleCancel}
                >
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 99,
                            width: width,
                            height: height,
                        }}
                    >
                        <View style={[styles.modalActive]}>
                            <View style={[styles.modalCenter]}>
                                <View style={styles.title}>
                                    <Text style={[styles.modalTitle,{ textAlign:'center' }]}>{translate('已达验证次数上限')}</Text>
                                </View>

                                <Text style={[styles.modalMsg]}>{translate('验证失败次数已达上限，请稍后再尝试或使用其他验证方式。')}</Text>

                                {
                                    <Touch
                                        style={[styles.btnBg]}
                                        onPress={this.handleCancel}
                                    >
                                        <Text style={[styles.btnBgItem]}>{translate('我知道了')}</Text>
                                    </Touch>
                                }

                            </View>
                        </View>
                    </View>
                </Modal>
                
                <Modal 
                    animationType="none" 
                    transparent={true} 
                    visible={faceIdLoginUpperLimit} 
                    onRequestClose={this.handleCancel}
                >
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 99,
                            width: width,
                            height: height,
                        }}
                    >
                        <View style={[styles.faceIdLoginModal]}>
                            <View style={[styles.faceIdLoginModalCenter]}>
                                <View style={styles.faceIdLogin}>
                                    <Text style={[styles.faceIdLoginModalTitle]}>{translate('Face Not Recognized')}</Text>
                                    <Text style={[styles.faceIdLoginModalMsg]}>{translate('You have X more attempts.')}</Text>
                                </View>

                                {
                                    //豎两个 
                                    <View style={styles.btnVerticalList}>
                                        <Touch
                                           style={styles.faceIdLoginbtnBorder}
                                            onPress={this.handleCancel} 
                                        >
                                            <Text style={styles.faceIdLoginbtnBorderItem}>{translate('Try Face ID Again')}</Text>
                                        </Touch>
                                        <Touch
                                            style={[styles.faceIdLoginbtnBg]}
                                            onPress={this.handleRepeatOk}
                                        >
                                            <Text style={[styles.faceIdLoginbtnBgItem]}>{translate('Cancel')}</Text>
                                        </Touch>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal 
                    animationType="none" 
                    transparent={true} 
                    visible={fingerPrintLoginUpperLimit} 
                    onRequestClose={this.handleCancel}
                >
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 99,
                            width: width,
                            height: height,
                        }}
                    >
                        <View style={[styles.faceIdLoginModal]}>
                            <View style={[styles.faceIdLoginModalCenter]}>
                                <View style={styles.faceIdLogin}>
                                    <Text style={[styles.faceIdLoginModalTitle]}>{translate('Fingerprint Not Recognized')}</Text>
                                    <Text style={[styles.faceIdLoginModalMsg]}>{translate('You have X more attempts.')}</Text>
                                </View>

                                {
                                    //豎两个 
                                    <View style={styles.btnVerticalList}>
                                        <Touch
                                           style={styles.faceIdLoginbtnBorder}
                                            onPress={this.handleCancel} 
                                        >
                                            <Text style={styles.faceIdLoginbtnBorderItem}>{translate('Try Fingerprint Again')}</Text>
                                        </Touch>
                                        <Touch
                                            style={[styles.faceIdLoginbtnBg]}
                                            onPress={this.handleRepeatOk}
                                        >
                                            <Text style={[styles.faceIdLoginbtnBgItem]}>{translate('Cancel')}</Text>
                                        </Touch>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal 
                    animationType="none" 
                    transparent={true} 
                    visible={homepageSetModal} 
                    onRequestClose={this.handleCancel}
                >
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 99,
                            width: width,
                            height: height,
                        }}
                    >
                        <View style={[styles.modalActive]}>
                            <View style={[styles.modalCenter]}>
                                <View style={styles.title}>
                                    <Text style={[styles.modalTitle]}>{translate('免密登录全新上线！')}</Text>
                                </View>

                                <View>
                                    <Image
                                        resizeMode="stretch"
                                        source={
                                            modeType == 'Face' ?
                                            ImgIcon['userIcon'] :
                                            modeType == 'Fingerprint' ?
                                            ImgIcon['fingerPrintIcon'] :
                                            ImgIcon['usrPinIcon']
                                        }
                                        style={{ width: 60, height: 60, marginTop: 20 }}
                                    />
                                </View> 

                                {
                                    modeType == 'Face' ?
                                    <Text style={[styles.modalMsg]}>{translate('在“我的”页面中完成人脸识别设置，以提升账号验证的便捷性与安全性。')}</Text>:
                                    modeType == 'Fingerprint' ?
                                    <Text style={[styles.modalMsg]}>{translate('在“我的”页面中完成指纹识别设置，以提升账号验证的便捷性与安全性。')}</Text>:
                                    <Text style={[styles.modalMsg]}>{translate('在“我的”页面中完成 PIN 码识别设置，以提升账号验证的便捷性与安全性。')}</Text>
                                }
                                
                                <View style={{ marginBottom: 25, marginLeft: -100 }}>
                                    <CheckBox
                                        checkBoxColor={"#c3c3c3"}
                                        checkedCheckBoxColor={"#00E62E"}
                                        onClick={() => {
                                            this.setState({
                                                checkBox1: !this.state.checkBox1,
                                            })
                                        }}
                                        checkedImage={
                                            <Image source={ImgIcon['checkIcon']} style={{width: 20, height: 20}} />
                                          }
                                        unCheckedImage={
                                            <Image source={ImgIcon['uncheckIcon']} style={{width: 20, height: 20}} />
                                        }
                                        isChecked={this.state.checkBox1}
                                        rightTextView={<Text style={{ color: "#fff", marginLeft: 5 }}> {translate('7 天内不再显示')}</Text>}
                                    />
                                </View>

                                {
                                    //横向两个 黑底綠字,綠底白字
                                    <View style={styles.btnList}>
                                        <Touch
                                            style={styles.btnBorder}
                                            onPress={this.handleCancel} 
                                        >
                                            <Text style={styles.btnBorderItem}>{translate('稍后再说')}</Text>
                                        </Touch>
                                        <Touch
                                            style={[styles.btnBg]}
                                            onPress={this.handleRepeatOk}
                                        >
                                            <Text style={[styles.btnBgItem]}>{translate('前往设定')}</Text>
                                        </Touch>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal 
                    animationType="none" 
                    transparent={true} 
                    visible={faceLoginUpperLimit} 
                    onRequestClose={this.handleCancel}
                >
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 99,
                            width: width,
                            height: height,
                        }}
                    >
                        <View style={[styles.modalActive]}>
                            <View style={[styles.modalCenter]}>
                                <View style={styles.title}>
                                    <Text style={[styles.modalTitle,{ textAlign:'center' }]}>{translate('已达验证次数上限')}</Text>
                                </View>

                                <Text style={[styles.modalMsg]}>{translate('验证失败次数已达上限，请使用账号与密码进行登录。')}</Text>

                                {
                                    <Touch
                                        style={[styles.btnBg]}
                                        onPress={this.handleCancel}
                                    >
                                        <Text style={[styles.btnBgItem]}>{translate('我知道了')}</Text>
                                    </Touch>
                                }

                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal 
                    animationType="none" 
                    transparent={true} 
                    visible={closeSettingModal} 
                    onRequestClose={this.handleCancel}
                >
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 99,
                            width: width,
                            height: height,
                        }}
                    >
                        <View style={[styles.modalActive]}>
                            <View style={[styles.modalCenter]}>

                                <View style={styles.title}>
                                    {showFace ?<Text style={[styles.modalTitle]}>{translate('关闭人脸识别')}</Text>:
                                    showFinger?<Text style={[styles.modalTitle]}>{translate('关闭指纹识别')}</Text>:
                                    <Text style={[styles.modalTitle]}>{translate('关闭 PIN 码识别')}</Text>}
                                </View>

                                {showFace ?
                                <Text style={[styles.modalMsg]}>{translate('若您之后要再次开启人脸识别，需要重新设置。是否确定要关闭人脸识别？')}</Text>:
                                showFinger?
                                <Text style={[styles.modalMsg]}>{translate('若您之后要再次开启指纹识别，需要重新设置。是否确定要关闭指纹识别？')}</Text>
                                :
                                <Text style={[styles.modalMsg]}>{translate('若您之后要再次开启 PIN 码识别，需要重新设置。是否确定要关闭 PIN 码识别？')}</Text>}

                                {
                                    //横向两个 黑底綠字,綠底白字
                                    <View style={styles.btnList}>
                                        <Touch
                                            style={styles.btnBorder}
                                            onPress={this.handleCancel} 
                                        >
                                            <Text style={styles.btnBorderItem}>{translate('取消')}</Text>
                                        </Touch>
                                        <Touch
                                            style={[styles.btnBg]}
                                            onPress={this.handleRepeatOk}
                                        >
                                            <Text style={[styles.btnBgItem]}>{translate('确认')}</Text>
                                        </Touch>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal 
                    animationType="none" 
                    transparent={true} 
                    visible={alreadySettingModal} 
                    onRequestClose={this.handleCancel}
                >
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 99,
                            width: width,
                            height: height,
                        }}
                    >
                        <View style={[styles.modalActive]}>
                            <View style={[styles.modalCenter]}>

                                <View style={styles.title}>
                                    <Text style={[styles.modalTitle]}>{translate('已启用其他验证方式')}</Text>
                                </View>

                                {/* 启用 _現在所選的_ 将会自动关闭 __現有的__。若您之后要再次启用__現有的__，需要重新设置。 是否确定要启用___現在所選的__？ */}
                                <Text style={[styles.modalMsg]}>
                                    Kích hoạt  sẽ vô hiệu hóa {modeType} . 
                                    Bạn sẽ cần thực hiện lại quá trình thiết lập nếu muốn kích hoạt {modeType} trong tương lai. 
                                    Bạn có chắc chắn muốn tiếp tục không?
                                </Text>
                                

                                {
                                    //横向两个 黑底綠字,綠底白字
                                    <View style={styles.btnList}>
                                        <Touch
                                            style={styles.btnBorder}
                                            onPress={this.handleCancel} 
                                        >
                                            <Text style={styles.btnBorderItem}>{translate('取消')}</Text>
                                        </Touch>
                                        <Touch
                                            style={[styles.btnBg]}
                                            onPress={this.handleAlreadySet}
                                        >
                                            <Text style={[styles.btnBgItem]}>{translate('确认')}</Text>
                                        </Touch>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal 
                    animationType="none" 
                    transparent={true} 
                    visible={pwlVerification} 
                    onRequestClose={this.handleCancel}
                >
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 99,
                            width: width,
                            height: height,
                        }}
                    >
                        <View style={[styles.modalActive]}>
                            <View style={[styles.modalCenter]}>
                                <View style={styles.pwlTitle}>
                                    <Text style={[styles.pwlTitle]}>{translate('账户信息验证')}</Text>
                                    <Image
                                        resizeMode="stretch"
                                        source={ImgIcon['pwlClose']}
                                        style={{ width: 24, height: 24, position:'absolute', top: -20, right: -50  }}
                                    />
                                </View>

                                <Text style={[styles.pwlMsg]}>{translate('为保障您的账户安全，请完成账户信息验证。')}</Text>

                                {
                                    //豎两个 
                                    <View style={styles.btnVerticalList}>
                                        <Touch
                                            style={styles.Loginsuccess}
                                            onPress={()=>{  }}
                                        >
                                            <View style={styles.pwlRecognize}>
                                                <Image
                                                    resizeMode="stretch"
                                                    source={ImgIcon['LoginFace']}
                                                    // source={ImgIcon['LoginFinger']}
                                                    // source={ImgIcon['LoginPin']}
                                                    style={{ width: 27, height: 24, marginRight: 10 }}
                                                />
                                                <Text style={{ color: '#F5F5F5', fontSize: 14 }}>
                                                    {translate('人脸识别')}
                                                    {/* <Text style={styles.faceIdLoginbtnBorderItem}>{translate('指纹识别')}</Text>
                                                    <Text style={styles.faceIdLoginbtnBorderItem}>{translate('PIN 码识别')}</Text> */}
                                                </Text>
                                            </View>
                                        </Touch>
                                        
                                        <Touch
                                            style={styles.Tologin}
                                            onPress={()=>{  }}
                                        >
                                            <Text style={[styles.pwlGoVerify]}>{translate('手机验证')}</Text>
                                        </Touch>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal 
                    animationType="none" 
                    transparent={true} 
                    visible={invalidCodeModal} 
                    onRequestClose={this.handleCancel}
                >
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 99,
                            width: width,
                            height: height,
                        }}
                    >
                        <View style={[styles.modalActive]}>
                            <View style={[styles.modalCenter]}>
                                <View style={styles.title}>
                                    <Text style={[styles.modalTitle]}>{translate('二维码无效')}</Text>
                                </View>

                                <Text style={[styles.modalMsg]}>{translate('此二维码无效或已失效。请刷新竞博网页上的二维码并重新扫描。')}</Text>

                                {
                                    <Touch
                                        style={[styles.btnBg]}
                                        onPress={this.handleCancel}
                                    >
                                        <Text style={[styles.btnBgItem]}>{translate('确认')}</Text>
                                    </Touch>
                                }

                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal 
                    animationType="none" 
                    transparent={true} 
                    visible={validCodeModal} 
                    onRequestClose={this.handleCancel}
                >
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 99,
                            width: width,
                            height: height,
                        }}
                    >
                        <View style={[styles.modalActive]}>
                            <View style={[styles.modalCenter]}>
                                <View style={styles.title}>
                                    <Text style={[styles.modalTitle]}>{translate('检测到重复登录')}</Text>
                                </View>

                                <Text style={[styles.modalMsg]}>{translate('您已在竞博 APP 上登录，是否确认要登录竞博网页？竞博 APP 将会自动登出。')}</Text>

                                {
                                    //横向两个 黑底綠字,綠底白字
                                    <View style={styles.btnList}>
                                        <Touch
                                            style={styles.btnBorder}
                                            onPress={this.handleCancel} 
                                        >
                                            <Text style={styles.btnBorderItem}>{translate('取消')}</Text>
                                        </Touch>
                                        <Touch
                                            style={[styles.btnBg]}
                                            onPress={this.handleCodeOk}
                                        >
                                            <Text style={[styles.btnBgItem]}>{translate('确认')}</Text>
                                        </Touch>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* 驗證成功 */}
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={toastSuccessFlag} 
                    onRequestClose={() => { }}                
                >
                    <View 
                        style={{ 
                            zIndex: 10000, 
                            width:240, 
                            heigt:54, 
                            borderRadius:5, 
                            flexDirection: 'row', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            padding: 12, 
                            backgroundColor: "#FFFFFF", 
                            position:'absolute', 
                            top:Platform.OS === "android"?350:400, 
                            left:Platform.OS === "android"?120:85,
                        }}
                    >       
                        <Image
                            resizeMode="stretch"
                            source={ImgIcon['icon-check-g']}
                            style={{ width: 25, height: 25 }}                                    
                        />
                        <Text style={{ color: '#1A1A1A', paddingLeft: 5, fontSize: 16 }}>{translate('成功登录竞博网页')}</Text>
                    </View>
                </Modal>

            </>
        )
    }
}



export default NevisModal
