import {
	BiometricPromptOptions,
	BiometricUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';


export class BiometricUserVerifierImpl extends BiometricUserVerifier {
	async verifyBiometric(
		_context,
		handler
	){
		console.log('Please start biometric user verification.');
		await handler
			.listenForOsCredentials(
				BiometricPromptOptions.create(
					('biometric.popup.title'),
					('biometric.popup.cancelButtonTitle'),
					('biometric.popup.description')
				)
			)
			.catch((err) => { console.log('BiometricUserVerifierImplerr', err) });
	}

	onValidCredentialsProvided() {
		console.log('Valid biometric credentials provided.');
	}
}
