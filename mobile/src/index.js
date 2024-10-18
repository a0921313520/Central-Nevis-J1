import React from 'react';
import translate from '$Nevis/translate';
import { ApiLink } from './Api';
import { getConfig } from '$Nevis/config';
import LoginPage from './LoginPage';
import { Toast, Modal } from 'antd-mobile-v2';
import successCN from '$Nevis/styles/M1/imgs/icon_success.png';
import successTH from '$Nevis/styles/M2/imgs/icon_success.png';
import successVN from '$Nevis/styles/M3/imgs/icon_success.png';
import Router from 'next/router'
class Nevis extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showRefreshToast: false,
            isExpired: false, // To track if QR code is expired
            timer: 120, // 120 seconds countdown
            qrCodeImg: '', // QR code image
            enabledNevis: false,
            showUnableModal: false,
        };

        const { showNevis = false } = props;
        if (showNevis) {
            this.getNevisConfigurations();
        }

        this.config = getConfig();
    }

    componentDidUpdate(prevProps) {
        if (this.props.showNevis !== prevProps.showNevis && this.props.showNevis) {
            this.getNevisConfigurations();
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerInterval); // Clean up the timer interval on unmount
        clearInterval(this.verificationInterval); // Clear the verification interval
    }

    getNevisConfigurations = () => {
        const { get, onEnabled } = getConfig();
        Toast.loading('', 200);

        get(ApiLink.NevisConfigurations)
            .then((res) => {
                Toast.hide();
                onEnabled(res?.result || {});
                const isEnabled = res?.result?.isNevisEnabled;
                this.setState({ enabledNevis: isEnabled });
                if (isEnabled) {
                    this.getNevisQRCode();
                } else {
                    this.setState({ showUnableModal: true });
                }
            })
            .catch(() => {
                Toast.hide();
                onEnabled();
            });
    };

    closeUnableModal = () => {
        this.setState({ showUnableModal: false });
    };

    getNevisQRCode = () => {
        const { get, onGetQRCode, onSuccess } = getConfig();

        // Clear existing intervals before starting new QR code session
        if (this.verificationInterval) {
            clearInterval(this.verificationInterval);
        }

        Toast.loading('', 200);

        get(ApiLink.NevisQRCode)
            .then((res) => {
                Toast.hide();
                if (res?.result?.statusToken) {
                    this.setState({
                        qrCodeImg: res?.result?.qrCode?.dataUri,
                        timer: 120,
                        isExpired: false,
                    });
                    this.startTimer();
                    this.verifyLoginSession(res?.result?.statusToken);
                }
                onGetQRCode(res?.result || {});
            })
            .catch(() => {
                Toast.hide();
            });
    };

    startTimer = () => {
        this.timerInterval = setInterval(() => {
            this.setState((prevState) => {
                if (prevState.timer <= 1) {
                    clearInterval(this.timerInterval);
                    clearInterval(this.verificationInterval);
                    return { isExpired: true, timer: 0 };
                }
                return { timer: prevState.timer - 1 };
            });
        }, 1000);
    };

    getSuccessImage = (languageType) => {
        switch (languageType) {
            case 'M2':
                return successTH;
            case 'M3':
                return successVN;
            case 'M1':
            default:
                return successCN;
        }
    };

    saveQRCodeShowSuccess = (qrCodeImg) => {
        const { languageType } = getConfig();
    
        // Inject custom styles for the Toast
        const customStyles = `
            .am-toast-notice-content .am-toast-text {
                border: none !important;
                box-shadow: none !important;
                background-color: white !important;
                border-radius: 4px !important;
                min-width: ${languageType === 'M3' ? '2.7rem !important':'2.2rem !important'}
                line-height: normal !important;
                max-height: ${languageType === 'M2' ? '1rem !important':'3rem !important'};
                color: black !important;
                height:  ${languageType === 'M1' ? '44px !important':'0.65rem !important'};
                font-size: ${languageType === 'M1' ? '16px !important':'13px !important'};
                padding-top: 0.05rem;
                padding-left:${languageType === 'M1' ? '10px !important':''};
                padding-right:  ${languageType === 'M1' ? '10px !important':''};
            }
        `;
        const styleTag = document.createElement('style');
        styleTag.id = 'custom-toast-styles'; 
        styleTag.innerHTML = customStyles;
        document.head.appendChild(styleTag);
    
        // Trigger image download
        const link = document.createElement('a');
        link.href = qrCodeImg;
        link.download = 'QRCode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        const alert = () => (
            <div>
                <p style={{paddingTop: languageType === 'M1' ? '6px':''}}>
                    <img
                        style={{ bottom: '-5px', position: 'relative', paddingRight: '10px' }}
                        src={this.getSuccessImage(languageType)}
                        alt="error"
                    />
                    {translate('保存成功')}
                </p>
            </div>
        );
        
        const duration = 3;
        Toast.info(alert(), duration);
    
        // Cleanup the injected styles after the Toast duration
        setTimeout(() => {
            const existingStyleTag = document.getElementById('custom-toast-styles');
            if (existingStyleTag) {
                existingStyleTag.remove();
            }
        }, duration * 1000); 
    };
    

    verifyLoginSession = (statusToken) => {
        const { post } = getConfig();

        // Clear any existing interval before starting a new one
        if (this.verificationInterval) {
            clearInterval(this.verificationInterval);
        }
        
        this.verificationInterval = setInterval(() => {
            const { isExpired } = this.state;  // Get the isExpired state
    
            // Stop if session is expired
            if (isExpired) {
                clearInterval(interval);
                console.log('Session expired, stopping verification.');
                return;
            }
    
            post(ApiLink.VerifyLoginSession + `statusToken=${statusToken}&`)
                .then((res) => {
                    if (res?.isSuccess) {
                        clearInterval(this.verificationInterval);  // Clear the interval after successful
                        const data = res.result;
    
                        // Store tokens and member info on success
                        ApiPort.Token = data.tokenType + ' ' + data.accessToken; // 寫入用戶token  token要帶Bearer
                        localStorage.setItem('memberToken', JSON.stringify(data.tokenType + ' ' + data.accessToken));
                        localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
                        sessionStorage.setItem("loginStatus", "1");
                        if (ApiPort.Token) {
                            fetchRequest(ApiLink.Member, 'GET', '', false)
                            .then((memberData) => {
                                localStorage.setItem('memberInfo', JSON.stringify(memberData.result));
                                localStorage.setItem('username', JSON.stringify(memberData.result.memberInfo.Username))
                                Router.push('/');
                                clearInterval(this.verificationInterval);  // Clear the interval after successful login
                            })
                            .catch((error) => {
                                console.log('Error fetching member info:', error);
                                clearInterval(this.verificationInterval);  // Stop the interval in case of error
                            });
                        }
                    } else {
                        console.log('Login session verification failed, retrying...');
                        // Continue retrying until `isExpired` becomes true or session is successful
                    }
                })
                .catch((error) => {
                    console.log('Error verifying login session:', error);
                   // clearInterval(this.verificationInterval);   // Clear interval in case of a request error
                });
        }, 3000);  // Call the API every 3 seconds
    };
    

    backToLogin = () => {
        const { backToNormalLogin } = this.props;

        // Clear intervals when going back to normal login
        if (this.verificationInterval) {
            clearInterval(this.verificationInterval);
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.setState({
            qrCodeImg: '',
            timer: 120,
            isExpired: true,
        }, () => {
            backToNormalLogin();
        });
    };

    render() {
        const { qrCodeImg, isExpired, enabledNevis, showUnableModal } = this.state;

        return (
            <>
                <Modal
                    visible={showUnableModal}
                    transparent
                    className="dummyBankModal"
                    style={{ width: '70%' }}
                >
                    <div style={{ fontSize: '0.28rem' }}>
                        <div style={{ color: '#FFFFFF', margin: '0.25rem 0rem' }}>
                            {translate('系统错误')}
                        </div>
                        <div style={{ color: '#F5F5F5', fontSize: '0.26rem', marginTop: '0.4rem', marginBottom: '0.4rem' }}>
                            {translate('出现错误，请稍后再尝试。')}
                        </div>
                        <div
                            className="dummyBankBtn"
                            style={{ width: '60%', marginLeft: '20%', marginBottom: '0.25rem' }}
                            onClick={this.closeUnableModal}
                        >
                            {translate('我知道了')}
                        </div>
                    </div>
                </Modal>

                {enabledNevis && (
                    <LoginPage
                        saveQRCode={this.saveQRCodeShowSuccess}
                        getNevisQRCode={this.getNevisQRCode}
                        qrCodeImg={qrCodeImg}
                        isExpired={isExpired}
                        backToNormalLogin={this.backToLogin}
                    />
                )}
            </>
        );
    }
}

export default Nevis;
