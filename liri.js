require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');

var spotify = new Spotify({
	id: keys.spotifyKeys.id,
	secret: keys.spotifyKeys.secret
});

var songChoice = "";

var request = require('request');

var omdbRequest = "";

var fs = require("fs");

var moment = require('moment');

var userCommand = process.argv[2];

if (userCommand === "spotify-this-song") {

	spotifyCheck();
	spotifyCall(songChoice);
}

else if (userCommand === "movie-this") {

	movieCheck();
	movieCall(omdbRequest);
}

else if (userCommand === "concert-this") {

    bandsinTown();
	
}

else if (userCommand === "do-what-it-says") {

	justDoIt();	
}

else {
	return console.log("There was an error.");
}

function spotifyCheck () {
	
	if (!process.argv[3]) {
		songChoice = "The Sign";

	} else {
		for (i = 3; i < process.argv.length; i++) {
			songChoice = process.argv[i];
		}
	}
};

function spotifyCall(songChoice) {

	spotify.search({type: "track", query: songChoice, limit: 1}, function(error, response){
		if (error) {
			return console.log(error);
		}
		for (var j = 0; j < response.tracks.items[0].album.artists.length; j++) {
			console.log("Artist(s): " + response.tracks.items[0].album.artists[j].name);
			console.log("Song: " + response.tracks.items[0].name);
			console.log("Song Link: " + response.tracks.items[0].external_urls.spotify);
			console.log("Album: " + response.tracks.items[0].album.name);
		}
	});
};

function movieCheck() {
	if (!process.argv[3]) {
		omdbRequest = "Mr. Nobody";
	} else {
		for (var k = 3; k < process.argv.length; k++) {
			omdbRequest += process.argv[k] + "+";
		}
	}
};

function movieCall(omdbRequest) {
	var omdbMovie = "http://www.omdbapi.com/?t=" + omdbRequest + "&apikey=7b7352b8&" ;

	request(omdbMovie, function (error, response, body) {
		if (error) {
			return console.log(error);
		}
var body = JSON.parse(body);{
		console.log("Title of the movie: " + body.Title);
		console.log("Year the movie came out: " + body.Year);
        console.log("IMDB Rating: " + body.imdbRating);
        console.log("Rotten Tomatoes Rating: " + body.Ratings[1].Value);
		console.log("Country where the movie was produced: " + body.Country);
		console.log("Movie language: " + body.Language);
		console.log("Movie plot: " + body.Plot);
		console.log("Actors in the movie: " + body.Actors);
}
	});
};
    
function justDoIt() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		} else {
			var stringSplit = data.split(",");
			if (stringSplit[0] === "spotify-this-song") {
				songChoice = stringSplit[1];
				spotifyCall(songChoice);
			} 
			else if (stringSplit[0] === "movie-this") {
				omdbRequest = stringSplit[1];
				movieCall(omdbRequest);
			}
			else {
				console.log("Error: There's a problem with this call.")
			}
		}
	});
}

function bandsinTown(artist){
if (process.argv[2] === 'concert-this' ) {
    var artist = process.argv.slice(3).join(" ")
    console.log(artist);
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
     request(queryURL, function (error, response, body) {
        if (error) {
            return console.log(error); }
            else {
        var result  =  JSON.parse(body)[0];
        console.log("Venue name " + result.venue.name);
        console.log("Venue location " + result.venue.city);
        console.log("Date of Event " +  moment(result.datetime).format("MM/DD/YYYY"));
            }
     });
    }
}
