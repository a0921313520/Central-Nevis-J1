import {
	AccountSelector,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import { AccountItem } from '../model/AccountItem';


export class AccountSelectorImpl extends AccountSelector {
	async selectAccount(
		context,
		handler
	){
		console.log('Please select one of the received available accounts!');
		const supportedAuthenticators = context.authenticators.filter(
			(a) => a.isSupportedByHardware
		);
		if (supportedAuthenticators.length === 0) {
			return 'supportedAuthenticatorserr'
		}

		const usernames = new Set();
		for (const authenticator of supportedAuthenticators) {
			for (const account of authenticator.registration.registeredAccounts) {
				const isPolicyCompliant = await context.isPolicyCompliant(
					authenticator.aaid,
					account.username
				);
				if (isPolicyCompliant) {
					usernames.add(account.username);
				}
			}
		}
		async function confirm(
			selectedUsername,
			accountSelectionHandler
		) {
			await accountSelectionHandler?.username(selectedUsername);
		}
		switch (usernames.size) {
			case 0:
				// No username is compliant with the policy.
				// Provide a random username that will generate an error in the SDK.
				console.log('No valid account found!');
				await handler.username('');
				break;
			case 1:
				{
					const username = usernames.values().next().value;
					if (context.transactionConfirmationData) {
						console.log('Transaction need to be confirmed!');
						confirm(username, handler)
					} else {
						// Typical case: authentication with username provided, just use it.
						console.log('One account found, performing automatic selection!');
						await handler.username(username);
					}
				}
				break;
			default: {
				console.log('Multiple accounts found!');
				const items = Array.from(usernames).map((username) => new AccountItem(username));

			}
		}
	}
}
