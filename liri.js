require("dotenv").config();

var keys = require("./keys.js");

// var client = new Twitter(keys.twitter);
// var spotify = new Spotify(keys.spotify);

//npm twitter api package install
var Twitter = require('twitter');

//npm node spotify api package install
var Spotify = require('node-spotify-api');

//pull/request in ombi api
var request = require("request");

//for random.txt and log.txt (bonus)
var fileSystem = require("fs");

//This makes it possible to pass multi-words rather then one word requests
var nodeArgv = process.argv;
var command = process.argv[2];

//movie or song
var input = "";

//multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    input = input + "+" + nodeArgv[i];
  } else{
    input = input + nodeArgv[i];
  }
}

//Switch case for taking in which operation request to use.
switch(command){

		case 'my-tweets':
			getTweets();
		break;

		case 'spotify-this-song':
				if(input){
					mySpotify(input);
				}else{
					mySpotify('the sign');
				}
		break;

		case 'movie-this':
        if(input){
          myMovies(input);
        }else{
          myMovies('Mr. Nobody');
        }
		break;

		case 'do-what-it-says':
			randomText();
		break;

		default:
    	console.log("Enter request: my-tweets, spotify-this-song, movie-this, do-what-it-says");
  	break;
}

//Twitter function
function getTweets () {
  var client = new Twitter(keys.twitter);
	var params = {screen_name: 'LCode36', count:20};

		client.get('statuses/user_timeline', params, function(error, tweets, response) {
  	if (!error) {

			for (i=0; i<tweets.length; i++){
						console.log('Created at: '+ tweets[i].created_at);
						console.log('Text: ' + tweets[i].text);
						console.log('--------------------------------------');
					}
  	} else {
			console.log('twitter error');
		}
	});
};

//Spotify function
function mySpotify (song) {

    var spotify = new Spotify(keys.spotify);
		spotify.search({ type: 'track', query: song, limit:1}, function(err, data) {
    // console.log(data.tracks.items[0]);
  	 if (!err) {
       for (var i = 0; i < data.tracks.items.length; i++) {
         var songObject = data.tracks.items[i];

         console.log("Artist(s): " + songObject.artists[0].name);
  		   console.log("Song name: " + songObject.name);
		     console.log("Preview link: " + songObject.preview_url);
		     console.log("Album name: " + songObject.album.name);
		     console.log("-----------------------");
		 }
		   }else{
		     console.log('spotify error');
		   }
    });
}

//omdi movies function
function myMovies (movie){
  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, data){

	      if (!error && response.statusCode === 200) {
          var data = JSON.parse(data);

          // console.log(data);
          console.log('Movie title: ' +  data.Title);
          console.log('Release date: ' + data.Year);
          console.log('IMDB rating: ' + data.imdbRating);
          console.log('Rotten Tomatoes rating: ' + data.Ratings[1].Value);
          console.log('Country: ' + data.Country);
          console.log('Language: ' + data.Language);
          console.log('Plot: ' + data.Plot);
          console.log('Actors: ' + data.Actors);
          console.log("-----------------------");

        } else {
          console.log('OMDB error')

        } if (movie === 'Mr. Nobody'){
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        }
    });
}

//text readme file function
function randomText (){
    fileSystem.readFile('random.txt', 'utf8', function(error, data){
      var txt = data.split(',');

      mySpotify(txt[1]);
    });
}
