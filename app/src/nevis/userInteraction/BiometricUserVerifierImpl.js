import {
	BiometricPromptOptions,
	BiometricUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import translate from '$Nevis/translate'


export class BiometricUserVerifierImpl extends BiometricUserVerifier {
	async verifyBiometric(
		_context,
		handler
	){
		console.log('Please start biometric user verification.');
		await handler
			.listenForOsCredentials(
				
				BiometricPromptOptions.create(
					translate('需要验证'),
					translate('取消'),
					''
				)
			)
			.catch((err) => { console.log('BiometricUserVerifierImplerr', err) });
	}

	onValidCredentialsProvided() {
		console.log('Valid biometric credentials provided.');
	}
}
