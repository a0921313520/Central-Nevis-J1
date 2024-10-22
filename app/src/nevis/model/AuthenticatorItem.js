import { Aaid, Authenticator } from '@nevis-security/nevis-mobile-authentication-sdk-react';


export class AuthenticatorItem {
	constructor(authenticator, isPolicyCompliant, isUserEnrolled) {
		this.authenticator = authenticator;
		this.isPolicyCompliant = isPolicyCompliant;
		this.isUserEnrolled = isUserEnrolled;
		this.isEnabled =
			isPolicyCompliant && (authenticator.aaid === Aaid.PIN.rawValue() || isUserEnrolled);
	}
}

export class AuthenticatorItemUtils {
	static localizedDetails(item) {
		if (item.isEnabled) {
			return undefined;
		}

		if (!item.isPolicyCompliant) {
			return ('authenticator.notPolicyCompliant');
		}

		if (!item.isUserEnrolled) {
			return ('authenticator.notEnrolled');
		}

		return undefined;
	}
}
