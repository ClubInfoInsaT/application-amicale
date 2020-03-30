// @flow

/**
 * Read data from FETCH_URL and return it.
 * If no data was found, returns an empty object
 *
 * @param url The urls to fetch data from
 * @return {Promise<Object>}
 */
export async function readData(url: string) {
    let fetchedData: Object = {};
    try {
        let response = await fetch(url);
        fetchedData = await response.json();
    } catch (error) {
        throw new Error('Could not read FetchedData from server');
    }
    return fetchedData;
}
