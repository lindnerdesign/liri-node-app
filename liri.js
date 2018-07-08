require("dotenv").config();

var keys = require("./keys.js");
var fileSystem = require("fs");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

//This makes it possible to pass multi-words rather then one word requests
process.argv.shift()  // skip node.exe
process.argv.shift()  // skip name of js file

var operationRequest = (process.argv.join(" "))

//Switch case for taking in which operation request to use.
switch(operationRequest){

		case 'my-tweets':
		getTweets();
		break;

		case 'spotify-this-song':
		mySpotify();
		break;

		case 'movie-this':
		myMovies();
		break;

		case 'do-what-it-says':
		randomText();
		break;
};
