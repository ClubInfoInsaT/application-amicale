// @flow

import * as React from 'react';
import {View} from 'react-native';
import {Headline, withTheme} from 'react-native-paper';
import i18n from 'i18n-js';
import type {CustomThemeType} from '../../../managers/ThemeManager';

type PropsType = {
  theme: CustomThemeType,
};

class VoteNotAvailable extends React.Component<PropsType> {
  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Node {
    const {props} = this;
    return (
      <View
        style={{
          width: '100%',
          marginTop: 10,
          marginBottom: 10,
        }}>
        <Headline
          style={{
            color: props.theme.colors.textDisabled,
            textAlign: 'center',
          }}>
          {i18n.t('screens.vote.noVote')}
        </Headline>
      </View>
    );
  }
}

export default withTheme(VoteNotAvailable);
