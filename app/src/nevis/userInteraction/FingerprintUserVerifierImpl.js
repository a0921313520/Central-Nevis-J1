import {
	FingerprintUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import translate from '$Nevis/translate'

let times = 0
export class FingerprintUserVerifierImpl extends FingerprintUserVerifier {
	async verifyFingerprint(
		context,
		handler
	){
		if(context.lastRecoverableError) {
			times += 1
			window.onModal('sensorModalMsg', translate('无法识别'))
			if(times >= 5) {
				//锁定
			}
			console.log(`Fingerprint user verification failed. Please try again. Error: ${context.lastRecoverableError.description}`)
		} else {
			window.onModal('sensorModalMsg', '')
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
