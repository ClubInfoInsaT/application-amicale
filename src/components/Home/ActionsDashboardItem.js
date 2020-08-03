// @flow

import * as React from 'react';
import {List, withTheme} from 'react-native-paper';
import {View} from 'react-native';
import i18n from 'i18n-js';
import {StackNavigationProp} from '@react-navigation/stack';
import type {CustomTheme} from '../../managers/ThemeManager';

type PropsType = {
  navigation: StackNavigationProp,
  theme: CustomTheme,
};

class ActionsDashBoardItem extends React.Component<PropsType> {
  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {props} = this;
    return nextProps.theme.dark !== props.theme.dark;
  }

  render(): React.Node {
    const {props} = this;
    return (
      <View>
        <List.Item
          title={i18n.t('screens.feedback.homeButtonTitle')}
          description={i18n.t('screens.feedback.homeButtonSubtitle')}
          left={({size}: {size: number}): React.Node => (
            <List.Icon size={size} icon="comment-quote" />
          )}
          right={({size}: {size: number}): React.Node => (
            <List.Icon size={size} icon="chevron-right" />
          )}
          onPress={(): void => props.navigation.navigate('feedback')}
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            marginLeft: 10,
            marginRight: 10,
          }}
        />
      </View>
    );
  }
}

export default withTheme(ActionsDashBoardItem);
