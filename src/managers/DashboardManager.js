// @flow

import type {ServiceItem} from './ServicesManager';
import ServicesManager from './ServicesManager';
import {getSublistWithIds} from '../utils/Utils';
import AsyncStorageManager from './AsyncStorageManager';

export default class DashboardManager extends ServicesManager {
  getCurrentDashboard(): Array<ServiceItem | null> {
    const dashboardIdList = AsyncStorageManager.getObject(
      AsyncStorageManager.PREFERENCES.dashboardItems.key,
    );
    const allDatasets = [
      ...this.amicaleDataset,
      ...this.studentsDataset,
      ...this.insaDataset,
      ...this.specialDataset,
    ];
    return getSublistWithIds(dashboardIdList, allDatasets);
  }
}
