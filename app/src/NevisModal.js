import React from "react";
import { View, Text, Modal } from "react-native";
import styles from '$NevisStyles/NevisModal'
import translate from '$Nevis/translate'

//全部提示Modal，用window方法调用

class NevisModal extends React.Component {
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

        window.onModal = () => {}
		
        return (
            <View>
				{/* <Modal></Modal> */}
            </View>
        )
    }
}



export default NevisModal
