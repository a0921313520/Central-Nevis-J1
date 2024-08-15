import React from 'react'
import translate from '$Nevis/translate'
import { ApiPort } from './Api'
import { getConfig } from '$Nevis/config'


class Nevis extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
        this.config = getConfig()
    }

    componentDidMount() {
        this.getNevisConfigurations()
    }

    componentWillUnmount() {

    }
    //是否开启nevis qrcode
    getNevisConfigurations = () => {
        const { get, onEnabled } = getConfig()
        get(ApiPort.NevisConfigurations)
            .then((res) => {
                onEnabled(res?.result || {})
            })
            .catch(() => {
                onEnabled()
            })
    }

    render() {

        return (
            <div className='nevis'>
                <div className='test-icon qr-code'>{translate('QR code登录。')}</div>
            </div>
        )
    }
}



export default Nevis
