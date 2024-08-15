import React from "react";
import { View, Text } from "react-native";
import styles from '$StyleSheets/index'
import translate from '$Nevis/translate'
import { getConfig } from '$Nevis/config'


class Nevis extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bannerShow: true,
            loading: true,
        }
        this.config = getConfig()
    }

    componentDidMount() {
        const { fromType } = this.props
        this.getMemberAuthenticators()
    }

    componentWillUnmount() {
		
    }
    //检查是否设置无密码登录，
    //有authenticatorId表示已经设置过
    getMemberAuthenticators = () => {

    }


    render() {

        const { fromType } = this.props
		
        return (
            <View style={styles.nevis}>
				<Text>{translate('QR code登录。')}</Text>
               <TipsModal />
            </View>
        )
    }
}



export default Nevis
