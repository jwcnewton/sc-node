const request = require('request');
const soundcloudAPI = 'http://api.soundcloud.com'

const getAllTracks = (userId, options) => {
    return new Promise((fulfill, reject) => {
        const uri = createLikesUri(soundcloudAPI, userId, options.filterOptions.limit, options.client_id);
        request(uri, (err, res, body) => {
            if(!body.length || typeof body !== "string"){
                reject("Could not any tracks");
            } else { 
                const allTracks = JSON.parse(body);
                fulfill(allTracks);
            }   
        }).on('error', (e) => {
            reject(e);
        });
    });
}

const getUserId = (userName, client_id) => {
    return new Promise((fulfill, reject) => {
        const uri = createGetUserIDUri(userName, client_id);
        request(uri, (err, res, body) => {
            if(!body.length || typeof body !== "string"){
                reject("Could not retrieve user information, check user name is correct");
            } else {
                const userInfo = JSON.parse(body);
                if (!userInfo || !userInfo.id) {
                    reject("Could not retrieve user information, check user name is correct");
                } else {
                    fulfill(userInfo.id);
                }
            }
        }).on('error', (e) => {
            reject(e);
        });
    });
}

module.exports = {
    getAllTracks,
    getUserId
};

const createLikesUri = (soundcloudAPI, userId, limit, client_id) => {
    return `${soundcloudAPI}/users/${userId}/favorites?limit=${limit}format=json&client_id=${client_id}`;
}

const createGetUserIDUri = (userName, clientId) => {
    return `${soundcloudAPI}/resolve.json?url=http://soundcloud.com/${userName}&client_id=${clientId}`
}
