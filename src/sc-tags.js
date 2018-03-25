const nodeID3 = require('node-id3');
const sc_events = require('./utils/sc-events');

const appendTags = (path, trackInfo) => {
    return new Promise((fulfill, reject) => {
        const tags = {
            title: trackInfo.title,
            artist: trackInfo.user.username,
            genre: trackInfo.genre
        }

        sc_events.emit('progress', 'Appending tags');
        nodeID3.create(tags, function (frame) {
            nodeID3.write(tags, path, fulfill);
        })
    });

}

module.exports = {
    appendTags
};