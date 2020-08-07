// @flow

import * as React from 'react';
import {List, withTheme} from 'react-native-paper';
import {View} from 'react-native';
import i18n from 'i18n-js';
import {StackNavigationProp} from '@react-navigation/stack';
import type {CustomThemeType} from '../../managers/ThemeManager';
import type {ListIconPropsType} from '../../constants/PaperStyles';

type PropsType = {
  navigation: StackNavigationProp,
  theme: CustomThemeType,
};

class ActionsDashBoardItem extends React.Component<PropsType> {
  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {props} = this;
    return nextProps.theme.dark !== props.theme.dark;
  }

  render(): React.Node {
    const {navigation} = this.props;
    return (
      <View>
        <List.Item
          title={i18n.t('screens.feedback.homeButtonTitle')}
          description={i18n.t('screens.feedback.homeButtonSubtitle')}
          left={(props: ListIconPropsType): React.Node => (
            <List.Icon
              color={props.color}
              style={props.style}
              icon="comment-quote"
            />
          )}
          right={(props: ListIconPropsType): React.Node => (
            <List.Icon
              color={props.color}
              style={props.style}
              icon="chevron-right"
            />
          )}
          onPress={(): void => navigation.navigate('feedback')}
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
