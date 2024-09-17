import { useState } from 'react';

import {
	MobileAuthenticationClientInitializer,
} from '@nevis-security/nevis-mobile-authentication-sdk-react';
import { AppEnvironment, ConfigurationLoader } from '../configuration/ConfigurationLoader';
import { AccountItem } from '../model/AccountItem';
import * as OutOfBandOperationHandler from '../userInteraction/OutOfBandOperationHandler';
import { ClientProvider } from '../utility/ClientProvider';
import { GetInitModeType } from '../../InitClient'
import LocalAuthenticate from './SelectAccountViewModel';

const useHomeViewModel = () => {

	const [localAccounts, setLocalAccounts] = useState([]);
	const [localAuthenticators, setLocalAuthenticators] = useState([]);
	const [numberOfAccounts, setNumberOfAccounts] = useState(0);

	async function initClient() {
		console.log('Initializing the client...');
		const configuration = ConfigurationLoader.getInstance().sdkConfiguration;
		await new MobileAuthenticationClientInitializer()
			.configuration(configuration)
			.onSuccess(async (mobileAuthenticationClient) => {
				ClientProvider.getInstance().client = mobileAuthenticationClient;
				console.log('Client received.');
				fetchData();
			})
			.onError((onError) => { console.log('initClient_onError', onError) })
			.execute()
			.catch((err) => { console.log('initClient_err', err) });
	}

	function handleDeepLink(url) {
		const payload = url
			.split('?')
			.at(1)
			?.split('&')
			.filter((queryParam) => queryParam.split('=').at(0) == 'dispatchTokenResponse')
			.at(0)
			?.split('=')
			.at(1);
		console.log(`Dispatch token response: ${payload}`);
		if (payload) {
			OutOfBandOperationHandler.decodePayload(payload).catch((err) => {
				console.log('handleDeepLinkerr', err)
			});
		}
	}

	function fetchData() {
		getAccounts().then(getAuthenticators).then(getDeviceInformation);
	}

	async function getAccounts() {
		const client = ClientProvider.getInstance().client;
		await client?.localData
			.accounts()
			.then((registeredAccounts) => {
				if (registeredAccounts.length === 0) {
					setNumberOfAccounts(0);
					setLocalAccounts([]);
					return console.log('There are no registered accounts.');
				}

				setNumberOfAccounts(registeredAccounts.length);
				console.log('registeredAccounts',registeredAccounts)
				setLocalAccounts(registeredAccounts);
			})
			.catch((err) => { console.log('getAccountserr', err)});
	}

	async function getAuthenticators() {
		const client = ClientProvider.getInstance().client;
		await client?.localData
			.authenticators()
			.then((authenticators) => {
				if (authenticators.length === 0) {
					return console.log('There are no available authenticators.');
				}

				console.log('authenticatorsauthenticators', authenticators)
				// alert('可使用===>' + JSON.stringify(authenticators))
				setLocalAuthenticators(authenticators);
				GetInitModeType && GetInitModeType(authenticators)
			})
			.catch((err) => { console.log('getAuthenticatorserr', err)});
	}

	async function getDeviceInformation() {
		const client = ClientProvider.getInstance().client;
		await client?.localData
			.deviceInformation()
			.then((deviceInformation) => {
				if (!deviceInformation) {
					return console.log('There is no available device info.');
				}
				console.log('deviceInformationdeviceInformation', deviceInformation)
			})
			.catch((err) => { console.log('getDeviceInformationerr', err) });
	}

	function readQrCode() {
		// navigation.navigate('ReadQrCode');
	}

	function authCloudApiRegister() {
		// navigation.navigate('AuthCloudApiRegistration');
	}

	function localAccountsVerify(callback = () => {}) {
		//本地验证
		const items = localAccounts.map((account) => new AccountItem(account.username))
		LocalAuthenticate(items[0]?.username, callback)
	}
	function selectAccount(operation) {

		// navigation.navigate('SelectAccount', {
		// 	items: localAccounts.map((account) => new AccountItem(account.username)),
		// 	operation: operation,
		// });
	}

	function inBandAuthenticate() {
		if (localAccounts.length === 0) {
			return 'There are no registered accounts 11'
		}
	}


	//删除
	async function deleteLocalAuthenticators(callback = () => {}) {
		const client = ClientProvider.getInstance().client;
		client?.localData.deleteAuthenticator(window.RegisteredUserName).then(() => {
			callback()
			console.log('删除成功')
		}).catch((err) => {
			console.log('deleteLocalAuthenticatorserr', err)
		})
	}

	return {
		numberOfAccounts,
		initClient,
		fetchData,
		handleDeepLink,
		readQrCode,
		authCloudApiRegister,
		inBandAuthenticate,
		deleteLocalAuthenticators,
		localAccountsVerify,
	};
};

export default useHomeViewModel;
