import React from 'react'
import translate from '$Nevis/translate'
import { ApiLink } from './Api'
import { getConfig } from '$Nevis/config'
import { Modal, message } from 'antd';
import Router from "next/router";
import refreshIcon from '$Nevis/styles/M3/imgs/refreshIcon.png';
class Nevis extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loginVerified: false,
            showLoginQRFail: false,
            hostEnd: '',
            
        }
        this.config = getConfig();
    }

    componentDidMount() {
        this.getNevisConfigurations()

        if (typeof window !== 'undefined') {
            const hostEnd = `${window.location.protocol}//${window.location.host}/`;
            this.setState({ hostEnd });
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerInterval);
        clearInterval(this.refresh);
    }
    //是否开启nevis qrcode
    getNevisConfigurations = () => {
        const { get, onEnabled } = getConfig()
        get(ApiLink.NevisConfigurations)
            .then((res) => {
                onEnabled(res?.result || {})
            })
            .catch(() => {
                onEnabled()
            })
    }

    getLoginQR = () => {
        const { get } = getConfig()
        get(ApiLink.QRLoginSession)
        .then((res) => {
            if(res.isSuccess) {
                this.setState({
                    showLoginQR: true,
                    loginQR: res.result?.qrCode?.dataUri,
                    countdown: 120,
                    statusToken: res.result?.statusToken
                }, () => {
                    this.props.closeNormalLogin();
                    this.startCountdown();
                    this.verifyLoginSession(res.result?.statusToken);
                })
            } else {
                this.setState({
                    showLoginQRFail: true
                })
            }
        })
        .catch(() => {
            this.setState({
                showLoginQRFail: true
            })
        })
    }

    verifyLoginSession = (token) => {
        const { post, getApi } = getConfig()
        const {hostEnd} = this.state;
        let loading = false;
        if (!loading) {
            this.refresh = setInterval(() => { 
                loading = true
                if (this.state.loginVerified || this.state.countdown == 0) {
                    clearInterval(this.refresh);
                }
                post(ApiLink.VerifyLoginSession + `statusToken=${token}&hostName=${hostEnd}&sideId=1`)
                .then((res) => {
                    loading = false
                    if(res.isSuccess) {
                        clearInterval(this.refresh);
                        localStorage.setItem('access_token',JSON.stringify(res.result?.tokenType + ' ' + res.result?.accessToken));
                        localStorage.setItem('refresh_token', JSON.stringify(res.result?.refreshToken));
                        sessionStorage.setItem('isLogin', true);
                        getApi(ApiLink.Member).then((data) => {
                            localStorage.setItem('UserName', data.result?.memberInfo?.Username);
                            localStorage.setItem('memberInfoDB', JSON.stringify(data.result));
                            this.props.setLoginStatus();
                            this.setState({
                                loginVerified: true
                            })
                            window.location.reload();
                        }).catch(() => {
                
                        })
                    }
                })
                .catch(() => {
                })
    
            }, 3000);
        }


    }

    startCountdown = () => {
        this.timerInterval = setInterval(() => {
            this.setState((prevState) => {
                if (prevState.countdown <= 1) {
                    clearInterval(this.timerInterval);
                    return { countdown: 0 };
                }
                return { countdown: prevState.countdown - 1 };
            });
        }, 1000);
    };

    downloadQR = () => {
        var a = document.createElement('a');
        a.href = this.state.loginQR;
        a.download = "loginQRCode.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        message.success(translate('保存成功'));
    }

    goToDownload = () => {
        const { languageType } = getConfig();
        switch (languageType) {
            case 'M1':
                return Router.push('/Download')
            case 'M2':
                return Router.push('/Download')
            case 'M3':
                return Router.push('/ung-dung')
        }
    }

    render() {
        const {loginQR, countdown, showLoginQR, showLoginQRFail} = this.state;
        return (
            <>
                <div className='nevis' onClick={() => {this.getLoginQR();}}>
                    <div className='loginQRIcon'></div>
                    <div className='loginQRText'></div>
                </div>
                <Modal
                    title={translate('登录')}
                    //登入
                    visible={showLoginQR}
                    // onOk={this.handleOk}
                    onCancel={()=> {clearInterval(this.timerInterval); clearInterval(this.refresh); this.setState({showLoginQR: false})}}
                    footer={false}
                    width={'520px'}
                    zIndex={2000}
                    className="GoLoginshowopen publicStyle loginQRCOntainer"
                    maskClosable={false}
                    keyboard={false}
                >
                    <>
                        <div className='nevis' onClick={() => {this.setState({showLoginQR: false}); clearInterval(this.refresh); clearInterval(this.timerInterval); this.props.openNormalLogin();}}>
                            <div className='loginNormal'></div>
                        </div>
                        <div className='loginQRContent'>
                            <div>
                                {translate('登录内容')}
                            </div>
                            <div style={{margin: 'auto', width: '150px', opacity: countdown <= 0 ? '0.2' : ''}}>
                                <img src={loginQR} width={'150px'} style={{cursor: 'pointer'}}/>
                            </div>
                            {countdown <= 0 &&
                                <img className="refreshIcon" onClick={() => {this.getLoginQR()}} src={refreshIcon.src}/>
                            }
                            {countdown <= 0 ?
                                <div className='refreshBtn' onClick={()=> this.getLoginQR()}>
                                    {translate('刷新')}
                                </div>
                            : 
                                <div className='saveBtn' onClick={()=> this.downloadQR()}>
                                    {translate('保存')}
                                </div>
                            }
                            <div>
                                {translate('登录内容2')}<br/>
                                {translate('登录内容3')}
                                <span onClick={() => {this.goToDownload();}}> {translate('前往下载')}</span>
                            </div>
                        </div>
                        <div className='backToRegister' onClick={()=> {this.setState({showLoginQR: false}); this.props.openRegister(); this.props.closeNormalLogin();}}>
                            {translate('立即注册')}
                        </div>
                    </>
                </Modal>
                <Modal
                    visible={showLoginQRFail}
                    footer={false}
                    width={'300px'}
                    maskClosable={false}
                    zIndex={2500}
                    closable={false}
                    className='showLoginQRFail'
                >
                    <div className='title'>{translate('系统错误')}</div>
                    <div className='content'>{translate('出现错误')}</div>
                    <div className='button' onClick={()=> {this.setState({showLoginQRFail: false})}}>{translate('我知道了')}</div>
                </Modal>
            </>

        )
    }
}



export default Nevis
