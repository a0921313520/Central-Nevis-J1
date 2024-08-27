import React from 'react';
import translate from '$Nevis/translate';
import { ApiPort } from './Api';
import { getConfig } from '$Nevis/config';
import LoginPage from './LoginPage';
import { Toast, Modal } from 'antd-mobile-v2';
import successCN from '$Nevis/styles/M1/imgs/icon_success.png';
import successTH from '$Nevis/styles/M2/imgs/icon_success.png';
import successVN from '$Nevis/styles/M3/imgs/icon_success.png';
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
    }

    getNevisConfigurations = () => {
        const { get, onEnabled } = getConfig();
        Toast.loading('', 200);

        get(ApiPort.NevisConfigurations)
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
        Toast.loading('', 200);

        get(ApiPort.NevisQRCode)
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
        const {languageType } = getConfig();

         // Trigger image download
         const link = document.createElement('a');
         link.href = qrCodeImg; // The data URL of the QR code image
         link.download = 'QRCode.png'; // Default name for the downloaded image
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link); // Remove the link after the download

        const alert = () => (
            <div
                style={{
                    borderRadius: '3px',
                    fontSize: '13px',
                    color: 'black',
                    backgroundColor: 'white',
                    width: '100%',
                    paddingTop: '0.1rem',
                    paddingBottom: '0.2rem',
                    paddingLeft: '0.1rem',
                    paddingRight: '0.1rem',
                }}
            >
                <p>
                    <img
                        style={{ bottom: '-5px', position: 'relative', paddingRight: '10px' }}
                        src={this.getSuccessImage(languageType)}
                        alt="error"
                    />
                    {translate('保存成功')}
                </p>
            </div>
        );
        Toast.info(alert(), 3);
    };

    verifyLoginSession = (statusToken) => {
        const { isExpired } = this.state;
        const { post } = getConfig();

        post(ApiPort.VerifyLoginSession + `statusToken=${statusToken}&`)
            .then((res) => {
                if (res?.isSuccess) {
                    const data = res.result;

                    localStorage.setItem('memberToken', JSON.stringify(data.tokenType + ' ' + data.accessToken));
                    localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));

                    fetchRequest(ApiPort.Member, 'GET', '', false)
                        .then((memberData) => {
                            localStorage.setItem('memberInfo', JSON.stringify(memberData.result));
                            Router.push('/');
                        })
                        .catch((error) => {
                            console.log('Error fetching member info:', error);
                        });
                } else {
                    if (!isExpired) this.verifyLoginSession(statusToken);
                }
            })
            .catch((error) => {
                console.log('Error verifying login session:', error);
            });
    };

    backToLogin = () => {
        const { backToNormalLogin } = this.props;

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
