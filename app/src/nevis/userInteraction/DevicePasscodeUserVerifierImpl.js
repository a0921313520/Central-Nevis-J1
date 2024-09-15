import {
	DevicePasscodePromptOptions,
	DevicePasscodeUserVerifier,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';


export class DevicePasscodeUserVerifierImpl extends DevicePasscodeUserVerifier {
	async verifyDevicePasscode(
		_context,
		handler
	){
		console.log('Please start device passcode user verification.');
		await handler
			.listenForOsCredentials(
				DevicePasscodePromptOptions.create(
					('devicePasscode.popup.title'),
					('devicePasscode.popup.description')
				)
			)
			.catch((err) => {console.log('DevicePasscodeUserVerifierImplerr', err)});
	}

	onValidCredentialsProvided() {
		console.log('Valid device passcode credentials provided.');
	}
}
