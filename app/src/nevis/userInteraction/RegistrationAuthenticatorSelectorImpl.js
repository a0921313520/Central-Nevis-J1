
import { Platform } from 'react-native';

import {
	Aaid,
	Authenticator,
	AuthenticatorSelectionContext,
	AuthenticatorSelectionHandler,
	AuthenticatorSelector,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import { NevisAaid } from '../../InitClient'

import { AuthenticatorItem } from '../model/AuthenticatorItem';

export class RegistrationAuthenticatorSelectorImpl extends AuthenticatorSelector {
	constructor() {
		super();
	}

	async selectAuthenticator(
		context,
		handler
	) {
		console.log('Please select one of the received available authenticators!');
		const authenticators = [];
		for (const authenticator of context.authenticators) {
			const mustDisplay = await this.mustDisplayForRegistration(authenticator, context);
			if (mustDisplay) {
				authenticators.push(authenticator);
			}
		}

		const items = [];
		for (const authenticator of authenticators) {
			items.push(
				new AuthenticatorItem(
					authenticator,
					await context.isPolicyCompliant(authenticator.aaid),
					authenticator.userEnrollment.isEnrolled(context.account.username)
				)
			);
		}
		setTimeout(async () => {
			//NevisModeChange为空，使用NevisModeType
			const aaid = NevisAaid(window.NevisModeChange)
			console.log('aaid11111==', window.NevisModeChange)
			await handler?.aaid(aaid).catch((err) => {console.log('err1d1d1d', err)});
		}, 200);
	}

	async mustDisplayForRegistration(
		authenticator,
		context
	){
		if (Platform.OS === 'android') {
			const biometricsRegistered = context.authenticators.filter((contextAuthenticator) => {
				return (
					contextAuthenticator.aaid === Aaid.BIOMETRIC.rawValue() &&
					contextAuthenticator.registration.isRegistered(context.account.username)
				);
			});

			const biometricsAvailable = [];
			const fingerprintAvailable = [];
			for (const contextAuthenticator of context.authenticators) {
				const isBiometricAvailable =
					contextAuthenticator.aaid === Aaid.BIOMETRIC.rawValue() &&
					contextAuthenticator.isSupportedByHardware &&
					(await context.isPolicyCompliant(contextAuthenticator.aaid));
				if (isBiometricAvailable) {
					biometricsAvailable.push(contextAuthenticator);
				}

				const isFingerprintAvailable =
					contextAuthenticator.aaid === Aaid.FINGERPRINT.rawValue() &&
					contextAuthenticator.isSupportedByHardware &&
					(await context.isPolicyCompliant(contextAuthenticator.aaid));
				if (isFingerprintAvailable) {
					fingerprintAvailable.push(contextAuthenticator);
				}
			}

			// If biometric can be registered (or is already registered), or if we
			// cannot register fingerprint, do not propose to register fingerprint
			// (we favor biometric over fingerprint).
			if (
				(biometricsRegistered.length > 0 ||
					biometricsAvailable.length > 0 ||
					fingerprintAvailable.length === 0) &&
				authenticator.aaid === Aaid.FINGERPRINT.rawValue()
			) {
				console.log(`Return false`);
				return false;
			}
		}

		// Do not display:
		//  - policy non-compliant authenticators (this includes already registered authenticators)
		//  - not hardware supported authenticators
		const isPolicyCompliant = await context.isPolicyCompliant(authenticator.aaid);
		return authenticator.isSupportedByHardware && isPolicyCompliant;
	}
}
