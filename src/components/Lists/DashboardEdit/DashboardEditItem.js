// @flow

import * as React from 'react';
import {Image} from 'react-native';
import {List, withTheme} from 'react-native-paper';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import type {ServiceItemType} from '../../../managers/ServicesManager';
import type {ListIconPropsType} from '../../../constants/PaperStyles';

type PropsType = {
  item: ServiceItemType,
  isActive: boolean,
  height: number,
  onPress: () => void,
  theme: CustomThemeType,
};

class DashboardEditItem extends React.Component<PropsType> {
  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {isActive} = this.props;
    return nextProps.isActive !== isActive;
  }

  render(): React.Node {
    const {item, onPress, height, isActive, theme} = this.props;
    return (
      <List.Item
        title={item.title}
        description={item.subtitle}
        onPress={isActive ? null : onPress}
        left={(): React.Node => (
          <Image
            source={{uri: item.image}}
            style={{
              width: 40,
              height: 40,
            }}
          />
        )}
        right={(props: ListIconPropsType): React.Node =>
          isActive ? (
            <List.Icon
              style={props.style}
              icon="check"
              color={theme.colors.success}
            />
          ) : null
        }
        style={{
          height,
          justifyContent: 'center',
          paddingLeft: 30,
          backgroundColor: isActive
            ? theme.colors.proxiwashFinishedColor
            : 'transparent',
        }}
      />
    );
  }
}

export default withTheme(DashboardEditItem);
