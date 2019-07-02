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

	//counter[query.message.chat.id] = 1

	const { id } = msg.chat
	const name = msg.chat.first_name

	bot.sendMessage(id, name + ', Які саме картинки вам потрібно:', {
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: 'Популярні картинки за сьогодні',
						callback_data: 'popular'

					}
				],
				[
					{
						text: 'Машини',
						callback_data: 'cars'

					},
					{
						text: "Природа",
						callback_data: "nature"
					},
					{
						text: "Весілля",
						callback_data: "wedd"
					}

				]


			]

		}

	})//bot send mesage and keyboard


})


bot.on('callback_query', query => {

	let queryCall = query.data.split(';')
	

if ( queryCall[0]=== 'popular') {

	

		pexelsClient.getPopularPhotos(3, 1)
			.then(function (result) {
				//console.log(result);
				var urls = []
				for (let index = 0; index < result.photos.length; index++) {
					const element = result.photos[index];

					bot.sendPhoto(query.message.chat.id, element.src.large2x, {
						caption: `Фотограф  [${element.photographer}](${element.photographer_url}) на сайті [Pexels](https://www.pexels.com)
						[Оригінальне зоображення](${element.url}).`,
						parse_mode: 'Markdown'
					});
				};

				bot.answerCallbackQuery(query.id, `Готово`);

				if (counter[query.message.chat.id] === undefined) {
					counter[query.message.chat.id] = 2
				}else{
					miniCounter++
					counter[query.message.chat.id] = miniCounter
				}
			
			setTimeout(() => {
				bot.sendMessage(query.message.chat.id,'Ще популярних картинок', {
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: 'Вперед',
									callback_data: 'morepopular;' + counter[query.message.chat.id]

			
								}
							]
						]
			
					}
			
				})//bot send mesage and keyboard
			}, 1200);
				

			}).catch(function (e) {
				console.log(e);
			});

	} else if (queryCall[0] === 'cars') {

		pexelsClient.search("cars", 3, 1)
			.then(function (result) {
			//	console.log(result);

				for (let index = 0; index < result.photos.length; index++) {
					const element = result.photos[index];

					bot.sendPhoto(query.message.chat.id, element.src.large2x, {
						caption: `Фотограф  [${element.photographer}](${element.photographer_url}) на сайті [Pexels](https://www.pexels.com)
						[Оригінальне зоображення](${element.url}).`,
						parse_mode: 'Markdown'
					});


				};
				bot.answerCallbackQuery(query.id, `Готово`);


			}).catch(function (e) {
				console.log(e);
			});

		


	} else if (queryCall[0] === 'nature') {

		pexelsClient.search("nature", 3, 1)
			.then(function (result) {
				//console.log(result);

				for (let index = 0; index < result.photos.length; index++) {
					const element = result.photos[index];



					bot.sendPhoto(query.message.chat.id, element.src.large2x, {
						caption: `Фотограф  [${element.photographer}](${element.photographer_url}) на сайті [Pexels](https://www.pexels.com)
						[Оригінальне зоображення](${element.url}).`,
						parse_mode: 'Markdown'
					});


				};
				bot.answerCallbackQuery(query.id, `Готово`);

			}).catch(function (e) {
				console.log(e);
			});

	} else if(queryCall[0] === 'morepopular'){

		pexelsClient.getPopularPhotos(3, queryCall[1])
		.then(function (result) {
			//console.log(result);
			var urls = []
			for (let index = 0; index < result.photos.length; index++) {
				const element = result.photos[index];

				bot.sendPhoto(query.message.chat.id, element.src.large2x, {
					caption: `Фотограф  [${element.photographer}](${element.photographer_url}) на сайті [Pexels](https://www.pexels.com)
					[Оригінальне зоображення](${element.url}).`,
					parse_mode: 'Markdown'
				});
			};

			bot.answerCallbackQuery(query.id, `Готово`);

			if (counter[query.message.chat.id] === undefined) {
				counter[query.message.chat.id] = 2
			}else{
				miniCounter++
				counter[query.message.chat.id] = miniCounter
			}
		
			setTimeout(() => {
				bot.sendMessage(query.message.chat.id,'Ще популярних картинок', {
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: 'Вперед',
									callback_data: 'morepopular;' + counter[query.message.chat.id]
			
								}
							]
						]
			
					}
			
				})//bot send mesage and keyboard
			}, 1200);

		}).catch(function (e) {
			console.log(e);
		});

	}else {
		pexelsClient.search("wedding", 3, 1)
			.then(function (result) {
				//console.log(result);

				for (let index = 0; index < result.photos.length; index++) {
					const element = result.photos[index];
					
					bot.sendPhoto(query.message.chat.id, element.src.large2x, {
						caption: `Фотограф  [${element.photographer}](${element.photographer_url}) на сайті [Pexels](https://www.pexels.com)
						[Оригінальне зоображення](${element.url}).`,
						parse_mode: 'Markdown'
					});
				};

				bot.answerCallbackQuery(query.id, `Готово`);

			}).catch(function (e) {
				console.log(e);
			});		

	};

	bot.answerCallbackQuery(query.id,`${query.data}`)

})