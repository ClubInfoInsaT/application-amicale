// @flow

import * as React from 'react';
import {Image} from 'react-native';
import {List, withTheme} from 'react-native-paper';
import type {CustomTheme} from '../../../managers/ThemeManager';
import type {ServiceItemType} from '../../../managers/ServicesManager';

type PropsType = {
  item: ServiceItemType,
  isActive: boolean,
  height: number,
  onPress: () => void,
  theme: CustomTheme,
};

class DashboardEditItem extends React.Component<PropsType> {
  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {isActive} = this.props;
    return nextProps.isActive !== isActive;
  }

  render(): React.Node {
    const {props} = this;
    return (
      <List.Item
        title={props.item.title}
        description={props.item.subtitle}
        onPress={props.isActive ? null : props.onPress}
        left={(): React.Node => (
          <Image
            source={{uri: props.item.image}}
            style={{
              width: 40,
              height: 40,
            }}
          />
        )}
        right={({size}: {size: number}): React.Node =>
          props.isActive ? (
            <List.Icon
              size={size}
              icon="check"
              color={props.theme.colors.success}
            />
          ) : null
        }
        style={{
          height: props.height,
          justifyContent: 'center',
          paddingLeft: 30,
          backgroundColor: props.isActive
            ? props.theme.colors.proxiwashFinishedColor
            : 'transparent',
        }}
      />
    );
  }
}

export default withTheme(DashboardEditItem);
