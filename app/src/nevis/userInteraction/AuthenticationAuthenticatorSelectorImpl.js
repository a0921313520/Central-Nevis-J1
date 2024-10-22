
import {
	AuthenticatorSelectionContext,
	AuthenticatorSelectionHandler,
	AuthenticatorSelector,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import { NevisAaid } from '../../InitClient'

import { AuthenticatorItem } from '../model/AuthenticatorItem';

export class AuthenticationAuthenticatorSelectorImpl extends AuthenticatorSelector {
	constructor() {
		super();
	}

	async selectAuthenticator(
		context,
		handler
	){
		console.log('Please select one of the received available authenticators111');
		const username = context.account.username;
		const authenticators = context.authenticators.filter((a) => {
			// Do not display:
			//   - non-registered authenticators
			//   - not hardware supported authenticators
			return a.registration.isRegistered(username) && a.isSupportedByHardware;
		});
		const items = [];
		for (const authenticator of authenticators) {
			items.push(
				new AuthenticatorItem(
					authenticator,
					await context.isPolicyCompliant(authenticator.aaid),
					authenticator.userEnrollment.isEnrolled(username)
				)
			);
		}
		setTimeout(async () => {
			const aaid = NevisAaid(window.NevisModeChange)
			console.log('aaid2222==', window.NevisModeChange)
			await handler?.aaid(aaid).catch((err) => {console.log('err1d1d1d', err)});
		}, 200);
	}
}
