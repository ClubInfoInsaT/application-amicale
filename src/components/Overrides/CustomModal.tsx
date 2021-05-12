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

import React, { Ref } from 'react';
import { useTheme } from 'react-native-paper';
import { Modalize } from 'react-native-modalize';
import { View } from 'react-native-animatable';
import { TAB_BAR_HEIGHT } from '../Tabbar/CustomTabBar';

type Props = {
  children?: React.ReactChild | null;
};

/**
 * Abstraction layer for Modalize component, using custom configuration
 *
 * @param props Props to pass to the element. Must specify an onRef prop to get an Modalize ref.
 * @return {*}
 */
function CustomModal(props: Props, ref?: Ref<Modalize>) {
  const theme = useTheme();
  const { children } = props;
  return (
    <Modalize
      ref={ref}
      adjustToContentHeight
      handlePosition="inside"
      modalStyle={{ backgroundColor: theme.colors.card }}
      handleStyle={{ backgroundColor: theme.colors.primary }}
    >
      <View
        style={{
          paddingBottom: TAB_BAR_HEIGHT,
        }}
      >
        {children}
      </View>
    </Modalize>
  );
}

export default React.forwardRef(CustomModal);
