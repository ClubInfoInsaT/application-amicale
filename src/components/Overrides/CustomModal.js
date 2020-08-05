// @flow

import * as React from 'react';
import {withTheme} from 'react-native-paper';
import {Modalize} from 'react-native-modalize';
import {View} from 'react-native-animatable';
import CustomTabBar from '../Tabbar/CustomTabBar';
import type {CustomThemeType} from '../../managers/ThemeManager';

/**
 * Abstraction layer for Modalize component, using custom configuration
 *
 * @param props Props to pass to the element. Must specify an onRef prop to get an Modalize ref.
 * @return {*}
 */
function CustomModal(props: {
  theme: CustomThemeType,
  onRef: (re: Modalize) => void,
  children?: React.Node,
}): React.Node {
  const {theme, onRef, children} = props;
  return (
    <Modalize
      ref={onRef}
      adjustToContentHeight
      handlePosition="inside"
      modalStyle={{backgroundColor: theme.colors.card}}
      handleStyle={{backgroundColor: theme.colors.primary}}>
      <View
        style={{
          paddingBottom: CustomTabBar.TAB_BAR_HEIGHT,
        }}>
        {children}
      </View>
    </Modalize>
  );
}

CustomModal.defaultProps = {children: null};

export default withTheme(CustomModal);
