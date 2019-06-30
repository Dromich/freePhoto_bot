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
	
	pexelsClient.getPhoto(random(1111111,3333333))
    .then(function(result){
		console.log(result);

		if (result.status == '404'  ) {
		
			bot.sendMessage(id,'Помилка ' + result.error )

		}else{
			bot.sendPhoto(id, result.src.medium,{
				caption:`Фотграф ${result.photographer} `
			})
	
			bot.sendMessage(id,'фото на сайті ' + result.url )

			
		}

		
    }).
    catch(function(e){
		bot.sendMessage(id,'Помилка ' + e); 

        console.log('помилка ' + e);
	});
	
	

})