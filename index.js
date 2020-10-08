const sc_scraper = require('./src/sc-scraper');
const sc_stream = require('./src/sc-stream');
const sc_events = require('./src/utils/sc-events');

function SC(options) {
    const handleErrorResponse = (err) => {
        sc_events.emit('err', err);
    }
    if(!options){
        throw "Missing args";
    }
    if (!options.userId) {
        return sc_scraper.getUserId(options.userName, options.client_id)
            .then((userId) => {
                return sc_scraper.getAllTracks(userId, options)
            }, handleErrorResponse)
            .then((links) => {
                return sc_stream.downloadStreams(links, options.client_id);
            }, handleErrorResponse);
    } else {
        return sc_scraper.getAllTracks(options.userId, options)
            .then((links) => {
                return sc_stream.downloadStreams(links, options.client_id);
            }, handleErrorResponse);
    }
}

SC.events = sc_events;

exports = module.exports = SC;
