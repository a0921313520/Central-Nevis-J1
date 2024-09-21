import {
	PinUserVerificationContext,
	PinUserVerificationHandler,
	PinUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import { Actions } from "react-native-router-flux";

import { PinMode } from '../model/PinMode';

export class PinUserVerifierImpl extends PinUserVerifier {

	onValidCredentialsProvided() {
		console.log('Valid pin credentials provided.');
	}

	verifyPin(
		context,
		handler
	) {
		console.log(
			context.lastRecoverableError
				? 'PIN user verification failed. Please try again.'
				: 'Please start PIN user verification.'
		);
		if(window.ActivePin && context.lastRecoverableError) {
			Actions.refresh({ lastRecoverableError: context.lastRecoverableError })
		}
		if(!window.ActivePin) {
			Actions.PinCode({
				mode: PinMode.verification,
				handler: handler,
				lastRecoverableError: context.lastRecoverableError,
				authenticatorProtectionStatus: context.authenticatorProtectionStatus,
			})
		}
		
		return Promise.resolve();
	}
}
