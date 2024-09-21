//读取相册二维码
const ReadImageQrCode = (base64 = '') => {
    const images = `data:image/png;base64,${base64}`
    const htmls = `<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>QR Code Scanner</title>
	<script src="https://unpkg.com/jsqr/dist/jsQR.js"></script>
</head>

<body>

	<h1>QR Code Scanner</h1>

	<canvas id="qrCanvas"></canvas>


	<script>

		let base64Image = '${images}'

		function parseQRCode() {
			const canvas = document.getElementById('qrCanvas');
			const context = canvas.getContext('2d');

			const image = new Image();
			image.src = base64Image;

			image.onload = function () {
				console.log("图片加载完成");

				canvas.width = image.width;
				canvas.height = image.height;

				context.drawImage(image, 0, 0, image.width, image.height);

				try {
					const imageData = context.getImageData(0, 0, image.width, image.height);
					console.log("成功获取像素数据", imageData);

					const code = jsQR(imageData.data, image.width, image.height);

					if (code) {
						console.log("二维码解析成功:", code.data);
						postWebView(code.data)
					} else {
						console.log("二维码解析失败");
						postWebView('error_found 二维码解析失败')
					}

				} catch (error) {
					console.error('获取像素数据时发生错误:', error);
					postWebView('error_qr 获取像素数据时发生错误' + error)
				}
			};

			image.onerror = function () {
				console.error('图片加载失败');
				postWebView('error_qr 图片加载失败')
			};
		}

		function postWebView(action) {
			var us = navigator.userAgent;
			var isAndroid = us.indexOf('Android') > -1 || us.indexOf('Adr') > -1;
			if (isAndroid) {
				window.postMessage && window.postMessage(action)
			} else {
				window.ReactNativeWebView && window.ReactNativeWebView.postMessage(action)
			}
		}

		parseQRCode()
	</script>

</body>

</html>`
    return htmls
}

export default ReadImageQrCode;