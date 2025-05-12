import { getConfig } from '$Nevis/config'
const images = {
    CN: {
        newWelcome: require('./newWelcomeCN.png'),
    },
    TH: {
        newWelcome: require('./newWelcomeTH.png'),
    },
    VN: {
        newWelcome: require('./newWelcomeVN.png'),
    }
};
//有差异图片
export const ImageMap = (img = '') => {
    const { language = 'CN' } = getConfig()
    return img && images[language][img] || ''
}


const ImgIcon = {
    'testIcon': require('./test-icon.png'),
    'scanIcon': require('./QRCodeScanner.png'),
    'faceIcon': require('./faceIcon.png'),
    'faceIcon1': require('./faceIcon1.png'),
    'fingerIcon': require('./fingerIcon.png'),
    'fingerIcon1': require('./fingerIcon1.png'),
    'pinIcon': require('./pinIcon.png'),
    'userIcon': require('./userIcon.png'),
    'successIcon': require('./successIcon.png'),
    'fingerPrintIcon': require('./fingerPrintIcon.png'),
    'usrPinIcon': require('./usrPinIcon.png'),
    'checkIcon': require('./checkIcon.png'),
    'uncheckIcon': require('./uncheckIcon.png'),
    'csIcon': require('./csIcon.png'),
    'newBG': require('./newBG.png'),
    'LoginFace': require('./LoginFace.png'),
    'LoginFinger': require('./LoginFinger.png'),
    'LoginPin': require('./LoginPin.png'),
    'pwlClose': require('./pwlClose.png'),
    'photoAlbum': require('./photoAlbum.png'),
    'icon-check-g': require('./icon-check-g.png'),
    'icon-back': require('./icon-back.png'),
}
export default ImgIcon

