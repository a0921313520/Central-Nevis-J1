
import { useState } from 'react';

import { BiometricUserVerifierImpl } from '../userInteraction/BiometricUserVerifierImpl';
import { DevicePasscodeUserVerifierImpl } from '../userInteraction/DevicePasscodeUserVerifierImpl';
import { FingerprintUserVerifierImpl } from '../userInteraction/FingerprintUserVerifierImpl';
import { PinEnrollerImpl } from '../userInteraction/PinEnrollerImpl';
import { RegistrationAuthenticatorSelectorImpl } from '../userInteraction/RegistrationAuthenticatorSelectorImpl';
import { ClientProvider } from '../utility/ClientProvider';
import { DeviceInformationUtils } from '../utility/DeviceInformationUtils';


const useAuthCloudApiRegistrationViewModel = () => {

	const [enrollResponse, setEnrollResponse] = useState('');
	const [appLinkUri, setAppLinkUri] = useState('');

	async function confirm(appLinkUris, callback) {
		const client = ClientProvider.getInstance().client;
		const authCloudApiRegistration = client?.operations.authCloudApiRegistration
			.deviceInformation(DeviceInformationUtils.create())
			.authenticatorSelector(new RegistrationAuthenticatorSelectorImpl())
			.pinEnroller(new PinEnrollerImpl())
			.biometricUserVerifier(new BiometricUserVerifierImpl())
			.devicePasscodeUserVerifier(new DevicePasscodeUserVerifierImpl())
			.fingerprintUserVerifier(new FingerprintUserVerifierImpl())
			.onSuccess(() => {
				console.log('Auth Cloud API registration succeeded.');
				// alert('注册成功')
				callback({isSuccess: true})
			})
			.onError((err) => {
				callback(err)
				console.log('注册失败err', err)
			});

		if (enrollResponse) {
			authCloudApiRegistration?.enrollResponse(enrollResponse);
		}
		if (appLinkUris) {
			authCloudApiRegistration?.appLinkUri(appLinkUris);
		}

		await authCloudApiRegistration
			?.execute()
			.catch((err) => { console.log('authCloudApiRegistration_err', err)});
	}

	function cancel() {
		
	}

	return {
		setEnrollResponse,
		setAppLinkUri,
		confirm,
		cancel,
	};
};

export default useAuthCloudApiRegistrationViewModel;
