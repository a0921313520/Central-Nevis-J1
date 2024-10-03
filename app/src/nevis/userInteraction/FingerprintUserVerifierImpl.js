import {
	FingerprintUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';

let times = 0
export class FingerprintUserVerifierImpl extends FingerprintUserVerifier {
	async verifyFingerprint(
		context,
		handler
	){
		if(context.lastRecoverableError) {
			times += 1
			if(times >= 5) {
				//锁定
			}
			console.log(`Fingerprint user verification failed. Please try again. Error: ${context.lastRecoverableError.description}`)
		} else {
			console.log('Please start fingerprint user verification.')
		}
		await handler
			.listenForOsCredentials()
			.catch((err) => { console.log('FingerprintUserVerifierImplerr', err)});
	}

	onValidCredentialsProvided() {
		console.log('Valid fingerprint credentials provided.');
	}
}
