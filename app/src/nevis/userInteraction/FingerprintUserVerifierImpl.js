import {
	FingerprintUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';


export class FingerprintUserVerifierImpl extends FingerprintUserVerifier {
	async verifyFingerprint(
		context,
		handler
	){
		console.log(
			context.lastRecoverableError
				? `Fingerprint user verification failed. Please try again. Error: ${context.lastRecoverableError.description}`
				: 'Please start fingerprint user verification.'
		);

		await handler
			.listenForOsCredentials()
			.catch((err) => { console.log('FingerprintUserVerifierImplerr', err)});
	}

	onValidCredentialsProvided() {
		console.log('Valid fingerprint credentials provided.');
	}
}
