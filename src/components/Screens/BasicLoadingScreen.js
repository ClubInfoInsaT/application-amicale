// @flow

import * as React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, withTheme} from 'react-native-paper';
import type {CustomTheme} from '../../managers/ThemeManager';

/**
 * Component used to display a header button
 *
 * @param props Props to pass to the component
 * @return {*}
 */
function BasicLoadingScreen(props: {
  theme: CustomTheme,
  isAbsolute: boolean,
}): React.Node {
  const {theme, isAbsolute} = props;
  const {colors} = theme;
  let position;
  if (isAbsolute != null && isAbsolute) position = 'absolute';

  return (
    <View
      style={{
        backgroundColor: colors.background,
        position,
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
      }}>
      <ActivityIndicator animating size="large" color={colors.primary} />
    </View>
  );
}

export default withTheme(BasicLoadingScreen);
