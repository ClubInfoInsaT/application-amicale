// @flow

import * as React from 'react';
import {Collapsible} from 'react-navigation-collapsible';
import {CommonActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import CardList from '../../components/Lists/CardList/CardList';
import CustomTabBar from '../../components/Tabbar/CustomTabBar';
import withCollapsible from '../../utils/withCollapsible';
import type {ServiceCategoryType} from '../../managers/ServicesManager';

type PropsType = {
  navigation: StackNavigationProp,
  route: {params: {data: ServiceCategoryType | null}},
  collapsibleStack: Collapsible,
};

class ServicesSectionScreen extends React.Component<PropsType> {
  finalDataset: ServiceCategoryType;

  constructor(props: PropsType) {
    super(props);
    this.handleNavigationParams();
  }

  /**
   * Recover the list to display from navigation parameters
   */
  handleNavigationParams() {
    const {props} = this;
    if (props.route.params != null) {
      if (props.route.params.data != null) {
        this.finalDataset = props.route.params.data;
        // reset params to prevent infinite loop
        props.navigation.dispatch(CommonActions.setParams({data: null}));
        props.navigation.setOptions({
          headerTitle: this.finalDataset.title,
        });
      }
    }
  }

  render(): React.Node {
    const {props} = this;
    const {
      containerPaddingTop,
      scrollIndicatorInsetTop,
      onScroll,
    } = props.collapsibleStack;
    return (
      <CardList
        dataset={this.finalDataset.content}
        isHorizontal={false}
        onScroll={onScroll}
        contentContainerStyle={{
          paddingTop: containerPaddingTop,
          paddingBottom: CustomTabBar.TAB_BAR_HEIGHT + 20,
        }}
        scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
      />
    );
  }
}

export default withCollapsible(ServicesSectionScreen);
