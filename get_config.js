module.exports = {
    get_post: function() {
        return String(posts[Math.floor(Math.random()*posts.length)]);
    },

    get_follow_reply: function() {
        return String(follow_reply[Math.floor(Math.random()*follow_reply.length)]);
    }
};

var posts        = readFileAsArray('./config/posts.txt');
var follow_reply = readFileAsArray('./config/follow_reply.txt');

function readFileAsArray(filename) {
    // Read file as string, split into array at line break and filter empty entries
    return require('fs').readFileSync(filename).toString().split('\n').filter(s=>s!='');
}