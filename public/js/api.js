const cache = {};


/**
 * @param {string} query Query
 * @returns {Promise<{id : string,title : string}[]>} array of result
 */
export const search = async (query) => {
    try {
        if (cache[query]) {
            console.log(`Using cache for ${query}`);
            return cache[query];
        }
        const response = await fetch("/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query
            })
        })
        const result = await response.json();
        cache[query] = result;
        console.log(`Setting cache for ${query}`);
        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param {string} showId Show ID
 * @returns {Promise<{episode_number : string,episode_name : string}[]>} array of episodes
 */
export const getEpisodes = async (showId) => {
    try {
        if (cache[showId]) {
            console.log(`Using cache for ${showId}`);
            return cache[showId];
        }
        const response = await fetch("/episodes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    showId
                })
            }
        )
        const data = await response.json();
        cache[showId] = data;
        console.log(`Setting cache for ${showId}`);
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param {string} showId Show ID
 * @param {string} epsNumber Episode Number
 * @returns {Promise<{'360p': string, '480p': string, '720p': string, '360p_size' : string, '480p_size' : string, '720p_size' : string}>} Download link
 */
 export const getDownloadLink = async (showId, epsNumber) => {
    try {
        if (cache[`${showId}_${epsNumber}`]) {
            console.log(`Using cache for ${showId}_${epsNumber}`);
            return cache[`${showId}_${epsNumber}`];
        }
        const response = await fetch("/download",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    showId,
                    epsNumber
                })
            }
        )

        const data = await response.json();
        cache[`${showId}_${epsNumber}`] = data;
        console.log(`Setting cache for ${showId}_${epsNumber}`);
        return data;
    } catch (error) {
        throw error;
    }
}


/**
 * 
 * @param {string} showId Show ID
 * @param {string} epsNumber Episode Number
 * @returns {Promise<{'360p': string, '480p': string, '720p': string, '360p_size' : string, '480p_size' : string, '720p_size' : string}>} Download link
 */
 export const getFastDownloadLink = async (showId, epsNumber) => {
    try {
        if (cache[`fast_${showId}_${epsNumber}`]) {
            console.log(`Using cache for fast_${showId}_${epsNumber}`);
            return cache[`fast_${showId}_${epsNumber}`];
        }
        const response = await fetch("/fast_download",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    showId,
                    epsNumber
                })
            }
        )

        const data = await response.json();
        cache[`fast_${showId}_${epsNumber}`] = data;
        console.log(`Setting cache for fast_${showId}_${epsNumber}`);
        return data;
    } catch (error) {
        throw error;
    }
}