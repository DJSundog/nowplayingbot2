// server.js

// init project
var striptags = require('striptags');
var express = require('express');
var app = express();
var Masto = require('mastodon-api');

// set up mastodon connection
var mastodon = new Masto({
  access_token: process.env.ACCESS_TOKEN,
  api_url: process.env.API_URL
});

// set up playback system
var player = {
  running: false,
  queue: [],
  currentTrack: {
    queueIndex: 0,
    url: "",
    title: "",
    artist: "",
    year: 0,
    tags: [],
    lastPlayed: "never",
    totalPlays: 0
  },
  tags: ["tootlabradio", "nowplaying"],
  administrators: ["https://toot-lab.reclaim.technology/@djsundog"]
};

var mentionStream = mastodon.stream('streaming/user');

var reply = (botResponse) => {
  var response = mastodon.post('statuses', botResponse);  
  console.dir(response);
}

mentionStream.on('message', (msg) => {
  switch(msg.event) {
    case 'notification':
      console.log("NOTIFICATION: " + msg.data.type);
      
      switch(msg.data.type) {
        case 'mention':
          // check for commands, but only from administrators
          if (player.administrators.includes(msg.data.account.url)) {
            console.log("  Authorized User: " + msg.data.account.url);
            var statusText = striptags(msg.data.status.content);
            console.log("  ");
            console.log("  Message: " + statusText);
            
            // break the text up into an array of words
            var statusWords = statusText.split(" ");
            
            // if our username mention comes first, forget about it by shifting it off the front of the array
            if (statusWords[0] == "@nowplaying") statusWords.shift();
            
            // now we can expect the first word in the array to be a primary command
            var commandWord = statusWords[0];
            switch(commandWord.toLowerCase()) {
              case "status":
                // respond with a simple status message
                console.log("Responding to status command.");
                console.log(msg.data);
                var status = "@" + msg.data.account.acct + "\n\n" + 
                             "Current queue length: " + player.queue.length + "\n\n";
                if (player.running) {
                  status = status + "Currently playing \"" + player.currentTrack.title == "" ? "an unknown track" : player.currentTrack.title + 
                            "\" by " + player.currentTrack.artist == "" ? "an unknown artist" : player.currentTrack.artist + 
                            " from the album  \"" + player.currentTrack.album == "" ? "an unknown album" : player.currentTrack.album +
                            "\" (" + player.currentTrack.year == 0 ? "date unknown" : player.currentTrack.year + ")";
                } else {
                  status += "Nothing is playing currently."; 
                }
                var botResponse = {
                  status: status,
                  in_reply_to_id: msg.data.status.id,
                  visibility: msg.data.status.visibility == "direct" ? "direct" : "unlisted"
                }
                reply(botResponse);                
                break;
              case "show":
                
                break;
              case "play":
                
                break;
              case "restart":
                
                break;
              case "previous":
                
                break;
              case "next":
                
                break;
              case "stop":
                
                break;
              case "clear":
                
                break;
              case "add":
                
                break;
              case "delete":
                
                break;
              case "create":
                
                break;
              case "allow":
                
                break;
              case "deny":
                
                break;
              default:
                break;
            }
          } else {
            // for now, noop
            
          }
          break;
        default:
          console.dir(msg);
          break;
      }
      break;
    case 'update':
      
      break;
    default:
      console.log("Received unknown message type: " + msg.event);
      console.dir(msg);
      break;
  }
})

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
