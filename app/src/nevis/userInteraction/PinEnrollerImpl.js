
import {
	PinEnroller,
	PinEnrollmentContext,
	PinEnrollmentHandler,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { Actions } from "react-native-router-flux";

import { PinMode } from '../model/PinMode';

export class PinEnrollerImpl extends PinEnroller {
	static isActions = true;

	enrollPin(context, handler) {
		console.log(
			context.lastRecoverableError
				? 'PIN enrollment failed. Please try again.'
				: 'Please start PIN enrollment.'
		);
		if(window.ActivePin) {
			window.ActivePin = false
			Actions.PinCode({
				mode: PinMode.enrollment,
				handler: handler,
				lastRecoverableError: context.lastRecoverableError,
			})
		}
	}

	onValidCredentialsProvided() {
		console.log('Valid PIN credentials provided.');
	}
}
