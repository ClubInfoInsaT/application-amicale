import React from 'react';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GENERAL_STYLES from '../../constants/Styles';

interface Props {
  focused: boolean;
  label: string | undefined;
  icon: string;
  focusedIcon: string;
  onPress: () => void;
}

Animatable.initializeRegistryWithDefinitions({
  focusIn: {
    0: {
      // @ts-ignore
      scale: 1,
      translateY: 0,
    },
    0.4: {
      // @ts-ignore
      scale: 1.3,
      translateY: 6,
    },
    0.6: {
      // @ts-ignore
      scale: 1.1,
      translateY: 6,
    },
    0.8: {
      // @ts-ignore
      scale: 1.25,
      translateY: 6,
    },
    1: {
      // @ts-ignore
      scale: 1.2,
      translateY: 6,
    },
  },
  focusOut: {
    0: {
      // @ts-ignore
      scale: 1.2,
      translateY: 6,
    },
    1: {
      // @ts-ignore
      scale: 1,
      translateY: 0,
    },
  },
});

function TabSideIcon(props: Props) {
  const theme = useTheme();
  const color = props.focused ? theme.colors.primary : theme.colors.disabled;
  let icon = props.focused ? props.focusedIcon : props.icon;
  return (
    <TouchableRipple
      onPress={props.onPress}
      borderless
      rippleColor={theme.colors.primary}
      style={{
        ...styles.ripple,
        borderTopEndRadius: theme.roundness,
        borderTopStartRadius: theme.roundness,
      }}
    >
      <View>
        <Animatable.View
          duration={props.focused ? 500 : 200}
          easing="ease-out"
          animation={props.focused ? 'focusIn' : 'focusOut'}
          useNativeDriver
        >
          <MaterialCommunityIcons
            name={icon}
            color={color}
            size={26}
            style={GENERAL_STYLES.centerHorizontal}
          />
        </Animatable.View>
        <Animatable.Text
          animation={props.focused ? 'fadeOutDown' : 'fadeIn'}
          useNativeDriver
          style={{
            color: color,
            ...styles.text,
          }}
        >
          {props.label}
        </Animatable.Text>
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  ripple: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    ...GENERAL_STYLES.centerHorizontal,
    fontSize: 10,
  },
});

export default TabSideIcon;
