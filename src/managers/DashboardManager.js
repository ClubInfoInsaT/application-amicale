// @flow

import type {ServiceItem} from "./ServicesManager";
import ServicesManager from "./ServicesManager";
import {StackNavigationProp} from "@react-navigation/stack";
import {getSublistWithIds} from "../utils/Utils";
import AsyncStorageManager from "./AsyncStorageManager";


export default class DashboardManager extends ServicesManager{

    constructor(nav: StackNavigationProp) {
        super(nav)
    }

    getCurrentDashboard(): Array<ServiceItem> {
        const dashboardIdList = JSON.parse(AsyncStorageManager.getInstance().preferences.dashboardItems.current);
        const allDatasets = [
            ...this.amicaleDataset,
            ...this.studentsDataset,
            ...this.insaDataset,
            ...this.specialDataset,
        ];
        return getSublistWithIds(dashboardIdList, allDatasets);
    }
}
