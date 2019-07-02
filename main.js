const TelegramBot = require('node-telegram-bot-api');
const PexelsAPI = require('pexels-api-wrapper');

const confData = require('./confidental')


var pexelsClient = new PexelsAPI(confData.Pexels_tok);



console.log('main started...')

const bot = new TelegramBot(confData.telegam_tok,{
	polling:{
		interval:300,
		autoStart:true,
		params:{
			timeout:10
		}
	}
	
})

function random(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  };


bot.on('message',msg =>{


const { id } = msg.chat 
const name = msg.chat.first_name


	

	


	pexelsClient.getPopularPhotos(2, 1)
    .then(function(result){
		console.log(result);
		var urls = []
		for (let index = 0; index < result.photos.length; index++) {
			const element = result.photos[index];

			

			// bot.sendPhoto(id, element.src.large2x,{
			// 				caption:`Фотограф  [${element.photographer}](${element.photographer_url}) на сайті [Pexels](https://www.pexels.com)
			// 				[Оригінальне зоображення](${element.url}).`,
			// 				parse_mode:'Markdown'
			// 			})

			var item = {
				type:'photo',
				media:element.src.large2x,
				caption:`Фотограф  [${element.photographer}](${element.photographer_url}) на сайті [Pexels](https://www.pexels.com)	[Оригінальне зоображення](${element.url}).`,
				parse_mode:'Markdown'
			}
				
						
			urls.push(item)
		}
let sendMasag = JSON.stringify(urls,null, 2)
console.log(sendMasag)

		//bot.sendMessage(id,`картинки ${sendMasag}`)

		bot.sendMediaGroup(id,sendMasag)


    }).catch(function(e){
        console.log(e);
    });
	

})