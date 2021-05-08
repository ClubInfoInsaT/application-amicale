import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { FAB } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

interface Props {
  icon: string;
  focusedIcon: string;
  focused: boolean;
  onPress: () => void;
}

Animatable.initializeRegistryWithDefinitions({
  fabFocusIn: {
    0: {
      // @ts-ignore
      scale: 1,
      translateY: 0,
    },
    0.4: {
      // @ts-ignore
      scale: 1.2,
      translateY: -9,
    },
    0.6: {
      // @ts-ignore
      scale: 1.05,
      translateY: -6,
    },
    0.8: {
      // @ts-ignore
      scale: 1.15,
      translateY: -6,
    },
    1: {
      // @ts-ignore
      scale: 1.1,
      translateY: -6,
    },
  },
  fabFocusOut: {
    0: {
      // @ts-ignore
      scale: 1.1,
      translateY: -6,
    },
    1: {
      // @ts-ignore
      scale: 1,
      translateY: 0,
    },
  },
});

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 60,
  },
  fab: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

const FOCUSED_ICON = require('../../../assets/tab-icon.png');
const UNFOCUSED_ICON = require('../../../assets/tab-icon-outline.png');

function TabHomeIcon(props: Props) {
  const getImage = (iconProps: { size: number; color: string }) => {
    return (
      <Animatable.View useNativeDriver={true} animation={'rubberBand'}>
        <Image
          source={props.focused ? FOCUSED_ICON : UNFOCUSED_ICON}
          style={{
            width: iconProps.size,
            height: iconProps.size,
            tintColor: iconProps.color,
          }}
        />
      </Animatable.View>
    );
  };

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Animatable.View
          style={styles.fab}
          useNativeDriver={true}
          duration={props.focused ? 500 : 200}
          animation={props.focused ? 'fabFocusIn' : 'fabFocusOut'}
          easing={'ease-out'}
        >
          <FAB
            onPress={props.onPress}
            animated={false}
            icon={getImage}
            color={'#fff'}
          />
        </Animatable.View>
      </View>
    </View>
  );
}

export default TabHomeIcon;
