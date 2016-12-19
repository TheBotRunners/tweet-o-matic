/* Start up */
console.log('===============================================================');
console.log('#   The Bot is Starting ＼(^-^)／');
//Importing Config files
console.log('#   Fetching local Data  ...');
var Twit = require('twit'); // Import Twit package
var oauth_keys = require('./config/oauth_keys'); // Import tokens from Twitter API :P
var config = require('./get_config');
var admin = require('./config/admin'); // Import your Data
var lookup = require('./lookup.json'); //Setup variable resolving Table
console.log('#   Data from get_post()' + config.get_post());
console.log('#   Data from get_follow_reply()' + config.get_follow_reply());
console.log('#   Establishing conection to Twitter ...');
// Creating new Twit object with OAuth credentials you get from config
var T = new Twit(oauth_keys);
// Sending a Tweet that the bot is started
console.log('#   The Start up is finished sending tweet to Admin');
time = new Date().toLocaleTimeString()// gets the system time
//tweeting('@Knadah Start up without any Problems at '+time+' #Bot' );
var sleep = require('sleep');
console.log('===============================================================');
console.log('');
sleep.sleep(1);//dramatic pause for effect (^⊙﹏⊙^)
/* Start up end */
/* Global Var's */

var tweet_it = config.get_post();
var f_tweet = config.get_follow_reply();

/* Global Var's end */
/* Bot function */

/* Twitter api GET request*/
var params = {
    q: 'Knadah', //search querry
    count: 1 //total counts of returning data
}
T.get('search/tweets', params, gotData);

function gotData(err, data, response) {
    var call = data.statuses; //statuses
    for (var i = 0; i < call.length; i++) {
        console.log('===============================================================');
        console.log('#   Namen: ' + call[i].name);
        console.log('#   ID: ' + call[i].id);
        console.log('#   ID STR: ' + call[i].id_str);
        console.log('#   Tweet text: ' + call[i].text);
        console.log('#   screen_name: ' + call[i].user.screen_name);
        console.log('#   user_mentions: ' + call[i].user.user_mentions);
        console.log('===============================================================');
        console.log('');
    };
    console.log('');
    if (err) {
        console.log('Oh no! ಠ_ಠ Something went wrong while i tried to fetch tweets (╥﹏╥) ');
    } else {
        console.log('Yes! (^._.^)ﾉ It worked i just fetched some precious tweets from Twitter!');
    }
}
/* Twitter api GET request end*/

/* Twitter api POST request*/

//Setting up a User Stream
var stream = T.stream('user');
stream.on('follow', followed);

function followed(eventMSG) {
    console.log('===============================================================');

    var name = eventMSG.source.name;
    var screenName = eventMSG.source.screen_name;
    console.log('I was followed by ' + screenName + ' (˘▽˘>ԅ( ˘⌣˘)');
    var r = Math.floor(Math.random() * 100);
    var f_tweet = config.get_follow_reply();
    tweeting('@' + screenName + ' ' + f_tweet + ' #bot' + ' #' + r);
    console.log('===============================================================');
}

function tweeting(tweet_it, f_tweet) {
    if (f_tweet) {
        var tweet = {
            status: f_tweet
        }
    } else {
        var tweet = {
            status: tweet_it
        }
    }
    T.post('statuses/update', tweet, tweeted);
    function tweeted(err, data, response) {
        if (err) {
            console.log('===============================================================');
            console.log('Oh no! ಠ_ಠ Somthing went wrong while i tried to tweet (╥﹏╥)');
            console.log('===============================================================');
        } else {
            console.log('===============================================================');
            console.log('Yes! (^._.^)ﾉ It worked i just posted somthing on Twitter');
            console.log(tweet);
            console.log('===============================================================');
        }
    }
}
/* Twitter api POST request end*/

//Resolve Text Variables to vars
function resolve_text(text) {
    s = String(text);
    for (key in lookup) {
        s = s.replace('$' + key, global[lookup[key]]);
    }
    return s;
}
/* Bot function end */