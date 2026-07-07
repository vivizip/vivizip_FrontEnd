import React, { Component } from "react";
import { View } from "react-native";
import KakaoLoginButton from "../../features/auth/components/KakaoLoginButton";

export default class LoginPage extends Component {
  render() {
    return (
      <View>
        <KakaoLoginButton />
      </View>
    );
  }
}
