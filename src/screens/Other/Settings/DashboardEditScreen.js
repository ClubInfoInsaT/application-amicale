// @flow

import * as React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button, Card, Paragraph, withTheme} from 'react-native-paper';
import {FlatList} from 'react-native';
import {View} from 'react-native-animatable';
import i18n from 'i18n-js';
import type {
  ServiceCategoryType,
  ServiceItemType,
} from '../../../managers/ServicesManager';
import DashboardManager from '../../../managers/DashboardManager';
import DashboardItem from '../../../components/Home/EventDashboardItem';
import DashboardEditAccordion from '../../../components/Lists/DashboardEdit/DashboardEditAccordion';
import DashboardEditPreviewItem from '../../../components/Lists/DashboardEdit/DashboardEditPreviewItem';
import AsyncStorageManager from '../../../managers/AsyncStorageManager';
import CollapsibleFlatList from '../../../components/Collapsible/CollapsibleFlatList';

type PropsType = {
  navigation: StackNavigationProp,
};

type StateType = {
  currentDashboard: Array<ServiceItemType | null>,
  currentDashboardIdList: Array<string>,
  activeItem: number,
};

/**
 * Class defining the Settings screen. This screen shows controls to modify app preferences.
 */
class DashboardEditScreen extends React.Component<PropsType, StateType> {
  content: Array<ServiceCategoryType>;

  initialDashboard: Array<ServiceItemType | null>;

  initialDashboardIdList: Array<string>;

  constructor(props: PropsType) {
    super(props);
    const dashboardManager = new DashboardManager(props.navigation);
    this.initialDashboardIdList = AsyncStorageManager.getObject(
      AsyncStorageManager.PREFERENCES.dashboardItems.key,
    );
    this.initialDashboard = dashboardManager.getCurrentDashboard();
    this.state = {
      currentDashboard: [...this.initialDashboard],
      currentDashboardIdList: [...this.initialDashboardIdList],
      activeItem: 0,
    };
    this.content = dashboardManager.getCategories();
  }

  getDashboardRowRenderItem = ({
    item,
    index,
  }: {
    item: DashboardItem,
    index: number,
  }): React.Node => {
    const {activeItem} = this.state;
    return (
      <DashboardEditPreviewItem
        image={item.image}
        onPress={() => {
          this.setState({activeItem: index});
        }}
        isActive={activeItem === index}
      />
    );
  };

  getDashboard(content: Array<DashboardItem>): React.Node {
    return (
      <FlatList
        data={content}
        extraData={this.state}
        renderItem={this.getDashboardRowRenderItem}
        horizontal
        contentContainerStyle={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 5,
        }}
      />
    );
  }

  getRenderItem = ({item}: {item: ServiceCategoryType}): React.Node => {
    const {currentDashboardIdList} = this.state;
    return (
      <DashboardEditAccordion
        item={item}
        onPress={this.updateDashboard}
        activeDashboard={currentDashboardIdList}
      />
    );
  };

  getListHeader(): React.Node {
    const {currentDashboard} = this.state;
    return (
      <Card style={{margin: 5}}>
        <Card.Content>
          <View style={{padding: 5}}>
            <Button
              mode="contained"
              onPress={this.undoDashboard}
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 10,
              }}>
              {i18n.t('screens.settings.dashboardEdit.undo')}
            </Button>
            <View style={{height: 50}}>
              {this.getDashboard(currentDashboard)}
            </View>
          </View>
          <Paragraph style={{textAlign: 'center'}}>
            {i18n.t('screens.settings.dashboardEdit.message')}
          </Paragraph>
        </Card.Content>
      </Card>
    );
  }

  updateDashboard = (service: ServiceItemType) => {
    const {currentDashboard, currentDashboardIdList, activeItem} = this.state;
    currentDashboard[activeItem] = service;
    currentDashboardIdList[activeItem] = service.key;
    this.setState({
      currentDashboard,
      currentDashboardIdList,
    });
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.dashboardItems.key,
      currentDashboardIdList,
    );
  };

  undoDashboard = () => {
    this.setState({
      currentDashboard: [...this.initialDashboard],
      currentDashboardIdList: [...this.initialDashboardIdList],
    });
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.dashboardItems.key,
      this.initialDashboardIdList,
    );
  };

  render(): React.Node {
    return (
      <CollapsibleFlatList
        data={this.content}
        renderItem={this.getRenderItem}
        ListHeaderComponent={this.getListHeader()}
        style={{}}
      />
    );
  }
}

export default withTheme(DashboardEditScreen);
