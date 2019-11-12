require("dotEnv").config();
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var moment = require('moment');

var nodeArgs = process.argv;
var concertName = "";
var movieName = "";
var spotifyName = "The sign";

// *************** movie function ****************
function callMovie() {

    movieName = userSearch;
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    console.log(movieName);

    axios.get(queryUrl).then(function (response) {
        // console.log(response);
        console.log("Title: " + response.data.Title);
        console.log("Release Year: " + response.data.Year);
        console.log("Language: " + response.data.Language);
        console.log("Country: " + response.data.Country);
        console.log("Actors: " + response.data.Actors);
        console.log("Plot: " + response.data.Plot);
        console.log("IMDB Rating: " + response.data.Ratings[0].Value);
        console.log("Rotton Tomatoes Rating: " + response.data.Ratings[1].Value);
       
        var logFile = "\n" + "Title: " + response.data.Title +
        "Release Year: " + response.data.Year +
        "Language: " + response.data.Language +
        "Country: " + response.data.Country +
        "Actors: " + response.data.Actors +
        "Plot: " + response.data.Plot +
        "IMDB Rating: " + response.data.Ratings[0].Value +
        "Rotton Tomatoes Rating: " + response.data.Ratings[1].Value + "\n";
        
        logSearches(logFile);
        
        
    }) // end of call function

}
// **************** SPOTIFY FUNCTION *******************
function callspotify() {

    spotifyName = userSearch;
    spotify.search({ type: 'track', query: spotifyName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // console.log(data);
        // console.log(query);
        for (j = 0; j < data.tracks.items.length; j++) {
            console.log("************************ BREAK ***************");
            console.log("Track Name: " + data.tracks.items[j].name);
            console.log("Artist Name: " + data.tracks.items[j].artists[0].name);
            console.log("Album Name: " + data.tracks.items[j].album.name);
            console.log("Release Date: " + data.tracks.items[j].album.release_date);

            // console.log("song link " + data.tracks.items[j].external_urls.spotify);
            // console.log("song link "+data.tracks.items[0].uri);
            // console.log("song link " + data.tracks.items[j].href);
            // console.log("album link " + data.tracks.items[j].album.external_urls.spotify);
            console.log(data.tracks.items[j].preview_url);

            // appending file to log.js
            var logFile =  "\n" + "Track Name: " + data.tracks.items[j].name +
                "Artist Name: " + data.tracks.items[j].artists[0].name +
                "Album Name: " + data.tracks.items[j].album.name +
                "Release Date: " + data.tracks.items[j].album.release_date +
                data.tracks.items[j].preview_url + "\n";
                logSearches(logFile);

        } // end of loop
    }); // end of spotify seach
}; // end of callspotify function

// ***************** CALL CONCERT FUNCTION ***************
function callconcert() {
    console.log("this concert is....")

    concertName = userSearch;
    var queryUrlConcert = "https://rest.bandsintown.com/artists/" + concertName + "/events?app_id=codingbootcamp";
    // console.log(concertName);

    axios.get(queryUrlConcert).then(function (responseConcert) {
        if (responseConcert.data.length == 0) {
            return console.log("sorry we have no concerts coming up for this artist");

        } else {

            // console.log(response);
            for (i = 0; i < responseConcert.data.length; i++) {
                if (i === 5) {
                    break;
                }
                // console.log(JSON.stringify(response[0], null, 2));
                console.log("*********break line statement*********");
                //   console.log(responseConcert.data[i]);
                console.log("Venue Name: " + responseConcert.data[i].venue.name);
                console.log("Venue Location: " + responseConcert.data[i].venue.city + ", " + responseConcert.data[i].venue.country);

                // console.log("Venue Location: "+responseConcert.data[i].venue.country+", "+responseConcert.data[i].venue.city);
                if (responseConcert.data[i].venue.region !== '') {
                    console.log("State: " + responseConcert.data[i].venue.region);
                }
                // console.log(responseConcert.data[i].venue.city);
                var datetime = responseConcert.data[i].datetime;
                // console.log(datetime);
                console.log("Date: " + moment(datetime).format("MM/DD/YYYY"));
                console.log("Concert Link: " + responseConcert.data[i].url);

                var logFile =  "\n" + 
                "Venue Name: " + responseConcert.data[i].venue.name +
                "Venue Location: " + responseConcert.data[i].venue.city + ", " + responseConcert.data[i].venue.country +
                // var datetime = responseConcert.data[i].datetime;
                "Date: " + moment(datetime).format("MM/DD/YYYY") +
                "Concert Link: " + responseConcert.data[i].url + "\n";

                logSearches(logFile);


            } // end of loop for concerts venues
        } // end of else statement  if there is data in array
    }) // end of call function
        .catch(function (error) {
            // handle error
            console.log(error);
        }); // end of catch
}// end of callconcert function


// capture commands by using the 3rd argument in command line
var command = process.argv[2];
var userSearch = process.argv.slice(3).join("+");
// make var usersInput = argv[3] and on (using for loop) instead of writing for loop every time

switch (command) {
    case "movie-this":
        callMovie();
        break;

    case "concert-this":
        callconcert();
        break;

    case "spotify-this-song":
        callspotify();

        break;
    case "do-what-it-says":
        // console.log("do what it says");

        fs.readFile("random.txt", "utf8", function (error, data) {

            // If the code experiences any errors it will log the error to the console.
            // if (error) {
            //     return console.log(error);
            // }
            console.log(data);

            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");

            userSearch = dataArr[1];
            var command = dataArr[0];
            // console.log(process.argv[2] + process.argv[3]);
            switch (command) {
                case "spotify-this-song":

                    callspotify();
                    break;
                case "movie-this":
                    callMovie();
                    break;
                case "concert-this":
                    // concertName = dataArr[1];
                    callconcert();
                    break;
                default: console.log("sorry try again!");
            } // end of switch statement

        });
        break;
    default: console.log("unrecognized command");
} // end of switch commands

//function for appending search log into log.txt
var logSearches = function (logFile) {
    fs.appendFile("log.txt", logFile, function (err) {
        if (err) {
            return console.log(err);
        }
    })


}