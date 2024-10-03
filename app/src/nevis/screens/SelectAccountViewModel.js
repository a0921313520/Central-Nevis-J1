
import { Actions } from 'react-native-router-flux';
import { AuthenticationAuthenticatorSelectorImpl } from '../userInteraction/AuthenticationAuthenticatorSelectorImpl';
import { BiometricUserVerifierImpl } from '../userInteraction/BiometricUserVerifierImpl';
import { DevicePasscodeUserVerifierImpl } from '../userInteraction/DevicePasscodeUserVerifierImpl';
import { FingerprintUserVerifierImpl } from '../userInteraction/FingerprintUserVerifierImpl';
import { PinUserVerifierImpl } from '../userInteraction/PinUserVerifierImpl';
import { AuthorizationUtils } from '../utility/AuthorizationUtils';
import { ClientProvider } from '../utility/ClientProvider';


export default function LocalAuthenticate(username, callback = () => { }) {
	const client = ClientProvider.getInstance().client;
	client?.operations.authentication
		.username(username)
		.authenticatorSelector(new AuthenticationAuthenticatorSelectorImpl())
		.pinUserVerifier(new PinUserVerifierImpl())
		.biometricUserVerifier(new BiometricUserVerifierImpl())
		.devicePasscodeUserVerifier(new DevicePasscodeUserVerifierImpl())
		.fingerprintUserVerifier(new FingerprintUserVerifierImpl())
		.onSuccess(async (authorizationProvider) => {
			AuthorizationUtils.printAuthorizationInfo(authorizationProvider);
			console.log('本地验证成功')
			if(window.ActivePin) {
				//关闭Pin输入框
				Actions.pop()
			}
			NToast.removeAll()
			window.onModal('sensorModal', false)
			callback({isSuccess: true})
		})
		.onError((error) => {
			AuthorizationUtils.printSessionInfo(error.sessionProvider);
			NToast.removeAll()
			window.onModal('sensorModal', false)
			callback(error)
			console.log('本地验证错误error', error)
			if(window.ActivePin) {
				//关闭Pin输入框
				Actions.pop()
			}
		})
		.execute()
		.catch((err) => { console.log('本地验证错误err', err) });
};
