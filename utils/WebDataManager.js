
/**
 * Class used to get json data from the web
 */
export default class WebDataManager {

    FETCH_URL: string;
    lastDataFetched: Object = {};


    constructor(url) {
        this.FETCH_URL = url;
    }

    /**
     * Read data from FETCH_URL and return it.
     * If no data was found, returns an empty object
     *
     * @return {Promise<Object>}
     */
    async readData() {
        let fetchedData: Object = {};
        try {
            let response = await fetch(this.FETCH_URL);
            fetchedData = await response.json();
        } catch (error) {
            throw new Error('Could not read FetchedData from server');
        }
        this.lastDataFetched = fetchedData;
        return fetchedData;
    }

}
