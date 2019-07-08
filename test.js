const PexelsAPI = require('pexels-api-wrapper');
 
//Create Client instance by passing in API key
var pexelsClient = new PexelsAPI("563492ad6f917000010000014cec71bf3ca64008898653b85f3f9e7a");
 
//Search API
pexelsClient.search("food", 10, 1)
    .then(function(result){

for (let index = 0; index < result.photos.length; index++) {
	
console.log(result.photos[index])
	
}
       // console.log(result);
    }).
    catch(function(e){
        console.err(e);
    });
