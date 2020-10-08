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
                fulfill(allTracks.collection);
            }   
        }).on('error', (e) => {
            reject(e);
        });
    });
}

const getAllPlaylistInfo = (options) => {
    return new Promise((fulfill, reject) => {
        return getPlaylist(options).then((playlistInfo) => {
            let completeTracks = playlistInfo.tracks.filter(x => x.uri != undefined)
            let missingTracks = playlistInfo.tracks.filter(x => x.uri == undefined).map(x => x.id);
            return getTracks({ client_id: options.client_id, tracks: missingTracks }).then((tracks) => {
                playlistInfo.tracks = [...completeTracks, ...tracks];
                fulfill(playlistInfo);
            }, reject);
        }, reject);
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

const getPlaylist = (options) => {
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

const getTracks = (options) => {
    return new Promise((fulfill, reject) => {
        const uri = createGetTracksUri(soundcloudAPI, options.tracks, options.client_id);
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
    return `${soundcloudAPI}/users/${userId}/track_likes?client_id=${client_id}&limit=${limit}`;
}

const createPlaylistUri = (soundcloudAPI, playlistUri, clientId) => {
    return `${soundcloudAPI}/resolve?url=${playlistUri}&client_id=${clientId}`
}

const createGetUserIDUri = (userName, clientId) => {
    return `${soundcloudAPI}/resolve?url=http://soundcloud.com/${userName}&client_id=${clientId}`
}

const createGetTracksUri = (soundcloudAPI, track_ids, clientId) => {
    return `${soundcloudAPI}/tracks?ids=${track_ids.join(",")}&client_id=${clientId}`
}