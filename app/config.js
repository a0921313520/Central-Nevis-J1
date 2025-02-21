let config = {
	platformType: 'J1',
	languageType: 'M1',
	language: 'CN',
	UserTerms: () => {},
	LiveChat: () => {},
	Logout: () => {},
	HomePage: () => {},
	Registered: () => {},
	NevisOtp: () => {},
	get: () => {},
	post: () => {},
	patch: () => {},
	put: () => {},

}

// 设置 config 对象
export const setConfig = async (newConfig) => {
	config = { ...newConfig }
}

export const getConfig = () => config
