// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Mascot, {MASCOT_STYLE} from '../Mascot/Mascot';

const styles = StyleSheet.create({
  center: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

class MascotIntroWelcome extends React.Component<null> {
  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Node {
    return (
      <View style={{flex: 1}}>
        <Mascot
          style={{
            ...styles.center,
            height: '80%',
          }}
          emotion={MASCOT_STYLE.NORMAL}
          animated
          entryAnimation={{
            animation: 'bounceIn',
            duration: 2000,
          }}
        />
        <Animatable.Text
          useNativeDriver
          animation="fadeInUp"
          duration={500}
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: 25,
          }}>
          PABLO
        </Animatable.Text>
        <Animatable.View
          useNativeDriver
          animation="fadeInUp"
          duration={500}
          delay={200}
          style={{
            position: 'absolute',
            bottom: 30,
            right: '20%',
            width: 50,
            height: 50,
          }}>
          <MaterialCommunityIcons
            style={{
              ...styles.center,
              transform: [{rotateZ: '70deg'}],
            }}
            name="undo"
            color="#fff"
            size={40}
          />
        </Animatable.View>
      </View>
    );
  }
}

export default MascotIntroWelcome;
