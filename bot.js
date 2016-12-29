/* Start up */

/* Initialize Logging */
const EOL = require('os').EOL;
const package = require('./package.json');
const moment = require('moment');
const fs = require('fs');
const util = require('util');
const path = require('path');
const mkdirp = require('mkdirp');
init_logging('./logs/' + moment().format('YYYY-MM-DD-hh-mm-ss'), 5);    // Guess what? This Statement - yes, you are right! - initializes the Logging
const cw = require('./consolewriter.js');
cw.setSeparatorChar('=');
cw.setInlineSeparatorChar('#');
/* Init complete */

const figlet = require('figlet')
console.log(figlet.textSync('Tweet-o-matic', {}));

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
var time = moment().format('HH:mm:ss')  // gets the system time
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
T.get('search/tweets', params, gotData);
/* Twitter api GET request end*/

/* Twitter api POST request*/

/*Setting up a User Stream*/


/*Setting up a User Stream*/
var stream = T.stream('user');

if (modules.following_Event == true) {
    stream.on('follow', followEvent);
    function followEvent(eventMSG) {
        // stream.on = T.stream('follow', followEvent);
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
    stream.on('tweet', tweetEvent);
    function tweetEvent(eventMSG) {
        // stream.on = T.stream('tweeting', tweetEvent);
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
        var json = JSON.stringify(eventMSG, null, 2);
        fs.writeFile('call.json', json);
        console.log(cw.get('Tweet Event'));
    }
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
 * Initialize Logging.
 * @param logfile The file to log to.
 * @param max_logfiles Maximum Amount of Logfiles to keep.
 */
function init_logging(logfile, max_logfiles) {
    var containingFolderPath = path.dirname(logfile);   // Get Logfolder from Logpath
    mkdirp.sync(containingFolderPath);                  // Make sure containing Folder and every Folder along the Path are existing and create them if not

    // BEGIN Removal of old Logfiles
    var files = fs.readdirSync(containingFolderPath);   // Read Log Directory

    if (files.length >= max_logfiles) {                 // Check wether there are more Files than allowed
        var regex = /[0-9]{4}(-[0-9]{2}){5}.log/;       // RegEx to recognize Logfiles
        var logs = [];                                  // Logfiles in folder
        files.forEach(function (item, index, array)     // Filter for Logfile RegEx (There could be other Files in the Directory, who knows?)
        { if (item.match(regex)) logs.push(item); });

        if (logs.length >= max_logfiles) {              // Recheck if recognized Files are still too many
            var oldestFile = "";                        // Name of oldest Log
            var oldestDate = Number.MAX_SAFE_INTEGER;   // Oldest Logfile Date (Initialized with highest Value possible, since we search for Dates lower then the previous oldest Date)

            logs.forEach(function (item, index, array) {// Compare Logfiles by Creation Date and select oldest
                var date = item.substring(0, item.lastIndexOf('.')).replace(/-/g, '');
                if (date < oldestDate) { oldestDate = date; oldestFile = item; }
            });

            fs.unlinkSync(containingFolderPath + '/' + oldestFile); // Delete oldest Log
        }
    }
    // END Removal of old Logfiles

    // BEGIN Actual Initialization
    var index = logfile.lastIndexOf('.');
    if (index == -1 || logfile.substring(index) != '.log') { logfile += '.log'; }   // Verify that the Logfile specified ends with '.log'
    fs.writeFileSync(logfile,"Tweet-o-Matic "                                       // Write Log Signature
                            + require('./package.json').version
                            + " Log File from "
                            + moment().format('MMMM Do YYYY, hh:mm:ss')
                            + require('os').EOL.repeat(2));
    console_default = new console.Console(process.stdout);                          // Create new default Console with STDOUT set to the Console

    console.log = function () {                                                     // Overwrite log Routine of System Console
        console_default.log(util.format.apply(console_default, arguments));
        util.format.apply(this, arguments).split(EOL).forEach(function (item, index, array) { fs.appendFileSync(logfile, (item) + EOL); });
    }
    // END Actual Initialization
}
/* Bot function end */