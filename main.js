const TelegramBot = require('node-telegram-bot-api');
const PexelsAPI = require('pexels-api-wrapper');

const confData = require('./confidental')


var pexelsClient = new PexelsAPI(confData.Pexels_tok);



console.log('main started...')
let counter = {};
let miniCounter = 1;

const bot = new TelegramBot(confData.telegam_tok, {
	polling: {
		interval: 300,
		autoStart: true,
		params: {
			timeout: 10
		}
	}

})

function random(min, max) {
	var rand = min + Math.random() * (max + 1 - min);
	rand = Math.floor(rand);
	return rand;
};


bot.on('message', msg => {
	const {	id } = msg.chat
	const name = msg.chat.first_name

	counter[id] = 1;
	bot.sendMessage(id, name + ', Які саме картинки вам потрібно:', {
		reply_markup: {
			inline_keyboard: [
				[{
					text: 'Популярні картинки 👍',
					callback_data: 'popular'
				}],
				[{
						text: 'Машини 🚗',
						callback_data: 'cars'
					},
					{
						text: "Природа 🌳",
						callback_data: "nature"
					},
					{
						text: "Весілля 💍",
						callback_data: "wedding"
					}
				],
				[{
						text: 'Тварини 🐶',
						callback_data: 'animals'
					},
					{
						text: "Подорожі 🛩",
						callback_data: "travel"
					},
					{
						text: "Міста 🏙",
						callback_data: "city"
					}
				],
				[{
					text: 'Їжа 🥙',
					callback_data: 'food'
				},
				{
					text: "Спорт ⚽",
					callback_data: "sport"
				},
				{
					text: "Пори року 🌈",
					callback_data: "seasons"
				}
			]
			]
		}
	}) //bot send mesage and keyboard


})

function GetPopular(count, page, chatId, queryId) {
	pexelsClient.getPopularPhotos(count, page)
		.then(function (result) {
			for (let index = 0; index < result.photos.length; index++) {
				const element = result.photos[index];
				bot.sendPhoto(chatId, element.src.large2x, {
				caption: `Фотограф  [${element.photographer}](${element.photographer_url}) на сайті [Pexels](https://www.pexels.com)
				
				[Оригінальне зоображення](${element.url}).`,
					parse_mode: 'Markdown'
				});
			};
			bot.answerCallbackQuery(queryId, `Готово`);

			if (counter[chatId] === undefined) {
				counter[chatId] = 2
			} else {
				miniCounter++
				counter[chatId] = miniCounter
			}
			setTimeout(() => {
				bot.sendMessage(chatId, 'Ще популярних картинок?', {
					reply_markup: {
						inline_keyboard: [
							[{
								text: 'Так',
								callback_data: 'morepopular;' + counter[chatId]

							}]
						]
					}
				}) //bot send mesage and keyboard
			}, 1800);
		}).catch(function (e) {
			console.log(e);
		});

}
function GetSearch(search, count, page, chatId, queryId) {
	pexelsClient.search(search, count, page)
		.then(function (result) {

			for (let index = 0; index < result.photos.length; index++) {
				const element = result.photos[index];

				bot.sendPhoto(chatId, element.src.large2x, {
				caption: `Фотограф  [${element.photographer}](${element.photographer_url}) на сайті [Pexels](https://www.pexels.com)
				
				[Оригінальне зоображення](${element.url}).`,
					parse_mode: 'Markdown'
				});
			};
			bot.answerCallbackQuery(queryId, `Готово`);
			if (counter[chatId] === undefined) {
				counter[chatId] = 2
			} else {
				miniCounter++
				counter[chatId] = miniCounter
			}
			setTimeout(() => {
				bot.sendMessage(chatId, 'Завантажити ще ?', {
					reply_markup: {
						inline_keyboard: [
							[{
								text: 'Так',
								callback_data: 'more' + search +';' + counter[chatId]

							}]
						]
					}
				}) //bot send mesage and keyboard
			}, 1800);


		}).catch(function (e) {
			console.log(e);
		});
}

bot.on('callback_query', query => {

	let queryCall = query.data.split(';');
switch (queryCall[0]) {
	case 'wedding':
		GetSearch('wedding', 3, 1, query.message.chat.id, query.id);
		break;
	case 'morewedding':
		GetSearch('wedding', 3, queryCall[1], query.message.chat.id, query.id);
		break;
	case 'nature':
		GetSearch('nature', 3, 1, query.message.chat.id, query.id);
	case 'morenature':
		GetSearch('nature', 3, queryCall[1], query.message.chat.id, query.id);
		break;
	case 'cars':
		GetSearch('cars', 3, 1, query.message.chat.id, query.id);
		break;
	case 'morecars':
		GetSearch('cars', 3, queryCall[1], query.message.chat.id, query.id);
		break;
	case 'animals':
		GetSearch('animals', 3, 1, query.message.chat.id, query.id);
		break;
	case 'moreanimals':
		GetSearch('animals', 3, queryCall[1], query.message.chat.id, query.id);
		break;
	case 'travel':
		GetSearch('travel', 3, 1, query.message.chat.id, query.id);
		break;
	case 'moretravel':
		GetSearch('travel', 3, queryCall[1], query.message.chat.id, query.id);
		break;
	case 'city':
		GetSearch('city', 3, 1, query.message.chat.id, query.id);
		break;
	case 'morecity':
		GetSearch('city', 3, queryCall[1], query.message.chat.id, query.id);
		break;
	case 'food':
		GetSearch('food', 3, 1, query.message.chat.id, query.id);
		break;
	case 'morefood':
		GetSearch('food', 3, queryCall[1], query.message.chat.id, query.id);
		break;
	case 'sport':
		GetSearch('sport', 3, 1, query.message.chat.id, query.id);
		break;
	case 'moresport':
		GetSearch('sport', 3, queryCall[1], query.message.chat.id, query.id);
		break;
	case 'seasons':
		GetSearch('seasons', 3, 1, query.message.chat.id, query.id);
		break;
	case 'moreseasons':
		GetSearch('seasons', 3, queryCall[1], query.message.chat.id, query.id);
		break;

	case 'morepopular':
		GetPopular(3, queryCall[1], query.message.chat.id, query.id);
		break;
	default:
		GetPopular(3, 1, query.message.chat.id, query.id);
		break;
}

	//bot.answerCallbackQuery(query.id,`${query.data}`)

})