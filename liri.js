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
					mySpotify('glorious');
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

// Log data to log.txt file (Bonus)
function logData (info){
  fileSystem.appendFile('log.txt', info , (error) => {

  if (error) {
    console.log("Logging Error :" + error);
  }
});

}

//Twitter function
function getTweets () {
  var client = new Twitter(keys.twitter);
	var params = {screen_name: 'LCode36', count:20};

		client.get('statuses/user_timeline', params,(error, tweets, response) => {
  	if (!error) {

			for (i=0; i<tweets.length; i++){

        var msgTweets = 'Tweet: ' + tweets[i].text + '\n'
         + 'Created at: ' + tweets[i].created_at + '\n'
				 + '--------------------------------------' + '\n'
         console.log(msgTweets);
         console.log(logData(msgTweets));
       }

  	   } else {
			   console.log('twitter error');
		   }
	});
}

//Spotify function
function mySpotify (song) {

    var spotify = new Spotify(keys.spotify);
		spotify.search({ type: 'track', query: song, limit:1},(err, data) => {
    // console.log(data.tracks.items[0]);
  	 if (!err) {
       for (var i = 0; i < data.tracks.items.length; i++) {
         var songObject = data.tracks.items[i];

         var msgSpotify = "Artist(s): " + songObject.artists[0].name + '\n'
  		   + "Song name: " + songObject.name + '\n'
		     + "Preview link: " + songObject.preview_url + '\n'
		     + "Album name: " + songObject.album.name + '\n'
		     + "-----------------------" + '\n'
         console.log(msgSpotify);
         console.log(logData(msgSpotify));
		    }

		    } else {
		      console.log('spotify error');
		    }
    });
}

//omdi movies function
function myMovies (movie) {
  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(queryUrl,(error, response, data) =>{

	      if (!error && response.statusCode === 200) {
          var data = JSON.parse(data);

          if (movie.Response === 'False'){
            console.log("Error: " + movie.Error)
            return
          }
          // console.log(data);
          var msgMovie = 'Movie title: ' +  data.Title + '\n'
          + 'Release date: ' + data.Year + '\n'
          + 'IMDB rating: ' + data.imdbRating + '\n'
          + 'Rotten Tomatoes rating: ' + data.Ratings[1].Value + '\n'
          + 'Country: ' + data.Country + '\n'
          + 'Language: ' + data.Language + '\n'
          + 'Plot: ' + data.Plot + '\n'
          + 'Actors: ' + data.Actors + '\n'
          + "-----------------------" + '\n'
          console.log(msgMovie);
          console.log(logData(msgMovie));

        } else{
          console.log('OMDB error')

        } if (movie === 'Mr.+Nobody') {
            var mrNoBody = "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" + '\n'
            + "It's on Netflix!"
        }
    });
}

//text readme file function
function randomText () {
    fileSystem.readFile('random.txt', 'utf8',(error, data) =>{
      var txt = data.split(',');

      mySpotify(txt[1]);
    });
}
