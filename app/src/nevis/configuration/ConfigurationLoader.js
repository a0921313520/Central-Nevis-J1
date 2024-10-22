import { Configuration } from '@nevis-security/nevis-mobile-authentication-sdk-react';

import { AppConfiguration } from './AppConfiguration';
import authCloud from './config_authentication_cloud.json';
import identitySuite from './config_identity_suite.json';

export const AppEnvironment = {
	AuthenticationCloud: 'AuthenticationCloud',
	IdentitySuite: 'IdentitySuite'
};

export class ConfigurationLoader {
	static instance;
	_appEnvironment;
	_appConfiguration;
	_sdkConfiguration;

	constructor() {
		this._appEnvironment = AppEnvironment.AuthenticationCloud;
	}

	static getInstance() {
		if (!ConfigurationLoader.instance) {
			ConfigurationLoader.instance = new ConfigurationLoader();
		}

		return ConfigurationLoader.instance;
	}

	get appEnvironment() {
		return this._appEnvironment;
	}

	get appConfiguration() {
		if (this._appConfiguration) {
			return this._appConfiguration;
		}

		const json = this.configJson();
		this._appConfiguration = Object.assign(AppConfiguration.prototype, json);
		if (!this._appConfiguration) {
			console.log('Could not load configuration')
		}

		return this._appConfiguration;
	}

	get sdkConfiguration() {
		if (this._sdkConfiguration) {
			return this._sdkConfiguration;
		}

		const appConfiguration = this.appConfiguration;
		switch (this._appEnvironment) {
			case AppEnvironment.AuthenticationCloud:
				this._sdkConfiguration = Configuration.authCloudBuilder()
					.hostname(appConfiguration.sdk.hostname)
					.facetId(appConfiguration.sdk.facetId)
					.build();
				break;
			case AppEnvironment.IdentitySuite:
				this._sdkConfiguration = Configuration.builder()
					.baseUrl(appConfiguration.sdk.baseUrl)
					.facetId(appConfiguration.sdk.facetId)
					.registrationRequestPath(appConfiguration.sdk.registrationRequestPath)
					.registrationResponsePath(appConfiguration.sdk.registrationResponsePath)
					.authenticationRequestPath(appConfiguration.sdk.authenticationRequestPath)
					.authenticationResponsePath(appConfiguration.sdk.authenticationResponsePath)
					.deregistrationRequestPath(appConfiguration.sdk.deregistrationRequestPath)
					.dispatchTargetResourcePath(appConfiguration.sdk.dispatchTargetResourcePath)
					.build();
				break;
		}

		return this._sdkConfiguration;
	}

	configJson() {
		switch (this._appEnvironment) {
			case AppEnvironment.AuthenticationCloud:
				return authCloud;
			case AppEnvironment.IdentitySuite:
				return identitySuite;
			default:
				throw 'Unsupported environment.'
		}
	}
}
