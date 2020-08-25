// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import Mascot, {MASCOT_STYLE} from '../Mascot/Mascot';

const styles = StyleSheet.create({
  center: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

class MascotIntroEnd extends React.Component<null> {
  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Node {
    return (
      <View style={{flex: 1}}>
        <Mascot
          style={{
            ...styles.center,
            width: '80%',
          }}
          emotion={MASCOT_STYLE.COOL}
          animated
          entryAnimation={{
            animation: 'slideInDown',
            duration: 2000,
          }}
          loopAnimation={{
            animation: 'pulse',
            duration: 2000,
            iterationCount: 'infinite',
          }}
        />
      </View>
    );
  }
}

export default MascotIntroEnd;
