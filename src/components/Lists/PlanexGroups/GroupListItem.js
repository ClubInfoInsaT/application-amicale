// @flow

import * as React from 'react';
import {IconButton, List, withTheme} from 'react-native-paper';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import type {PlanexGroupType} from '../../../screens/Planex/GroupSelectionScreen';

type PropsType = {
  theme: CustomThemeType,
  onPress: () => void,
  onStarPress: () => void,
  item: PlanexGroupType,
  height: number,
};

type StateType = {
  isFav: boolean,
};

class GroupListItem extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      isFav: props.item.isFav !== undefined && props.item.isFav,
    };
  }

  shouldComponentUpdate(prevProps: PropsType, prevState: StateType): boolean {
    const {isFav} = this.state;
    return prevState.isFav !== isFav;
  }

  onStarPress = () => {
    const {props} = this;
    this.setState((prevState: StateType): StateType => ({
      isFav: !prevState.isFav,
    }));
    props.onStarPress();
  };

  render(): React.Node {
    const {props, state} = this;
    const {colors} = props.theme;
    return (
      <List.Item
        title={props.item.name}
        onPress={props.onPress}
        left={({size}: {size: number}): React.Node => (
          <List.Icon size={size} icon="chevron-right" />
        )}
        right={({size, color}: {size: number, color: string}): React.Node => (
          <IconButton
            size={size}
            icon="star"
            onPress={this.onStarPress}
            color={state.isFav ? colors.tetrisScore : color}
          />
        )}
        style={{
          height: props.height,
          justifyContent: 'center',
        }}
      />
    );
  }
}

export default withTheme(GroupListItem);
