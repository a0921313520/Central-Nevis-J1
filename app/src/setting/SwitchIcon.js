import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

class SwitchIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: this.props.value || false, // 默認值從props傳入
    };
  }

  toggleSwitch = () => {
    this.setState(prevState => ({
      isActive: !prevState.isActive
    }), () => {
      // 狀態變更後通知父組件
      if (this.props.onValueChange) {
        this.props.onValueChange(this.state.isActive);
      }
    });
  };

  render() {
    const { isActive } = this.state;

    return (
      <TouchableOpacity onPress={this.toggleSwitch} style={styles.switchContainer}>
        <View style={[styles.switchTrack, isActive ? styles.activeTrack : styles.inactiveTrack]}>
          <View style={[styles.switchThumb, isActive ? styles.activeThumb : styles.inactiveThumb]} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  switchContainer: {
    marginTop: 2,
    width: 43,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchTrack: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    justifyContent: 'center',
  },
  activeTrack: {
    backgroundColor: '#4CAF50', // 開啟時的軌道顏色
  },
  inactiveTrack: {
    backgroundColor: '#999999', // 關閉時的軌道顏色
  },
  switchThumb: {
    width: 21,
    height: 21,
    borderRadius: 13,
    position: 'absolute',
    top: 2,
  },
  activeThumb: {
    backgroundColor: '#fff', // 開啟時的按鈕顏色
    right: 2, // 開啟時的按鈕位置
  },
  inactiveThumb: {
    backgroundColor: '#fff', // 關閉時的按鈕顏色
    left: 2, // 關閉時的按鈕位置
  }
});

export default SwitchIcon;