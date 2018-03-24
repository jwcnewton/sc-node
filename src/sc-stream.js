const request = require('request');
const sanitize = require("sanitize-filename");
const fs = require('fs');
const sc_tags = require('./sc-tags');
const sc_events = require('./utils/sc-events');

const downloadStreams = (trackInfos, client_id) => {
    sc_events.emit('progress', `Downloading ${trackInfos.length} tracks`);
    const dlArry = [];
    for (let i = 0; i < trackInfos.length; i++) {
        const trackInfo = trackInfos[i];
        dlArry.push(downloadStream(trackInfo, client_id))
    }
    Promise.all(dlArry).then(function(){
        sc_events.emit('progress', 'All Done!');
    });
}

const downloadStream = (trackInfo, client_id) => {
    return new Promise((fulfill, reject) => {
        const trackUri = trackInfo.downloadable ? trackInfo.download_url : trackInfo.stream_url;
        const filename = sanitize(trackInfo.title);

        const stream = request(`${trackUri}?client_id=${client_id}`)
            .pipe(fs.createWriteStream(`${filename}.${trackInfo.original_format}`))

        stream.on('finish', () => {
            sc_events.emit('progress', `Pulled track: ${filename}`);
            sc_tags.appendTags(stream.path, trackInfo).then(fulfill)
        });
        stream.on('error', reject);
    });
}

module.exports = {
    downloadStreams
};