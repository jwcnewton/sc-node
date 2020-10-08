const request = require('request');
const soundcloudAPI = 'https://api-v2.soundcloud.com'

const getAllTracks = (userId, options) => {
    return new Promise((fulfill, reject) => {
        const uri = createLikesUri(soundcloudAPI, userId, options.filterOptions.limit, options.client_id);
        request(uri, (err, res, body) => {
            if(!body || typeof body !== "string"){
                reject("Could not retrieve any tracks");
            } else { 
                const allTracks = JSON.parse(body);
                fulfill(allTracks);
            }   
        }).on('error', (e) => {
            reject(e);
        });
    });
}

const getAllPlaylistInfo = (options) => {
    return new Promise((fulfill, reject) => {
        const uri = createPlaylistUri(soundcloudAPI, options.playlist_url, options.client_id);
        request(uri, (err, res, body) => {
            if(!body || typeof body !== "string"){
                reject("Could not get playlist tracks");
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
            if(!body || typeof body !== "string"){
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

const getUserDetails = (userName, client_id) => {
    return new Promise((fulfill, reject) => {
        const uri = createGetUserIDUri(userName, client_id);
        request(uri, (err, res, body) => {
            if(!body || typeof body !== "string"){
                reject("Could not retrieve user information, check user name is correct");
            } else {
                const userInfo = JSON.parse(body);
                if (!userInfo || !userInfo.id) {
                    reject("Could not retrieve user information, check user name is correct");
                } else {
                    fulfill(userInfo);
                }
            }
        }).on('error', (e) => {
            reject(e);
        });
    });
}

module.exports = {
    getAllTracks,
    getUserId,
    getUserDetails,
    getAllPlaylistInfo
};

const createLikesUri = (soundcloudAPI, userId, limit, client_id) => {
    return `${soundcloudAPI}/users/${userId}/favorites?limit=${limit}format=json&client_id=${client_id}`;
}

const createPlaylistUri = (soundcloudAPI, playlistUri, clientId) => {
    return `${soundcloudAPI}/resolve?url=${playlistUri}?format=json&client_id=${clientId}`
}

const createGetUserIDUri = (userName, clientId) => {
    return `${soundcloudAPI}/resolve?url=http://soundcloud.com/${userName}&client_id=${clientId}`
}
