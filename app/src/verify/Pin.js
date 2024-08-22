import React from "react";
import { View, Text, Dimensions } from "react-native";
import translate from '$Nevis/translate'
import VerificationCodeInput from "./VerificationCodeInput";


class Pin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errCode: 0,
            confirm: false
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
		
    }

    checked(code) {
        if (code.length == 6) {
          this.setState({  verificationCode: code, confirm: true });
        } else {
          this.setState({ issubmitBtn: false, confirm: false });
        }
    }

    render() {
		const { errCode, confirm } = this.state;

        return (
            <View style={{ padding: 18, }}>
                {!confirm? 
                <View style={{ marginTop: 20, marginBottom: 20 }}>
				    <Text style={{ fontSize: 16, color:'#F5F5F5', textAlign:'center' }}>{translate("请输入 PIN 码")}</Text>
                </View>:
                <View>
                    <Text style={{ fontSize: 16, color:'#F5F5F5', textAlign:'center' }}>{translate("请确认 PIN 码")}</Text>
                </View>}

                <VerificationCodeInput
                    key={errCode}
                    inputSize={6} //默认value是 6
                    TextInputChange={(value) => {
                        this.checked(value);
                    }}
                />
            </View>
        )
    }
}



export default Pin
