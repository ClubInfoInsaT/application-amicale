import {Toast} from "native-base";

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
            // console.log('Could not read FetchedData from server');
            // console.log(error);
            throw new Error('Could not read FetchedData from server');
        }
        this.lastDataFetched = fetchedData;
        return fetchedData;
    }

    /**
     * Detects if the fetched data is not an empty object
     *
     * @return
     */
    isDataObjectValid(): boolean {
        return Object.keys(this.lastDataFetched).length > 0;
    }

    /**
     * Show a toast message depending on the validity of the fetched data
     *
     * @param errorString
     */
    showUpdateToast(errorString) {
        let isSuccess = this.isDataObjectValid();
        if (!isSuccess) {
            Toast.show({
                text: errorString,
                buttonText: 'OK',
                type: isSuccess ? "success" : "danger",
                duration: 2000
            });
        }
    }

}
