require("dotEnv").config();
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var moment = require('moment');

// concert-this





// capture commands by using the 3rd argument in command line
var command = process.argv[2];
// make var usersInput = argv[3] and on (using for loop) instead of writing for loop every time

switch (command) {
    case "movie-this":
        var nodeArgs = process.argv;
        var movieName = "";
        for (var i = 3; i < nodeArgs.length; i++) {
            // movieName = movieName + nodeArgs[i];
            if (i > 3) {
                movieName += "+" + nodeArgs[i];
            } else {
                movieName += nodeArgs[i];
            }
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        console.log(movieName);

        axios.get(queryUrl).then(function (response) {
            //console.log(response);

            console.log(response.data.Year);
        }) // end of call function
        break;

    case "concert-this":
        console.log("this concert is....")
        var nodeArgs = process.argv;
        var concertName = "";
        for (var i = 3; i < nodeArgs.length; i++) {
            // movieName = movieName + nodeArgs[i];
            if (i > 3) {
                concertName += "+" + nodeArgs[i];
            } else {
                concertName += nodeArgs[i];
            }
        }
        /// format date using moment to be MM/DD/YYY
        // var queryUrlConcert = "https://rest.bandsintown.com/artists/" + concertName + "/events?app_id=codingbootcamp"
var queryUrlConcert= "https://rest.bandsintown.com/artists/"+concertName+"/events?app_id=codingbootcamp";
        // console.log(concertName);

        axios.get(queryUrlConcert).then(function (responseConcert) {
            // if (err) {
                //     return console.log(err);
                // }
                if(responseConcert.data.length == 0){
                   return console.log("sorry we have no concerts coming up for this artist");

                }else{

                    // console.log(response);
                    for (i = 0; i < responseConcert.data.length; i++) {
                        // console.log(JSON.stringify(response[0], null, 2));
                        console.log("*********break line statement*********");

                        console.log(responseConcert.data[i].venue.name);
                        console.log(responseConcert.data[i].venue.country);
                        console.log(responseConcert.data[i].venue.region);
                        console.log(responseConcert.data[i].venue.city);
                        var datetime= responseConcert.data[i].datetime;
                        // console.log(datetime);
                        console.log(moment(datetime).format("MM/DD/YYYY"));
                        console.log(responseConcert.data[i].url);

                        
                        } // end of loop for concerts venues
                    } // end of else statement  if there is data in array`
                }) // end of call function
                
        break;

    case "spotify-this-song":
        console.log("spotify this song");
        // var spotifyqueryURL = "https://api.spotify.com/v1/searchq=" + spotifyName + "&type=track";
        var nodeArgs = process.argv;
        var spotifyName = "The sign";

            for (var i = 3; i < nodeArgs.length; i++) {
                
                if (i > 3) {
                    spotifyName = "";
                    spotifyName += "+" + nodeArgs[i];
                } else if(i == 3) {
                    spotifyName = "";
                    spotifyName += nodeArgs[i];
                }
            }
            

        spotify.search({ type: 'track', query: spotifyName }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            
            // console.log(data);
            // console.log(query);
                    // for(j=0; j< data.tracks.items.length; j++){
                console.log(data.tracks.items[0].name);
                console.log(data.tracks.items[0].artists[0].name);
                console.log(data.tracks.items[0].album.release_date);

                console.log("song link "+data.tracks.items[0].external_urls.spotify);
                // console.log("song link "+data.tracks.items[0].uri);
                console.log("song link "+data.tracks.items[0].href);
                console.log("album link "+data.tracks.items[0].album.external_urls.spotify);



            // }
        });

        break;
    case "do-what-it-says":
        // console.log("do what it says");

        fs.readFile("random.txt", "utf8", function (error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            }

            // We will then print the contents of data
            console.log(data);

            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");

            // We will then re-display the content as an array for later use.
            console.log(dataArr);
            process.argv[2] = dataArr[0];
            process.argv[3] = dataArr[1];
            console.log(process.argv[2] + process.argv[3]);
        //    command = process.argv[2];
            

        });
        break;
    default: console.log("unrecognized command");
} // end of switch commands


