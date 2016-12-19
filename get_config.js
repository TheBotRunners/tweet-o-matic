module.exports = {
    get_post: function() {
        return String(exports.posts[Math.floor(Math.random()*posts.length)]);
    },

    get_follow_reply: function() {
        return String(exports.follow_reply[Math.floor(Math.random()*follow_reply.length)]);
    }
};

posts        = String(readFileAsArray('./config/posts.txt'));
follow_reply = String(readFileAsArray('./config/follow_reply.txt'));

function readFileAsArray(filename) {
    // Read file as string, split into array at line break and filter empty entries
    return String(require('fs').readFileSync(filename).toString().split('\n').filter(s=>s!=''));
}