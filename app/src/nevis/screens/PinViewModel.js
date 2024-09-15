
import { PinMode } from '../model/PinMode';

//提交Pin
export const usePinView = async (pin = '', mode, handler) => {
	console.log('提交Pin', pin);
	switch (mode) {
		case PinMode.enrollment:
			await handler
				.pin(pin)
				.catch((err) => { console.log('提交Pin err', err)});
			break;
		case PinMode.verification:
			await handler
				.verifyPin(pin)
				.catch((err) => { console.log('提交Pin err', err)});
			break;
	}
}
//取消Pin
export const usePinCancel = async (mode, handler) => {
	console.log('取消Pin', mode);
	switch (mode) {
		case PinMode.enrollment:
			await handler
				.cancel()
				.catch((err) => { console.log('取消添加Pin登录方式err', err) });
			break;
		case PinMode.verification:
			await handler
				.cancel()
				.catch((err) => { console.log('取消Pin验证err', err) });
			break;
	}
}

