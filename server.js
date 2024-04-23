const express = require('express');
const fetch = require('cross-fetch');
const { stringify } = require('querystring');
const app = express();

app.use(express.json());

app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'));

// Функция высшего порядка для обработки подписки
function handleSubscription(callback) {
	return async function(req, res) {
		if (!req.body.captcha)
			return res.json({ success: false, msg: 'Please select captcha' });

		const secretKey = '6LfxOsQpAAAAAPS6cBtou4MFnCyarT3ioX0hqGF_';
		const query = stringify({
			secret: secretKey,
			response: req.body.captcha,
			remoteip: req.connection.remoteAddress
		});
		const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

		const body = await fetch(verifyURL).then(res => res.json());

		if (body.success !== undefined && !body.success) {
			return res.json({ success: false, msg: 'Failed captcha verification' });
		} else {
			callback(req, res);
		}
	};
}

// Демонстрационная функция обратного вызова
function subscriptionSuccess(req, res) {
	// Ваша логика после успешной проверки капчи
	res.json({ success: true, msg: 'Captcha passed and subscription successful!' });
}

app.post('/subscribe', handleSubscription(subscriptionSuccess));

app.listen(3000, () => console.log('Server started on port 3000'));