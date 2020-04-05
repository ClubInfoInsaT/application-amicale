// @flow

/**
 * Read data from FETCH_URL and return it.
 * If no data was found, returns an empty object
 *
 * @param url The urls to fetch data from
 * @return {Promise<Object>}
 */
export async function readData(url: string) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(async (response) => response.json())
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject();
            });
    });
}
