let config = {
	platformType: 'J1',
	languageType: 'M3',
	language: 'VN',
	onError: (res = {}) => {},//错误
	onSuccess: (res = {}) => {},//成功,返回res.statusToken
	onRegister: (res = {}) => {},//去注册
	onDownload: (res = {}) => {},//去下载
	onBack: (res = {}) => {},//返回
	fetchRequest: () => {},//get/post/put api

}

// 设置 config 对象
export const setConfig = async (newConfig) => {
	config = { ...newConfig }
}

export const getConfig = () => config
