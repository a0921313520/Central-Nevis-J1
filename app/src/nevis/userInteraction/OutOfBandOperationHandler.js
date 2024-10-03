
import { AccountSelectorImpl } from './AccountSelectorImpl';
import { AuthenticationAuthenticatorSelectorImpl } from './AuthenticationAuthenticatorSelectorImpl';
import { BiometricUserVerifierImpl } from './BiometricUserVerifierImpl';
import { DevicePasscodeUserVerifierImpl } from './DevicePasscodeUserVerifierImpl';
import { FingerprintUserVerifierImpl } from './FingerprintUserVerifierImpl';
import { PinEnrollerImpl } from './PinEnrollerImpl';
import { PinUserVerifierImpl } from './PinUserVerifierImpl';
import { RegistrationAuthenticatorSelectorImpl } from './RegistrationAuthenticatorSelectorImpl';
import { AuthorizationUtils } from '../utility/AuthorizationUtils';
import { ClientProvider } from '../utility/ClientProvider';
import { DeviceInformationUtils } from '../utility/DeviceInformationUtils';
import { Actions } from 'react-native-router-flux';

async function handleRegistration(registration) {
	await registration
		.deviceInformation(DeviceInformationUtils.create())
		.authenticatorSelector(new RegistrationAuthenticatorSelectorImpl())
		.pinEnroller(new PinEnrollerImpl())
		.biometricUserVerifier(new BiometricUserVerifierImpl())
		.devicePasscodeUserVerifier(new DevicePasscodeUserVerifierImpl())
		.fingerprintUserVerifier(new FingerprintUserVerifierImpl())
		.onSuccess(() => {
			console.log('Out-of-Band registration succeeded.');

		})
		.onError((onError) => { console.log('handleRegistrationonError', onError)})
		.execute();
}

async function handleAuthentication(authentication, callback) {
	await authentication
		.accountSelector(new AccountSelectorImpl())
		.authenticatorSelector(new AuthenticationAuthenticatorSelectorImpl())
		.pinUserVerifier(new PinUserVerifierImpl())
		.biometricUserVerifier(new BiometricUserVerifierImpl())
		.devicePasscodeUserVerifier(new DevicePasscodeUserVerifierImpl())
		.fingerprintUserVerifier(new FingerprintUserVerifierImpl())
		.onSuccess((authorizationProvider) => {
			AuthorizationUtils.printAuthorizationInfo(authorizationProvider);
			if(window.ActivePin) {
				//关闭Pin输入框
				Actions.pop()
			}
			NToast.removeAll()
			window.onModal('sensorModal', false)
			callback({isSuccess: true})
			console.log('登录验证成功')
		})
		.onError((err) => {
			if(window.ActivePin) {
				//关闭Pin输入框
				Actions.pop()
			}
			NToast.removeAll()
			window.onModal('sensorModal', false)
			callback(err)
			console.log('登录验证失败err', err)
		})
		.execute();
}

async function handleOutOfBandPayload(
	payload,
	client,
	callback,
) {
	client?.operations.outOfBandOperation
		.payload(payload)
		.onRegistration(async (registration) => {
			await handleRegistration(registration).catch((err) => {
				console.log('onRegistrationerr', err)
			});
		})
		.onAuthentication(async (authentication) => {
			console.log('登录验证')
			await handleAuthentication(authentication, callback).catch((err) => {
				console.log('onAuthenticationerr', err)
			});
		})
		.onError((err) => {
			callback(err)
			console.log('errerrerr-outOfBandOperation', err)
		})
		.execute()
		.catch((err) => { console.log('handleOutOfBandPayloaderr', err)});
}

export async function decodePayload(base64UrlEncoded, callback) {
	if (base64UrlEncoded === '') {
		return '二维码空'
	}

	const client = ClientProvider.getInstance().client;
	await client?.operations.outOfBandPayloadDecode
		.base64UrlEncoded(base64UrlEncoded)
		.onSuccess(async (payload) => {
			if (!payload) {
				return 'No payload is returned by the SDK.'
			}

			console.log('Out-of-Band payload decode succeeded.');
			await handleOutOfBandPayload(payload, client, callback);
		})
		.onError((onError) => {
			callback(onError)
			console.log('decodePayloadonError', onError)
		})
		.execute();
}
