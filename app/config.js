let config = {
	platformType: 'J1',
	languageType: 'M3',
	language: 'VN',
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
