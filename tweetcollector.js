var TwitterNode = require('twitter-node').TwitterNode, 
    sys = require('sys'),
    storage = require('./storage.js');
    
var twit = new TwitterNode({
  user: 'projectsapphire', 
  password: 'yahooers12',
  locations: [-122.75, 36.8, -121.75, 37.8, -74, 40, -73, 41, -118.4, 33.7,-117.4,34.7, -88.3, 41.5, -87.3, 42.5, -117.6, 32.1, -116.6, 33.1] //SF and NY and LA and CHICAGO and SD
});

twit.headers['User-Agent'] = '';

twit.addListener('error', function(error) {
  console.log(error.message);
});

var lat, long, created_at, fours = /(fours)/;

twit.addListener('tweet', function(tweet) {
	m = {
		"user": tweet.user.screen_name,
		"image": tweet.user.profile_image_url,
		"text": tweet.text,
		"placeid": tweet.place.id,
		"full_name": tweet.place.full_name,
		"place_type": tweet.place.place_type,
		"created_at" : new Date(tweet.created_at),
		"id" : tweet.id.toString()
	}
	
	if(fours.test(tweet.source)){
		m.checkedin = true;
	}
	if(tweet.geo){
		m.loc = { lat: tweet.geo.coordinates[0], long: tweet.geo.coordinates[1]}
    }
	if(tweet.place.place_type != "neighborhood"){
		m.resolveplace = true;
	}
	
	storage.save('tweets', m);
})
  .addListener('limit', function(limit) {
    sys.puts("LIMIT: " + sys.inspect(limit));
  })
  .addListener('delete', function(del) {
    sys.puts("DELETE: " + sys.inspect(del));
  })
  .addListener('end', function(resp) {
    sys.puts("wave goodbye... " + resp.statusCode);
    //Need to change this to exponential backoff
    setTimeout(function(){
		twit.stream();
    }, 20000)
  })
  .stream();

//Purge database of old tweets
setInterval(function(){
    storage.removeTweetsNotInLast3Hours("tweets");
}, 300000);