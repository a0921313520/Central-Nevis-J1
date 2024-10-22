
import {
	PinChanger,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { Actions } from "react-native-router-flux";

import { PinMode } from '../model/PinMode';

export class PinChangerImpl extends PinChanger {
	static isActions = true;

	changePin(context, handler) {
		console.log(
			context.lastRecoverableError
				? 'PIN credentialChange failed. Please try again.'
				: 'Please start PIN credentialChange.'
		);
		if(!window.ActivePin) {
			Actions.PinCode({
				title: window.PinCodeTitle,
				mode: PinMode.credentialChange,
				handler: handler,
				lastRecoverableError: context.lastRecoverableError,
			})
		}
	}

	onValidCredentialsProvided() {
		console.log('Valid PIN credentials provided.');
	}
}
