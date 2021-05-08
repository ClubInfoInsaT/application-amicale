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
import { View, ViewProps, ViewStyle } from 'react-native';
import { List, withTheme } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';
import { AnimatableProperties } from 'react-native-animatable';
import { ClassicComponent } from 'react';
import GENERAL_STYLES from '../../constants/Styles';

type PropsType = {
  theme: ReactNativePaper.Theme;
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  left?: (props: {
    color: string;
    style?: {
      marginRight: number;
      marginVertical?: number;
    };
  }) => React.ReactNode;
  opened?: boolean;
  unmountWhenCollapsed?: boolean;
  children?: React.ReactNode;
};

type StateType = {
  expanded: boolean;
};

class AnimatedAccordion extends React.Component<PropsType, StateType> {
  viewRef:
    | null
    | (ClassicComponent<AnimatableProperties<ViewStyle>> & ViewProps);
  handleViewRef = (
    ref: ClassicComponent<AnimatableProperties<ViewStyle>> & ViewProps
  ) => (this.viewRef = ref);

  chevronIcon: string;

  animStart: string;

  animEnd: string;

  getAccordionAnimation():
    | Animatable.Animation
    | string
    | Animatable.CustomAnimation {
    // I don't knwo why ts is complaining
    // The type definitions must be broken because this is a valid style and it works
    if (this.state.expanded) {
      return {
        from: {
          // @ts-ignore
          rotate: this.animStart,
        },
        to: {
          // @ts-ignore
          rotate: this.animEnd,
        },
      };
    } else {
      return {
        from: {
          // @ts-ignore
          rotate: this.animEnd,
        },
        to: {
          // @ts-ignore
          rotate: this.animStart,
        },
      };
    }
  }

  constructor(props: PropsType) {
    super(props);
    this.chevronIcon = '';
    this.animStart = '';
    this.animEnd = '';
    this.state = {
      expanded: props.opened != null ? props.opened : false,
    };
    this.viewRef = null;
    this.setupChevron();
  }

  shouldComponentUpdate(nextProps: PropsType): boolean {
    const { state, props } = this;
    // TODO refactor this, it shouldn't even work
    if (nextProps.opened != null && nextProps.opened !== props.opened) {
      state.expanded = nextProps.opened;
    }
    return true;
  }

  setupChevron() {
    const { expanded } = this.state;
    if (expanded) {
      this.chevronIcon = 'chevron-up';
      this.animStart = '180deg';
      this.animEnd = '0deg';
    } else {
      this.chevronIcon = 'chevron-down';
      this.animStart = '0deg';
      this.animEnd = '180deg';
    }
  }

  toggleAccordion = () => {
    // const { expanded } = this.state;
    this.setState((prevState: StateType): { expanded: boolean } => ({
      expanded: !prevState.expanded,
    }));
  };

  render() {
    const { props, state } = this;
    const { colors } = props.theme;
    return (
      <View style={props.style}>
        <List.Item
          title={props.title}
          description={props.subtitle}
          titleStyle={state.expanded ? { color: colors.primary } : null}
          onPress={this.toggleAccordion}
          right={(iconProps) => (
            <Animatable.View
              animation={this.getAccordionAnimation()}
              duration={300}
              useNativeDriver={true}
            >
              <List.Icon
                style={{ ...iconProps.style, ...GENERAL_STYLES.center }}
                icon={this.chevronIcon}
                color={state.expanded ? colors.primary : iconProps.color}
              />
            </Animatable.View>
          )}
          left={props.left}
        />
        <Collapsible collapsed={!state.expanded}>
          {!props.unmountWhenCollapsed ||
          (props.unmountWhenCollapsed && state.expanded)
            ? props.children
            : null}
        </Collapsible>
      </View>
    );
  }
}

export default withTheme(AnimatedAccordion);
