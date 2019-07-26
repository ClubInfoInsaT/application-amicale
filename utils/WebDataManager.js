import {Toast} from "native-base";

export default class WebDataManager {

    FETCH_URL : string;
    lastDataFetched : Object = {};


    constructor(url) {
        this.FETCH_URL = url;
    }

    async readData() {
        let fetchedData : Object = {};
        try {
            let response = await fetch(this.FETCH_URL);
            fetchedData = await response.json();
        } catch (error) {
            console.log('Could not read FetchedData from server');
            console.log(error);
        }
        this.lastDataFetched = fetchedData;
        return fetchedData;
    }

    isDataObjectValid() {
        return Object.keys(this.lastDataFetched).length > 0;
    }

    showUpdateToast(successString, errorString) {
        let isSuccess = this.isDataObjectValid();
        Toast.show({
            text: isSuccess ? successString : errorString,
            buttonText: 'OK',
            type: isSuccess ? "success" : "danger",
            duration: 2000
        })
    }

}
