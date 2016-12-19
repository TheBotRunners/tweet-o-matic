module.exports = {
    posts: String(readFileAsArray('./config/posts.txt')),
    follow_reply: readFileAsArray('./config/follow_reply.txt'),
    
    get_post: function() {
        return String(globals.posts[Math.floor(Math.random()*posts.length)]);
    },

    get_follow_reply: function() {
        return String(globals.follow_reply[Math.floor(Math.random()*follow_reply.length)]);
    }
};

function readFileAsArray(filename) {
    // Read file as string, split into array at line break and filter empty entries
    return String(require('fs').readFileSync(filename).toString().split('\n').filter(s=>s!=''));
}