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

import React, { useEffect, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';
import GENERAL_STYLES from '../../constants/Styles';

type PropsType = {
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
  enabled?: boolean;
  renderItem: () => React.ReactNode;
};

function AnimatedAccordion(props: PropsType) {
  const theme = useTheme();

  const [expanded, setExpanded] = React.useState(props.opened);
  const lastOpenedProp = useRef(props.opened);
  const chevronIcon = useRef(props.opened ? 'chevron-up' : 'chevron-down');
  const animStart = useRef(props.opened ? '180deg' : '0deg');
  const animEnd = useRef(props.opened ? '0deg' : '180deg');
  const enabled = props.enabled !== false;

  const getAccordionAnimation = ():
    | Animatable.Animation
    | string
    | Animatable.CustomAnimation => {
    // I don't knwo why ts is complaining
    // The type definitions must be broken because this is a valid style and it works
    if (expanded) {
      return {
        from: {
          // @ts-ignore
          rotate: animStart.current,
        },
        to: {
          // @ts-ignore
          rotate: animEnd.current,
        },
      };
    } else {
      return {
        from: {
          // @ts-ignore
          rotate: animEnd.current,
        },
        to: {
          // @ts-ignore
          rotate: animStart.current,
        },
      };
    }
  };

  useEffect(() => {
    // Force the expanded state to follow the prop when changing
    if (!enabled) {
      setExpanded(false);
    } else if (
      props.opened !== undefined &&
      props.opened !== lastOpenedProp.current
    ) {
      setExpanded(props.opened);
    }
  }, [enabled, props.opened]);

  const toggleAccordion = () => setExpanded(!expanded);

  const renderChildren =
    !props.unmountWhenCollapsed || (props.unmountWhenCollapsed && expanded);
  return (
    <View style={props.style}>
      <List.Item
        title={props.title}
        description={props.subtitle}
        descriptionNumberOfLines={2}
        titleStyle={expanded ? { color: theme.colors.primary } : null}
        onPress={enabled ? toggleAccordion : undefined}
        right={
          enabled
            ? (iconProps) => (
                <Animatable.View
                  animation={getAccordionAnimation()}
                  duration={300}
                  useNativeDriver={true}
                >
                  <List.Icon
                    style={{ ...iconProps.style, ...GENERAL_STYLES.center }}
                    icon={chevronIcon.current}
                    color={expanded ? theme.colors.primary : iconProps.color}
                  />
                </Animatable.View>
              )
            : undefined
        }
        left={props.left}
      />
      {enabled ? (
        <Collapsible collapsed={!expanded}>
          {renderChildren ? props.renderItem() : null}
        </Collapsible>
      ) : null}
    </View>
  );
}

export default AnimatedAccordion;
