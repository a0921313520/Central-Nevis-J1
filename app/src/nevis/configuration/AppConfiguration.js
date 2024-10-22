export class SdkConfiguration {
	constructor(
		baseUrl,
		hostname,
		facetId,
		registrationRequestPath,
		registrationResponsePath,
		authenticationRequestPath,
		authenticationResponsePath,
		deregistrationRequestPath,
		dispatchTargetResourcePath
	) {
		this.baseUrl = baseUrl;
		this.hostname = hostname;
		this.facetId = facetId;
		this.registrationRequestPath = registrationRequestPath;
		this.registrationResponsePath = registrationResponsePath;
		this.authenticationRequestPath = authenticationRequestPath;
		this.authenticationResponsePath = authenticationResponsePath;
		this.deregistrationRequestPath = deregistrationRequestPath;
		this.dispatchTargetResourcePath = dispatchTargetResourcePath;
	}
}

export class AppConfiguration {
	constructor(sdk, loginRequestURL) {
		this.sdk = sdk;
		this.loginRequestURL = loginRequestURL;
	}
}
