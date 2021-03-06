const request = require('request');
const sanitize = require("sanitize-filename");
const fs = require('fs');
const sc_tags = require('./sc-tags');
const sc_events = require('./utils/sc-events');

var outputfolder = "./";

const downloadStreams = (trackInfos, client_id, outputFolder) => {
    if (!trackInfos || typeof trackInfos === "array") {
        sc_events.emit('progress', `No tracks to download`);
    } else {
        if (outputFolder) {
            outputfolder = outputFolder;
        }
        sc_events.emit('progress', `Downloading ${trackInfos.length} tracks`);
        const dlArry = [];
        for (let i = 0; i < trackInfos.length; i++) {
            const trackInfo = trackInfos[i];
            dlArry.push(downloadStream(trackInfo, client_id))
        }
        return Promise.all(dlArry).then(function () {
            sc_events.emit('progress', 'All Done!');
        });
    }
}

const downloadStream = (trackInfo, client_id) => {
    return new Promise((fulfill, reject) => {
        const trackUri = trackInfo.media.transcodings[1].url;
        const filename = sanitize(trackInfo.title);

        request(`${trackUri}?client_id=${client_id}`, (err, res, body) => {
            res = JSON.parse(body);
            const stream = request(res.url)
                .pipe(fs.createWriteStream(`${outputfolder}${filename}.mp3`));

            stream.on('finish', () => {
                sc_events.emit('progress', `Pulled track: ${filename}`);
                sc_tags.appendTags(stream.path, trackInfo).then(() => {
                    sc_events.emit('count', `Tagged`);
                    fulfill();
                });
            });
            
            stream.on('error', reject);

        }).on('error', (e) => {
            reject(e);
        });
    });
}

module.exports = {
    downloadStreams
};