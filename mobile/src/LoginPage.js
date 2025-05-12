import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import { Flex, Modal } from 'antd-mobile-v2';
import { setConfig } from '$Nevis/config';
import translate from '$Nevis/translate';
import { getConfig } from '$Nevis/config';
import liveChat from '$Nevis/styles/imgs/liveChat.png';
import backImageIcon from '$Nevis/styles/imgs/icon-back.webp';
import JBOIconCN from '$Nevis/styles//imgs/JBOLogoCN.png';
import JBOIconTH from '$Nevis/styles//imgs/JBOLogoTH.png';
import JBOIconVN from '$Nevis/styles//imgs/JBOLogoVN.png';
import refreshIcon from '$Nevis/styles/imgs/refreshQR.png';
import dummyQRCode from '$Nevis/styles/imgs/QRTesting.png';
import { checkAffQueryString, Cookie } from '$DATA/Helper';

class _NevisLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openstatus: false,
            defaultQRCodeImg:dummyQRCode,
        };

        this.config = getConfig();
        const { languageType, language, onSuccess,get,post,patch,put  } = getConfig();

        const privateParams = {
            platformType: 'J1',
            languageType: languageType,
            language: language,
            onEnabled: (res = {}) => console.log(res.isNevisEnabled),
            onGetQRCode: (res = {}) => {},
            onError: (res = {}) => {},
            onSuccess: onSuccess,
            onRegister: (res = {}) => {},
            onDownload: (res = {}) => {},
            onBack: (res = {}) => {},
            get: get,
            post: post,
            patch: patch,
            put: put,
        };
        setConfig(privateParams);
    }

    componentDidMount() {
        this.initializeCallApp();
    }

    componentWillUnmount() {
        // Add any necessary cleanup here
    }

    initializeCallApp = () => {
        const { languageType } = getConfig();
        const CallApp = require('callapp-lib');
        let getAffCode = '';

        checkAffQueryString();
        const getAff = Cookie.GetCookieKeyValue('CO_affiliate');
        if (getAff) {
            getAffCode = `?affCode=${getAff}`;
            this.setState({ affcode: getAffCode });
        }

        const callAppOptions = this.getCallAppOptions(languageType, getAffCode);
        this.callApplib = new CallApp(callAppOptions);
    };

    getCallAppOptions = (languageType, getAffCode) => {
        switch (languageType) {
            case 'M1':
                return {
                    scheme: { protocol: 'j1m1' },
                    appstore: `/cn/mobile/Appinstall.html${getAffCode}`,
                    fallback: `/cn/mobile/Appinstall.html${getAffCode}`,
                    timeout: 2000,
                };
            case 'M2':
                return {
                    scheme: { protocol: 'j1m2' },
                    appstore: `/th/mobile/Appinstall.html${getAffCode}`,
                    fallback: `/th/mobile/Appinstall.html${getAffCode}`,
                    timeout: 2000,
                };
            case 'M3':
                return {
                    scheme: { protocol: 'j1m3' },
                    appstore: `/vn/mobile/Appinstall.html${getAffCode}`,
                    fallback: `/vn/mobile/Appinstall.html${getAffCode}`,
                    timeout: 2000,
                };
            default:
                return {
                    scheme: { protocol: 'j1m1' },
                    appstore: `/cn/mobile/Appinstall.html${getAffCode}`,
                    fallback: `/cn/mobile/Appinstall.html${getAffCode}`,
                    timeout: 2000,
                };
        }
    };

    refreshQRCode = () => {
        const { getNevisQRCode } = this.props;
        getNevisQRCode();
    };

    BackHistory = () => {
        if (this.props.historyStat.backToHome) {
            this.props.setHistoryStat({ backToHome: false });
            Router.push('/');
        } else {
            Router.back();
        }
    };

    _Gotopage = (path) => {
        if (path === '/cs') {
            this.setState({ openstatus: true });
        } else {
            Router.push(path);
        }
    };

    GETLiveChat = () => {
        fetchRequest(ApiPort.LiveChat, 'GET', '', false)
            .then((res) => {
                const JBOLive = global.open(
                    'about:blank',
                    '_blank',
                    'toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=650, height=650'
                );
                JBOLive.document.title = '竞博在线客服';
                JBOLive.focus();
                JBOLive.location.href = res.url;
            })
            .catch((error) => {
                console.error(error);
            });
    };

    getJBOIcon = (languageType) => {
        switch (languageType) {
            case 'M2':
                return JBOIconTH;
            case 'M3':
                return JBOIconVN;
            case 'M1':
            default:
                return JBOIconCN;
        }
    };

    openApp = () => {
        this.callApplib.open({ path: '' });
    };

    render() {
        const { saveQRCode, qrCodeImg, isExpired, backToNormalLogin } = this.props;
        const {defaultQRCodeImg} = this.state;
        const { languageType } = getConfig();

        return (
            <div className="LoginSetNevis">
                <Flex className="registered-header">
                    <Flex.Item className="goLogin">
                        <img src={backImageIcon} onClick={backToNormalLogin} />
                    </Flex.Item>
                    <Flex.Item className="title">{translate('登录')}</Flex.Item>
                    <Flex.Item className="goCustomerServiceNevis">
                        <img
                            src={liveChat}
                            onClick={() => {
                                global.globalGtag &&
                                    global.globalGtag('Login', 'Contact CS', 'Login_C_CS', false, [
                                        { customVariableKey: 'Login_C_CS_PageTitle', customVariableValue: 'Login' },
                                    ]);
                                this._Gotopage('/cs');
                            }}
                        />
                    </Flex.Item>
                </Flex>
                <div style={{ minHeight: 667 }}>
                    <div className="LoginlogoNevis">
                        <img src={this.getJBOIcon(languageType)} />
                    </div>

                    <div className="videoTextNevis LoginEye">
                        <div className="NevisTxtF">{translate('请使用竞博 APP 登录页面或是“我的”页面中的二维码扫描器来扫描二维码。')}</div>

                        <div style={{ position: 'relative', marginTop: '0.7rem', marginBottom: '0.3rem' }}>
                            <img style={{ width: '3.2rem', height: '3.2rem', filter: isExpired ? 'grayscale(100%)' : 'none' }} src={qrCodeImg || defaultQRCodeImg} />
                            {isExpired && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        width: '3.2rem',
                                        height: '3.2rem',
                                        backgroundColor: 'rgba(117, 117, 117, 0.7)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        transform: 'translate(-50%, -51%)',
                                    }}
                                >
                                    <img
                                        src={refreshIcon}
                                        alt="Refresh QR Code"
                                        onClick={this.refreshQRCode}
                                        style={{ cursor: 'pointer', opacity: 1, width: '1.6rem', height: '1.6rem' }}
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <span className="DownloadQrCode" onClick={isExpired ? this.refreshQRCode : ()=>{
                              saveQRCode(qrCodeImg)
                            }}>
                                {isExpired ? translate('刷新') : translate('保存')}
                            </span>
                        </div>

                        <div className="DownloadAppTxt">
                            {languageType !== 'M1' && <span>
                                {translate('需要用竞博 APP 来进行扫描。还未安装竞博 APP 吗？')}
                                <span className="GreenTxt" onClick={this.openApp}>
                                    {translate('前往下载')}
                                </span>
                            </span>}
                            {languageType === 'M1' && <span>
                                {translate('需要用竞博 APP 来进行扫描。还未安装竞博 APP 吗？')} <br/>
                                {translate('还未安装竞博 APP 吗？')}
                                <span className="GreenTxt" onClick={this.openApp}>
                                    {translate('前往下载')}
                                </span>
                            </span>}

                        </div>

                        <div className="GreenTxtSecond" onClick={backToNormalLogin}>
                            {translate('账号密码登录')}
                        </div>

                        <div className="language-wrapNevis">
                            <div className="language-line">{translate('选择语言')}</div>
                            <div className="language-box">
                                <a className="curr" href="/cn/mobile/" onClick={() => global.globalGtag && global.globalGtag('China_login')}>
                                    <i className="CNY"></i>中文
                                </a>
                                <a className="jboth" href="/th/mobile/" onClick={() => global.globalGtag && global.globalGtag('th_login')}>
                                    <i className="TH"></i>TH
                                </a>
                                <a href="javascript:void(0);">
                                    <i className="VND" onClick={() => global.globalGtag && global.globalGtag('Vietnam_login')}></i>Việt Nam
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    title={translate('温馨提示：')}
                    transparent
                    maskClosable={false}
                    visible={this.state.openstatus}
                    className="OpenGamemodal"
                    footer={[
                        {
                            text: translate('确定'),
                            onPress: () => {
                                this.GETLiveChat();
                                this.setState({ openstatus: false });
                            },
                        },
                        {
                            text: translate('取消'),
                            onPress: () => this.setState({ openstatus: false }),
                        },
                    ]}
                >
                    <p>{translate('将为您打开一个新的窗口')}</p>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(_NevisLogin);
