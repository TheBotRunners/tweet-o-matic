    /* Start up */
    console.log('===============================================================');
    console.log('#   The Bot is Starting ＼(^-^)／');
    //Importing Config files
    console.log('#   Fetching local Data  ...');
    var Twit = require('twit'); // Import Twit package
    console.log('#      ==> Geting OAuth Keys');
    var oauth_keys = require('./config/oauth_keys'); // Import tokens from Twitter API :P
    console.log('#      ==> Geting the Configuration');
    var config = require('./get_config');
    console.log('#      ==> Geting the Modules configuration');
    var modules = require('./config/modules');
    console.log('#      ==> Geting Admin data');
    var admin = require('./config/admin'); // Import your Data
    console.log('#      ==> Seting up variable resolving Table');
    var lookup = require('./lookup'); //Setup variable resolving Table
    //var cw = require('./consolewriter.js');
    console.log('#   Data from get_post()' + config.get_post());
    console.log('#   Data from get_follow_reply()' + config.get_follow_reply());
    console.log('#   Establishing conection to Twitter ...');
    // Creating new Twit object with OAuth credentials you get from config
    var T = new Twit(oauth_keys);
    // Sending a Tweet that the bot is started
    console.log('#   The Start up is finished sending tweet to Admin');
    var time = new Date().toLocaleTimeString()// gets the system time
    if(modules.startup_tweet == true){
        tweeting(admin.admin_handel +' Start up without any Problems at '+time+' #Bot' );
    }
    
    var sleep = require('sleep');
    console.log('===============================================================');
    console.log('');
    sleep.sleep(1);//dramatic pause for effect (^⊙﹏⊙^)
    /* Start up end */
    /* Global Var's */
        var tweet_it = config.get_post();
        var f_tweet = config.get_follow_reply();
        var params = {
            q: admin.search_querry, //search querry from admin.json
            count: admin.count_call //total counts of returning data from admin.json
        }
    /* Global Var's end */
    /* Bot function */

    /* Twitter api GET request*/
    /*function apiCall(data){
        var fs = require('fs');
        var json = JSON.stringify(data,null,2);
        fs.writeFile('call.json',json);
    }*/
    T.get('search/tweets', params, gotData);

    function gotData(err, data) {
        var call = data.statuses; //statuses
        for (var i = 0; i < call.length; i++) {
            console.log('===============================================================');
            console.log('#   Name: ' + call[i].name);
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
            console.log('===============================================================');
            console.log('Oh no! ಠ_ಠ Something went wrong while i tried to fetch tweets (╥﹏╥) ');
            console.log('===============================================================');
        } else {
            console.log('===============================================================');
            console.log('Yes! (^._.^)ﾉ It worked i just fetched some precious tweets from Twitter!');
            console.log('===============================================================');
        }
    }
    /* Twitter api GET request end*/

    /* Twitter api POST request*/

    /*Setting up a User Stream*/
    var stream = T.stream('user');
    stream.on('follow', followEvent);
    stream.on('tweet', tweetEvent);
    /*Setting up a User Stream*/

    function followEvent(eventMSG) {
        console.log('===============================================================');
        var name = eventMSG.source.name;
        var screenName = eventMSG.source.screen_name;
        console.log('I was followed by ' + screenName + ' (˘▽˘>ԅ( ˘⌣˘)');
        var r = Math.floor(Math.random() * 100);
        var f_tweet = config.get_follow_reply();
        tweeting('@' + screenName + ' ' + f_tweet + ' #bot' + ' #Noch'+r+'Teller');
        console.log('===============================================================');
    }
    function tweetEvent(eventMSG) {
        console.log('===============================================================');
        var from = eventMSG.user.screen_name;
        var replyto = eventMSG.in_reply_to_screen_name;
        var text = eventMSG.text;
        console.log(from + ' tweeted at me! <3');
        if (replyto === admin.bot_name){
            var r = Math.floor(Math.random() * 100);
            var replyTweet = '@' + from + ' #klirren #Bot' + ' #Noch'+r+'Teller'
            tweeting(replyTweet);
           //console.log(tweet);
        }     
        
        var fs = require('fs');
        var json = JSON.stringify(eventMSG,null,2);
        fs.writeFile('call.json',json);
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
        function tweeted(err, data) {
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