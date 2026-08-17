/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import type { PlanningEventType } from '../../utils/Planning';
import SmallDashboardItem from './SmallDashboardItem';
import DashboardItem from './EventDashboardItem';
import PreviewEventDashboardItem from './PreviewEventDashboardItem';
import type { ServiceItemType } from '../../utils/Services';
import { readData } from '../../utils/WebData';
import Urls from '../../constants/Urls';
import { getDisplayEvent, getFutureEvents } from '../../utils/Home';
import { useNavigation } from '@react-navigation/native';
import { TabRoutes } from '../../navigation/TabNavigator';

export type FullDashboardType = {
  today_menu: Array<{ [key: string]: object }>;
  available_dryers: number;
  available_washers: number;
  today_events: Array<PlanningEventType>;
  available_tutorials: number;
  latest_notification: number;
};

export type RawDashboardType = {
  dashboard: FullDashboardType;
};

type Props = {
  services: Array<ServiceItemType | undefined>;
  style?: object;
};

const styles = StyleSheet.create({
  dashboardRow: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
});

/**
 * Gets a dashboard shortcut item
 *
 * @param item
 * @param dashboardData
 * @returns {*}
 */
const DashboardShortcutItem = ({
  item,
  dashboardData,
}: {
  item: ServiceItemType | undefined;
  dashboardData: FullDashboardType | null;
}) => {
  if (item != null) {
    return (
      <SmallDashboardItem
        image={item.image}
        onPress={item.onPress}
        badgeCount={
          dashboardData != null && item.badgeFunction != null
            ? item.badgeFunction(dashboardData)
            : undefined
        }
      />
    );
  }
  return <SmallDashboardItem />;
};

/**
 * Component that renders a horizontal row of dashboard shortcuts
 * and the event dashboard, managing its own dashboard data fetching.
 */
function DashboardShortcuts({ services, style }: Props) {
  const [dashboardData, setDashboardData] =
    React.useState<FullDashboardType | null>(null);
  const navigation = useNavigation();

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await readData<RawDashboardType>(Urls.app.dashboard);
        if (data?.dashboard) {
          setDashboardData(data.dashboard);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const renderItem = ({ item }: { item: ServiceItemType | undefined }) => (
    <DashboardShortcutItem item={item} dashboardData={dashboardData} />
  );

  const onEventContainerClick = () => navigation.navigate(TabRoutes.Planning);

  const getDashboardEvent = (content: Array<PlanningEventType>) => {
    const futureEvents = getFutureEvents(content);
    const displayEvent = getDisplayEvent(futureEvents);
    return (
      <DashboardItem
        eventNumber={futureEvents.length}
        clickAction={onEventContainerClick}
      >
        <PreviewEventDashboardItem
          event={displayEvent}
          clickAction={onEventContainerClick}
        />
      </DashboardItem>
    );
  };

  return (
    <>
      <FlatList
        data={services}
        renderItem={renderItem}
        horizontal
        contentContainerStyle={[styles.dashboardRow, style]}
      />
      {dashboardData != null
        ? getDashboardEvent(dashboardData.today_events)
        : null}
    </>
  );
}

export default DashboardShortcuts;
