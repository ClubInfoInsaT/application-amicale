// @flow

import * as React from 'react';
import {View} from 'react-native';
import {List, withTheme} from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';
import type {CustomThemeType} from '../../managers/ThemeManager';

type PropsType = {
  theme: CustomThemeType,
  title: string,
  subtitle?: string,
  left?: () => React.Node,
  opened?: boolean,
  unmountWhenCollapsed?: boolean,
  children?: React.Node,
};

type StateType = {
  expanded: boolean,
};

const AnimatedListIcon = Animatable.createAnimatableComponent(List.Icon);

class AnimatedAccordion extends React.Component<PropsType, StateType> {
  static defaultProps = {
    subtitle: '',
    left: null,
    opened: null,
    unmountWhenCollapsed: false,
    children: null,
  };

  chevronRef: {current: null | AnimatedListIcon};

  chevronIcon: string;

  animStart: string;

  animEnd: string;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      expanded: props.opened != null ? props.opened : false,
    };
    this.chevronRef = React.createRef();
    this.setupChevron();
  }

  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {state, props} = this;
    if (nextProps.opened != null && nextProps.opened !== props.opened)
      state.expanded = nextProps.opened;
    return true;
  }

  setupChevron() {
    const {state} = this;
    if (state.expanded) {
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
    const {state} = this;
    if (this.chevronRef.current != null) {
      this.chevronRef.current.transitionTo({
        rotate: state.expanded ? this.animStart : this.animEnd,
      });
      this.setState({expanded: !state.expanded});
    }
  };

  render(): React.Node {
    const {props, state} = this;
    const {colors} = props.theme;
    return (
      <View>
        <List.Item
          title={props.title}
          subtitle={props.subtitle}
          titleStyle={state.expanded ? {color: colors.primary} : undefined}
          onPress={this.toggleAccordion}
          right={({size}: {size: number}): React.Node => (
            <AnimatedListIcon
              ref={this.chevronRef}
              size={size}
              icon={this.chevronIcon}
              color={state.expanded ? colors.primary : undefined}
              useNativeDriver
            />
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
