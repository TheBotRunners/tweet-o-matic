/* Start up */

/* Initialize Logging */
const EOL = require('os').EOL;
init_logging('./tweet-o-matic.log');    // Guess what? This Statement - yes, you are right! - initializes the Logging
var cw = require('./consolewriter.js');
cw.setSeparatorChar('=');
cw.setInlineSeparatorChar('#');
/* Init complete */

//Importing Config files
cw.add('   Fetching local Data  ...');
var Twit = require('twit'); // Import Twit package
cw.add('      ==> Getting OAuth Keys');
var oauth_keys = require('./config/oauth_keys.js'); // Import tokens from Twitter API :P
cw.add('      ==> Getting the Configuration');
var config = require('./get_config.js');
cw.add('      ==> Getting the Modules configuration');
var modules = require('./config/modules.json');
cw.add('      ==> Getting Admin data');
var admin = require('./config/admin.json'); // Import your Data
cw.add('      ==> Setting up variable resolving Table');
var lookup = require('./lookup.json'); //Setup variable resolving Table
cw.add('      ==> Setting Global Varriabels');
/* Global Var's */
var time = new Date().toLocaleTimeString()// gets the system time
var tweet_it = config.get_post();
var f_tweet = config.get_follow_reply();
var params = {
    q: admin.search_querry, //search querry from admin.json
    count: admin.count_call //total counts of returning data from admin.json
}
/* Global Var's end */
cw.add('   Testing imported Data');
cw.add('      ==> Data from get_post() ' + config.get_post());
cw.add('      ==> Data from get_follow_reply() ' + config.get_follow_reply());
cw.add('   Establishing conection to Twitter ...');
// Creating new Twit object with OAuth credentials you get from config
var T = new Twit(oauth_keys);
// Sending a Tweet that the bot is started
if (modules.startup_tweet == true) {
    cw.add('   The Start up is finished sending tweet to Admin');
    tweeting(admin.admin_handel + ' Start up without any Problems at ' + time + ' #Bot');
}

console.log(cw.get('The Bot is Starting \\(^-^)/'));
setTimeout(console.log, 3000);  //dramatic pause for effect (^⊙﹏⊙^)
/* Start up end */


/* Bot function */

T.get('search/tweets', params, gotData);
if (modules.api_call == true) {
    function gotData(err, data) {
        var call = data.statuses; //statuses
        for (var i = 0; i < call.length; i++) {
            console.log('');
            cw.add('   Name: ' + call[i].name);
            cw.add('   ID: ' + call[i].id);
            cw.add('   ID STR: ' + call[i].id_str);
            cw.add('   Tweet text: ' + call[i].text);
            cw.add('   screen_name: ' + call[i].user.screen_name);
            cw.add('   user_mentions: ' + call[i].user.user_mentions);
            console.log(cw.get('Tweet'));
        }

        console.log('');
        if (err) {
            cw.add('Oh no! ಠ_ಠ Something went wrong while i tried to fetch tweets (╥﹏╥) ');
            console.log(cw.get('Error'));
        } else {
            cw.add('Yes! (^._.^)ﾉ It worked i just fetched some precious tweets from Twitter!');
            console.log(cw.get('Success!'));
        }
    }
}
/* Twitter api GET request end*/

/* Twitter api POST request*/

/*Setting up a User Stream*/


stream.on('tweet', tweetEvent);
/*Setting up a User Stream*/
if (modules.following_Event == true) {
    stream.on('follow', followEvent);
    function followEvent(eventMSG) {
        var name = eventMSG.source.name;
        var screenName = eventMSG.source.screen_name;
        cw.add('I was followed by ' + screenName + ' (˘▽˘>ԅ( ˘⌣˘)');
        var r = Math.floor(Math.random() * 100);
        var f_tweet = config.get_follow_reply();
        tweeting('@' + screenName + ' ' + f_tweet + ' #bot' + ' #Noch' + r + 'Teller');
        console.log(cw.get('Follow'));
    }
}
if (modules.tweeting_Event == true) {
    var stream = T.stream('user');
    function tweetEvent(eventMSG) {
        var from = eventMSG.user.screen_name;
        var replyto = eventMSG.in_reply_to_screen_name;
        var text = eventMSG.text;
        cw.add(from + ' tweeted at me! <3');
        if (replyto === admin.bot_name) {
            var r = Math.floor(Math.random() * 100);
            var replyTweet = '@' + from + ' #klirren #Bot' + ' #Noch' + r + 'Teller'
            tweeting(replyTweet);
            //console.log(tweet);
        }
        var fs = require('fs');
        var json = JSON.stringify(eventMSG, null, 2);
        fs.writeFile('call.json', json);
    }
    console.log(cw.get('Tweet Event'));
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
    function tweeted(err, data) {
        if (err) {
            cw.add('Oh no! ಠ_ಠ Somthing went wrong while i tried to tweet (╥﹏╥)');
            console.log(cw.get('Error'));
        } else {
            cw.add('Yes! (^._.^)ﾉ It worked i just posted somthing on Twitter');
            cw.add(tweet);
            console.log(cw.get('Tweet'));
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

/**
 * Initialize Logging
 */
function init_logging(logfile) {
    var fs = require('fs');
    var util = require('util');
    var moment = require('moment');
    
    fs.writeFileSync(logfile, "Tweet-o-Matic " + require('./package.json').version + " Log File from " + moment().format('MMMM Do YYYY, h:mm:ss a') + require('os').EOL.repeat(2));
    console_default = new console.Console(process.stdout);
    console_hybrid = new console.Console(process.stdout);

    console.log = function () {
        console_default.log(util.format.apply(console_default, arguments));
        var tmp = util.format.apply(this, arguments);
        var test = tmp.split(EOL);
        test.forEach(function (item, index, array) {
            fs.appendFileSync(logfile, (item) + EOL);
        });
    }
}
/* Bot function end */